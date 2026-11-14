import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { CATALOG_META } from './src/data/catalogMeta.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const VALID_IDS = new Set(CATALOG_META.map((item) => item.id));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function generateWithRetry<T>(operation: () => Promise<T>, maxAttempts = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        const delayMs = 450 * attempt;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}

interface ConciergeRequestBody {
  query?: string;
  occasion?: string;
  savedIds?: string[];
}

interface RawConciergePayload {
  editorialNote?: string;
  stylingNotes?: string[];
  recommendations?: Array<{
    pieceId?: string;
    pairingReason?: string;
  }>;
}

async function startServer(): Promise<void> {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.post('/api/concierge', async (req: Request, res: Response) => {
    const body = (req.body ?? {}) as ConciergeRequestBody;
    const query = typeof body.query === 'string' ? body.query.trim() : '';
    const occasion = typeof body.occasion === 'string' ? body.occasion.trim() : '';
    const savedIds = Array.isArray(body.savedIds)
      ? body.savedIds.filter((id): id is string => typeof id === 'string' && VALID_IDS.has(id))
      : [];

    if (!query || query.length < 3) {
      res.status(400).json({
        error: 'Please share a brief description of your occasion, preferred aesthetic, or timepiece interest.',
      });
      return;
    }

    if (query.length > 800) {
      res.status(400).json({
        error: 'Please keep your atelier inquiry concise (under 800 characters).',
      });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'Atelier Concierge is unavailable until a Gemini API key is configured in Settings > Secrets.',
      });
      return;
    }

    const catalogSummary = CATALOG_META.map((piece) => ({
      id: piece.id,
      reference: piece.reference,
      name: piece.name,
      category: piece.category,
      material: piece.material,
      price: piece.price,
      summary: piece.summary,
    }));

    const prompt = [
      `Client Request: ${query}`,
      occasion ? `Occasion Context: ${occasion}` : '',
      savedIds.length > 0 ? `Client Saved Pieces: ${savedIds.join(', ')}` : '',
      '',
      'Available Aurelia Salon Catalog (select ONLY from these exact piece IDs):',
      JSON.stringify(catalogSummary, null, 2),
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const response = await generateWithRetry(() =>
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            systemInstruction:
              'You are the Head of Private Client Curation at Aurelia Haute Horlogerie & Fashion (Geneva & Paris). ' +
              'Compose calm, authoritative, understated quiet-luxury styling and horological counsel. ' +
              'Recommend 2 or 3 pieces strictly using exact `id` values from the provided Aurelia catalog. ' +
              'Keep editorialNote to 2–3 refined sentences (max 70 words). Provide 3 concise stylingNotes (under 18 words each) covering metal harmony, texture pairing, and proportion.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                editorialNote: {
                  type: Type.STRING,
                  description: 'A refined 2-3 sentence curatorial perspective tailored to the client request.',
                },
                stylingNotes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Three concise, practical sartorial and horological pairing guidelines.',
                },
                recommendations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      pieceId: {
                        type: Type.STRING,
                        description: 'Exact catalog piece id from the provided Aurelia catalog.',
                      },
                      pairingReason: {
                        type: Type.STRING,
                        description: '1-2 concise sentences explaining why this piece belongs in the ensemble.',
                      },
                    },
                    required: ['pieceId', 'pairingReason'],
                  },
                },
              },
              required: ['editorialNote', 'stylingNotes', 'recommendations'],
            },
          },
        }),
      );

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({
          error: 'The Atelier Concierge returned an empty response. Please try again.',
        });
        return;
      }

      const parsed = JSON.parse(rawText) as RawConciergePayload;
      const validRecommendations = (parsed.recommendations ?? [])
        .filter((rec): rec is { pieceId: string; pairingReason: string } => {
          return Boolean(rec.pieceId && VALID_IDS.has(rec.pieceId) && rec.pairingReason);
        })
        .slice(0, 3);

      const recommendations =
        validRecommendations.length > 0
          ? validRecommendations
          : [
              {
                pieceId: CATALOG_META[0].id,
                pairingReason:
                  'A foundational 18k champagne gold signature calibrated for understated evening presence.',
              },
              {
                pieceId: CATALOG_META[3].id,
                pairingReason:
                  'Architectural obsidian cashmere silhouette that frames warm gold horology effortlessly.',
              },
            ];

      res.json({
        editorialNote:
          parsed.editorialNote?.trim() ||
          'Our Geneva and Paris salons recommend anchoring your silhouette in obsidian textures illuminated by brushed 18k champagne gold.',
        stylingNotes: (parsed.stylingNotes ?? []).filter(Boolean).slice(0, 3),
        recommendations,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected Atelier Concierge error';
      const status =
        message.includes('403') || message.includes('PERMISSION_DENIED') || message.includes('API_KEY')
          ? 403
          : message.includes('429') || message.includes('RESOURCE_EXHAUSTED')
            ? 429
            : 500;

      const clientMessage =
        status === 403
          ? 'Gemini API authentication failed. Please verify GEMINI_API_KEY in Settings > Secrets.'
          : status === 429
            ? 'Concierge request quota was momentarily reached. Please wait a brief moment and retry.'
            : 'Unable to reach the Atelier Concierge right now. Please try again.';

      res.status(status).json({ error: clientMessage });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aurelia Atelier server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Aurelia server:', err);
  process.exit(1);
});
