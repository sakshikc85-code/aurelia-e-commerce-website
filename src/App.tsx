import { useEffect, useState } from 'react';
import { AtelierConcierge } from './components/AtelierConcierge';
import { CartDrawer } from './components/CartDrawer';
import { CollectionSection } from './components/CollectionSection';
import { CraftsmanshipSection } from './components/CraftsmanshipSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CATALOG_PIECES } from './data/catalogMedia';
import type {
  CartItem,
  CatalogPiece,
  ConciergeConsultation,
  OrderRecord,
} from './types/aurelia';
import { readStorage, writeStorage } from './utils/format';

const STORAGE_KEYS = {
  cart: 'aurelia_salon_bag_v1',
  wishlist: 'aurelia_wishlist_v1',
  consultations: 'aurelia_concierge_dossiers_v1',
  orders: 'aurelia_orders_v1',
};

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() =>
    readStorage<CartItem[]>(STORAGE_KEYS.cart, []),
  );
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.wishlist, []),
  );
  const [consultations, setConsultations] = useState<ConciergeConsultation[]>(() =>
    readStorage<ConciergeConsultation[]>(STORAGE_KEYS.consultations, []),
  );
  const [orders, setOrders] = useState<OrderRecord[]>(() =>
    readStorage<OrderRecord[]>(STORAGE_KEYS.orders, []),
  );

  const [inspectedPiece, setInspectedPiece] = useState<CatalogPiece | null>(null);
  const [bagOpen, setBagOpen] = useState(false);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.cart, cart);
  }, [cart]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.wishlist, wishlistIds);
  }, [wishlistIds]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.consultations, consultations);
  }, [consultations]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.orders, orders);
  }, [orders]);

  const bagCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function handleToggleWishlist(pieceId: string) {
    setWishlistIds((prev) =>
      prev.includes(pieceId) ? prev.filter((id) => id !== pieceId) : [...prev, pieceId],
    );
  }

  function handleAddToBag(piece: CatalogPiece, variant?: string) {
    const chosenVariant = variant ?? piece.variants[0] ?? 'Standard';
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.pieceId === piece.id && item.variant === chosenVariant,
      );
      if (existing) {
        return prev.map((item) =>
          item.pieceId === piece.id && item.variant === chosenVariant
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { pieceId: piece.id, variant: chosenVariant, quantity: 1 }];
    });
    setBagOpen(true);
  }

  function handleUpdateQuantity(pieceId: string, variant: string, delta: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.pieceId === pieceId && item.variant === variant
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function handleRemoveItem(pieceId: string, variant: string) {
    setCart((prev) =>
      prev.filter((item) => !(item.pieceId === pieceId && item.variant === variant)),
    );
  }

  function handleSaveConsultation(consultation: ConciergeConsultation) {
    setConsultations((prev) => [consultation, ...prev].slice(0, 8));
  }

  function handleSubmitOrder(details: {
    clientName: string;
    clientEmail: string;
    deliveryCity: string;
    notes: string;
  }): OrderRecord {
    const pieceMap = new Map(CATALOG_PIECES.map((p) => [p.id, p]));
    const orderItems = cart
      .map((item) => {
        const piece = pieceMap.get(item.pieceId);
        if (!piece) return null;
        return {
          pieceId: piece.id,
          name: piece.name,
          reference: piece.reference,
          variant: item.variant,
          quantity: item.quantity,
          unitPrice: piece.price,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    const newOrder: OrderRecord = {
      orderNumber: `AUR-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      clientName: details.clientName,
      clientEmail: details.clientEmail,
      deliveryCity: details.deliveryCity,
      notes: details.notes,
      items: orderItems,
      subtotal,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    return newOrder;
  }

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] flex flex-col">
      <Header bagCount={bagCount} onOpenBag={() => setBagOpen(true)} />

      <main className="flex-1">
        <HeroSection
          onExploreCollection={() => scrollToSection('collection')}
          onOpenConcierge={() => scrollToSection('concierge')}
        />

        <CollectionSection
          pieces={CATALOG_PIECES}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onInspectPiece={setInspectedPiece}
          onQuickAdd={(piece) => handleAddToBag(piece)}
        />

        <AtelierConcierge
          pieces={CATALOG_PIECES}
          wishlistIds={wishlistIds}
          consultations={consultations}
          onSaveConsultation={handleSaveConsultation}
          onClearHistory={() => setConsultations([])}
          onInspectPiece={setInspectedPiece}
          onAddToBag={(piece) => handleAddToBag(piece)}
        />

        <CraftsmanshipSection onOpenConcierge={() => scrollToSection('concierge')} />
      </main>

      <Footer />

      <ProductDetailModal
        piece={inspectedPiece}
        isSaved={inspectedPiece ? wishlistIds.includes(inspectedPiece.id) : false}
        onClose={() => setInspectedPiece(null)}
        onToggleWishlist={handleToggleWishlist}
        onAddToBag={handleAddToBag}
      />

      <CartDrawer
        isOpen={bagOpen}
        items={cart}
        pieces={CATALOG_PIECES}
        orders={orders}
        onClose={() => setBagOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onSubmitOrder={handleSubmitOrder}
      />
    </div>
  );
}
