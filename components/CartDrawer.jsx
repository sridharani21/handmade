'use client'
import { useCart } from '../context/CartContext'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQty, removeItem, subtotal } = useCart()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl transition-transform duration-300 flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-blush bg-gradient-to-r from-cream to-blush/30">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-plum" size={22} />
            <h2 className="font-display text-xl font-bold text-plum">Your Cart</h2>
            {items.length > 0 && (
              <span className="badge bg-plum text-white">{items.length}</span>
            )}
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-blush transition-colors">
            <X size={20} className="text-plum" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="font-display text-xl text-plum mb-2">Your cart is empty</p>
              <p className="text-gray-500 text-sm font-cute mb-6">Add some cute items!</p>
              <button onClick={() => setIsOpen(false)}>
                <Link href="/products" className="btn-primary">Shop Now 🌸</Link>
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-3 bg-cream rounded-2xl p-3">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-blush/30">
                  {item.images?.[0] ? (
                    <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🌸</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-plum font-cute truncate">{item.name}</p>
                  <p className="text-plum font-bold mt-1">₹{item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-blush flex items-center justify-center hover:bg-rose hover:text-white transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm font-bold font-cute">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-blush flex items-center justify-center hover:bg-rose hover:text-white transition-colors">
                      <Plus size={12} />
                    </button>
                    <button onClick={() => removeItem(item.id)} className="ml-auto p-1.5 rounded-full hover:bg-red-100 transition-colors">
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-blush bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="font-cute font-semibold text-gray-600">Subtotal</span>
              <span className="font-display text-xl font-bold text-plum">₹{subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 text-center mb-3 font-cute">Delivery charges calculated at checkout</p>
            <Link href="/checkout" onClick={() => setIsOpen(false)}>
              <button className="btn-primary w-full text-center">
                Proceed to Checkout →
              </button>
            </Link>
            <button onClick={() => setIsOpen(false)} className="btn-secondary w-full mt-2 text-center">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
