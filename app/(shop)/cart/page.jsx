'use client'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-8xl mb-6 animate-float">🛒</div>
        <h1 className="font-display text-3xl text-plum mb-3">Your cart is empty</h1>
        <p className="text-gray-500 font-cute mb-8">Discover our handmade treasures!</p>
        <Link href="/products" className="btn-primary inline-flex items-center gap-2">
          Start Shopping <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1 className="section-title mb-8 flex items-center gap-3">
        <ShoppingBag className="text-plum" /> Your Cart
        <span className="badge bg-plum text-white">{items.length} items</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="card p-4 flex gap-4 border border-blush/50 animate-fade-in">
              <Link href={`/products/${item.id}`} className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-cream">
                {item.images?.[0] ? (
                  <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">🌸</div>
                )}
              </Link>
              <div className="flex-1">
                <Link href={`/products/${item.id}`}>
                  <h3 className="font-cute font-bold text-plum hover:text-mauve transition-colors">{item.name}</h3>
                </Link>
                <p className="font-bold text-plum text-lg mt-1">₹{item.price}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 bg-cream rounded-xl p-1">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-blush transition-colors">
                      <Minus size={13} className="text-plum" />
                    </button>
                    <span className="w-7 text-center font-bold text-plum font-cute">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-blush transition-colors">
                      <Plus size={13} className="text-plum" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-plum font-cute">₹{(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeItem(item.id)} className="p-2 rounded-xl hover:bg-red-50 transition-colors">
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-600 font-cute font-semibold transition-colors mt-2">
            🗑️ Clear cart
          </button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 border-2 border-blush sticky top-24">
            <h2 className="font-display text-xl font-bold text-plum mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between font-cute text-gray-600">
                <span>Subtotal ({items.reduce((s,i)=>s+i.quantity,0)} items)</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-cute text-gray-500 text-sm">
                <span>Delivery</span>
                <span className="text-sage font-semibold">Calculated at checkout</span>
              </div>
              <div className="border-t border-blush pt-3 flex justify-between font-display text-lg font-bold text-plum">
                <span>Total</span>
                <span>₹{subtotal.toFixed(2)}+</span>
              </div>
            </div>
            <Link href="/checkout">
              <button className="btn-primary w-full flex items-center justify-center gap-2">
                Checkout <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/products" className="block text-center mt-3 text-sm text-plum font-cute font-semibold hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
