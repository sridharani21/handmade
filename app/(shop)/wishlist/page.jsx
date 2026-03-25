'use client'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const { items, toggleWishlist } = useWishlist()
  const { addItem } = useCart()
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-8xl mb-6">💕</div>
        <h1 className="font-display text-3xl text-plum mb-3">Save your favourites</h1>
        <p className="text-gray-500 font-cute mb-8">Login to view and manage your wishlist</p>
        <Link href="/login" className="btn-primary">Login to continue 🌸</Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-8xl mb-6 animate-float">💕</div>
        <h1 className="font-display text-3xl text-plum mb-3">Your wishlist is empty</h1>
        <p className="text-gray-500 font-cute mb-8">Save items you love!</p>
        <Link href="/products" className="btn-primary inline-flex items-center gap-2">
          Explore Products <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1 className="section-title mb-8 flex items-center gap-3">
        <Heart className="text-rose" fill="currentColor" /> My Wishlist
        <span className="badge bg-rose text-white">{items.length}</span>
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map(product => (
          <div key={product.id} className="card group relative">
            <Link href={`/products/${product.id}`}>
              <div className="relative aspect-square overflow-hidden bg-cream rounded-t-3xl">
                {product.images?.[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">🌸</div>
                )}
              </div>
            </Link>

            {/* Remove from wishlist */}
            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-rose text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md"
            >
              <Heart size={16} fill="currentColor" />
            </button>

            <div className="p-4">
              <Link href={`/products/${product.id}`}>
                <h3 className="font-cute font-bold text-plum hover:text-mauve transition-colors line-clamp-2 mb-2">{product.name}</h3>
              </Link>
              <p className="font-bold text-plum text-lg mb-3">₹{product.price}</p>

              {product.is_out_of_stock ? (
                <button disabled className="btn-secondary w-full text-sm py-2 opacity-60">Out of Stock</button>
              ) : (
                <button
                  onClick={() => { addItem(product); toast.success('Added to cart! 🛒') }}
                  className="btn-primary w-full text-sm py-2 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={14} /> Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
