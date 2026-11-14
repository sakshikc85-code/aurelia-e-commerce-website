import { useEffect, useState } from 'react';
import { Check, Minus, Plus, Trash2, X } from 'lucide-react';
import type { CartItem, CatalogPiece, OrderRecord } from '../types/aurelia';
import { formatPrice, formatShortDate } from '../utils/format';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  pieces: CatalogPiece[];
  orders: OrderRecord[];
  onClose: () => void;
  onUpdateQuantity: (pieceId: string, variant: string, delta: number) => void;
  onRemoveItem: (pieceId: string, variant: string) => void;
  onSubmitOrder: (details: {
    clientName: string;
    clientEmail: string;
    deliveryCity: string;
    notes: string;
  }) => OrderRecord;
}

type DrawerView = 'bag' | 'checkout' | 'confirmation' | 'orders';

export function CartDrawer({
  isOpen,
  items,
  pieces,
  orders,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onSubmitOrder,
}: CartDrawerProps) {
  const [view, setView] = useState<DrawerView>('bag');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('Geneva — Rue du Rhône Salon');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [latestOrder, setLatestOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (view === 'confirmation' && items.length > 0) {
      setView('bag');
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, items.length, view]);

  if (!isOpen) return null;

  const pieceMap = new Map(pieces.map((p) => [p.id, p]));
  const detailedItems = items
    .map((item) => {
      const piece = pieceMap.get(item.pieceId);
      return piece ? { ...item, piece } : null;
    })
    .filter((entry): entry is CartItem & { piece: CatalogPiece } => entry !== null);

  const subtotal = detailedItems.reduce(
    (sum, item) => sum + item.piece.price * item.quantity,
    0,
  );

  function handleCheckoutSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !clientEmail.includes('@')) {
      setFormError('Please provide your full name and a valid email address for private dossier confirmation.');
      return;
    }
    setFormError(null);
    const created = onSubmitOrder({
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      deliveryCity: deliveryCity.trim(),
      notes: notes.trim(),
    });
    setLatestOrder(created);
    setClientName('');
    setClientEmail('');
    setNotes('');
    setView('confirmation');
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Curated Salon Bag"
      onClick={onClose}
    >
      <aside
        className="w-full max-w-lg h-full bg-[#161616] border-l border-[#262626] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#262626] flex items-center justify-between gap-4">
          <div>
            <p className="label-caps text-[#D4AF37]">Aurelia Private Client</p>
            <h2 className="font-editorial text-2xl text-[#F5F5F5]">
              {view === 'checkout'
                ? 'Private Reservation'
                : view === 'confirmation'
                  ? 'Allocation Confirmed'
                  : view === 'orders'
                    ? 'Saved Reservations'
                    : 'Salon Bag'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {orders.length > 0 && view !== 'orders' && (
              <button
                type="button"
                onClick={() => setView('orders')}
                className="h-9 px-3 rounded-lg border border-[#262626] text-[#A3A3A3] hover:text-[#F5F5F5] hover:border-[#D4AF37] label-caps cursor-pointer"
              >
                Orders ({orders.length})
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close salon bag"
              className="w-10 h-10 rounded-lg border border-[#262626] bg-[#131313] text-[#F5F5F5] hover:border-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" strokeWidth={1.6} />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {view === 'orders' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-[#A3A3A3]">
                  Stored locally in your browser dossier
                </p>
                <button
                  type="button"
                  onClick={() => setView('bag')}
                  className="label-caps text-[#D4AF37] hover:text-[#F3E5AB] cursor-pointer"
                >
                  Return to Bag
                </button>
              </div>
              {orders.map((order) => (
                <div
                  key={order.orderNumber}
                  className="rounded-xl border border-[#262626] bg-[#131313] p-5 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="label-caps text-[#D4AF37] tabular-nums">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-[#A3A3A3]">
                      {formatShortDate(order.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-[#F5F5F5]">
                    {order.clientName} · {order.deliveryCity}
                  </p>
                  <div className="border-t border-[#262626] pt-3 space-y-1.5">
                    {order.items.map((item, idx) => (
                      <div
                        key={`${item.pieceId}-${idx}`}
                        className="flex items-center justify-between text-xs text-[#D0C5AF]"
                      >
                        <span className="truncate pr-2">
                          {item.quantity} × {item.name} ({item.variant})
                        </span>
                        <span className="tabular-nums shrink-0">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-[#262626] pt-3 flex items-center justify-between text-sm">
                    <span className="text-[#A3A3A3]">Total Allocation</span>
                    <span className="text-[#F5F5F5] tabular-nums">
                      {formatPrice(order.subtotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : view === 'confirmation' && latestOrder ? (
            <div className="rounded-xl border border-[#262626] bg-[#131313] p-6 space-y-6">
              <div className="w-11 h-11 rounded-lg bg-[#D4AF37] text-[#0A0A0A] flex items-center justify-center">
                <Check className="w-5 h-5" strokeWidth={2} />
              </div>

              <div>
                <p className="label-caps text-[#D4AF37] mb-1.5 tabular-nums">
                  {latestOrder.orderNumber} · Confirmed
                </p>
                <h3 className="font-editorial text-2xl text-[#F5F5F5] mb-2">
                  Preparing Insured Atelier Dispatch
                </h3>
                <p className="text-sm text-[#A3A3A3] leading-relaxed">
                  A private client director will reach out to{' '}
                  <span className="text-[#F5F5F5]">{latestOrder.clientEmail}</span> regarding{' '}
                  {latestOrder.deliveryCity}.
                </p>
              </div>

              <div className="border-t border-[#262626] pt-4 space-y-2.5">
                {latestOrder.items.map((item, idx) => (
                  <div
                    key={`${item.pieceId}-${idx}`}
                    className="flex items-center justify-between text-xs text-[#D0C5AF]"
                  >
                    <span>
                      {item.quantity} × {item.name} ({item.variant})
                    </span>
                    <span className="tabular-nums">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#262626] pt-4 flex items-center justify-between">
                <span className="label-caps text-[#A3A3A3]">Reserved Total</span>
                <span className="text-lg text-[#F5F5F5] tabular-nums">
                  {formatPrice(latestOrder.subtotal)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setView('bag');
                  onClose();
                }}
                className="w-full h-12 rounded-lg bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#F3E5AB] label-caps cursor-pointer"
              >
                Continue Exploring
              </button>
            </div>
          ) : detailedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <p className="font-editorial text-2xl text-[#F5F5F5] mb-2">
                Your salon bag is empty
              </p>
              <p className="text-sm text-[#A3A3A3] max-w-xs mb-6 leading-relaxed">
                Select a numbered timepiece, couture silhouette, or fine jewellery parure to initiate private allocation.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-6 rounded-lg border border-[#262626] text-[#F5F5F5] hover:border-[#D4AF37] label-caps cursor-pointer"
              >
                Return to Vitrine
              </button>
            </div>
          ) : view === 'checkout' ? (
            <form id="aurelia-checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
                <span className="text-sm text-[#A3A3A3]">
                  {detailedItems.reduce((sum, i) => sum + i.quantity, 0)} piece(s) selected
                </span>
                <button
                  type="button"
                  onClick={() => setView('bag')}
                  className="label-caps text-[#D4AF37] hover:text-[#F3E5AB] cursor-pointer"
                >
                  Edit Bag
                </button>
              </div>

              {formError && (
                <div className="p-3.5 rounded-lg border border-[#93000a] bg-[#1C1C1C] text-xs text-[#ffb4ab]">
                  {formError}
                </div>
              )}

              <div>
                <label htmlFor="client-name" className="label-caps text-[#A3A3A3] block mb-2">
                  Client Full Name
                </label>
                <input
                  id="client-name"
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Elena Vance"
                  className="h-12 w-full px-4 rounded-lg bg-[#0E0E0E] border border-[#262626] text-sm text-[#F5F5F5] placeholder:text-[#A3A3A3]/60 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label htmlFor="client-email" className="label-caps text-[#A3A3A3] block mb-2">
                  Private Email
                </label>
                <input
                  id="client-email"
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@domain.com"
                  className="h-12 w-full px-4 rounded-lg bg-[#0E0E0E] border border-[#262626] text-sm text-[#F5F5F5] placeholder:text-[#A3A3A3]/60 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label htmlFor="delivery-city" className="label-caps text-[#A3A3A3] block mb-2">
                  Salon Pickup or Insured Courier
                </label>
                <select
                  id="delivery-city"
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                  className="h-12 w-full px-4 rounded-lg bg-[#0E0E0E] border border-[#262626] text-sm text-[#F5F5F5] focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="Geneva — Rue du Rhône Salon">Geneva — Rue du Rhône Salon</option>
                  <option value="Paris — Place Vendôme Salon">Paris — Place Vendôme Salon</option>
                  <option value="Milan — Via Montenapoleone Salon">
                    Milan — Via Montenapoleone Salon
                  </option>
                  <option value="Complimentary Insured Armored Courier">
                    Complimentary Insured Armored Courier
                  </option>
                </select>
              </div>

              <div>
                <label htmlFor="client-notes" className="label-caps text-[#A3A3A3] block mb-2">
                  Wrist Circumference or Fitting Notes
                </label>
                <textarea
                  id="client-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional sizing preferences or preferred appointment window..."
                  className="w-full p-4 rounded-lg bg-[#0E0E0E] border border-[#262626] text-sm text-[#F5F5F5] placeholder:text-[#A3A3A3]/60 focus:outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>
            </form>
          ) : (
            <div className="divide-y divide-[#262626]">
              {detailedItems.map(({ piece, variant, quantity }) => (
                <div key={`${piece.id}-${variant}`} className="py-5 first:pt-0 flex gap-4">
                  <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#0E0E0E] border border-[#262626] shrink-0">
                    <ResilientImage
                      src={piece.image}
                      alt={piece.imageAlt}
                      title={piece.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-editorial text-lg leading-snug text-[#F5F5F5]">
                          {piece.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(piece.id, variant)}
                          aria-label={`Remove ${piece.name}`}
                          className="text-[#A3A3A3] hover:text-[#ffb4ab] p-1 cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="text-xs text-[#A3A3A3] mt-0.5">{variant}</p>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-3">
                      <div className="inline-flex items-center rounded-lg border border-[#262626] bg-[#131313]">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(piece.id, variant, -1)}
                          aria-label="Decrease quantity"
                          className="w-8 h-8 flex items-center justify-center text-[#A3A3A3] hover:text-[#F5F5F5] cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs text-[#F5F5F5] tabular-nums">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(piece.id, variant, 1)}
                          aria-label="Increase quantity"
                          className="w-8 h-8 flex items-center justify-center text-[#A3A3A3] hover:text-[#F5F5F5] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm text-[#F5F5F5] tabular-nums">
                        {formatPrice(piece.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pinned Drawer Footer */}
        {detailedItems.length > 0 && (view === 'bag' || view === 'checkout') && (
          <div className="p-6 border-t border-[#262626] bg-[#131313] space-y-4">
            <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
              <span>Insured Armored Courier &amp; Salon Presentation</span>
              <span className="text-[#D4AF37]">Complimentary</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="label-caps text-[#A3A3A3]">Subtotal</span>
              <span className="text-xl text-[#F5F5F5] tabular-nums">{formatPrice(subtotal)}</span>
            </div>

            {view === 'bag' ? (
              <button
                type="button"
                onClick={() => setView('checkout')}
                className="w-full h-12 rounded-lg bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#F3E5AB] active:bg-[#C5A028] transition-colors label-caps cursor-pointer"
              >
                Proceed to Private Reservation
              </button>
            ) : (
              <button
                type="submit"
                form="aurelia-checkout-form"
                className="w-full h-12 rounded-lg bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#F3E5AB] active:bg-[#C5A028] transition-colors label-caps cursor-pointer"
              >
                Confirm Private Allocation
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
