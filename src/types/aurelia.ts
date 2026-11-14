export type CategoryFilter =
  | 'All Pieces'
  | 'Haute Horlogerie'
  | 'Evening Couture'
  | 'Fine Jewellery'
  | 'Saved';

export type ProductCategory = 'Haute Horlogerie' | 'Evening Couture' | 'Fine Jewellery';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface CatalogPieceMeta {
  id: string;
  reference: string;
  name: string;
  category: ProductCategory;
  material: string;
  price: number;
  availability: string;
  summary: string;
  craftStory: string;
  variantLabel: string;
  variants: string[];
  specs: ProductSpec[];
}

export interface CatalogPiece extends CatalogPieceMeta {
  image: string;
  imageAlt: string;
}

export interface CartItem {
  pieceId: string;
  variant: string;
  quantity: number;
}

export interface OrderRecord {
  orderNumber: string;
  createdAt: string;
  clientName: string;
  clientEmail: string;
  deliveryCity: string;
  notes: string;
  items: Array<{
    pieceId: string;
    name: string;
    reference: string;
    variant: string;
    quantity: number;
    unitPrice: number;
  }>;
  subtotal: number;
}

export interface ConciergeRecommendation {
  pieceId: string;
  pairingReason: string;
}

export interface ConciergeConsultation {
  id: string;
  query: string;
  occasion: string;
  createdAt: string;
  editorialNote: string;
  stylingNotes: string[];
  recommendations: ConciergeRecommendation[];
}
