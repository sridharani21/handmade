'use client'
import { useState } from 'react'
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useCart as useCartOpen } from '@/context/CartContext'

export default function AddToCartSection({ product }) {
  const [qty, setQty] = useState(1)
  const { addItem, setIsOpen } = useCart()
  const { isWished, toggleWishlist } = useWishlist()
  const wished = isWished(product.id)

  function handleAddToCart() {
    addItem(product, qty)
    setIsOpen(true)
  }

  return (
    <div className="space-y-4">
      {!product.is_out_of_stock && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-cute font-semibold text-gray-600">Quantity:</span>
          <div className="flex items-center gap-3 bg-cream rounded-2xl p-1">
            <button onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-xl bg-white flex items-center justify-center hover:bg-blush transition-colors shadow-sm">
              <Minus size={15} className="text-plum" />
            </button>
            <span className="w-8 text-center font-bold text-plum font-cute">{qty}</span>
            <button onClick={() => setQty(q => q + 1)}
              className="w-9 h-9 rounded-xl bg-white flex items-center justify-center hover:bg-blush transition-colors shadow-sm">
              <Plus size={15} className="text-plum" />
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {product.is_out_of_stock ? (
          <button disabled className="btn-secondary flex-1 opacity-60 cursor-not-allowed">
            😔 Out of Stock
          </button>
        ) : (
          <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        )}
        <button
          onClick={() => toggleWishlist(product)}
          className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
            wished ? 'bg-rose border-rose text-white' : 'bg-white border-blush text-plum hover:border-rose'
          }`}
        >
          <Heart size={20} fill={wished ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex items-center gap-2 bg-mint/20 rounded-2xl p-3 border border-mint/50">
        <span className="text-lg">🚚</span>
        <div>
          <p className="text-sm font-cute font-semibold text-sage">Fast Delivery Available</p>
          <p className="text-xs text-gray-500 font-cute">COD & Online Payment accepted</p>
        </div>
      </div>
    </div>
  )
}
