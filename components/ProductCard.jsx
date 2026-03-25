'use client'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const { isWished, toggleWishlist } = useWishlist()
  const wished = isWished(product.id)
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  return (
    <div className="product-card card group relative animate-fade-in">
      {/* Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-cream to-blush/30">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="product-image object-cover transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🌸</div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.is_out_of_stock && (
              <span className="badge bg-gray-600 text-white">Sold Out</span>
            )}
            {discount > 0 && !product.is_out_of_stock && (
              <span className="badge bg-plum text-white">-{discount}%</span>
            )}
            {product.is_featured && (
              <span className="badge bg-butter text-plum">✨ Featured</span>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist button */}
      <button
        onClick={() => toggleWishlist(product)}
        className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
          wished ? 'bg-rose text-white scale-110' : 'bg-white/90 text-gray-400 hover:text-rose hover:scale-110'
        }`}
      >
        <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
      </button>

      {/* Info */}
      <div className="p-4">
        {product.categories?.name && (
          <p className="text-xs text-mauve font-semibold uppercase tracking-wide font-cute mb-1">
            {product.categories.emoji} {product.categories.name}
          </p>
        )}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-cute font-bold text-plum hover:text-mauve transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.avg_rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={12}
                className={s <= Math.round(product.avg_rating) ? 'star-filled' : 'star-empty'}
                fill="currentColor" />
            ))}
            <span className="text-xs text-gray-400 font-cute">({product.review_count || 0})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-lg text-plum">₹{product.price}</span>
          {product.compare_price && (
            <span className="text-sm text-gray-400 line-through">₹{product.compare_price}</span>
          )}
        </div>

        {/* Add to Cart */}
        {product.is_out_of_stock ? (
          <button disabled className="btn-secondary w-full opacity-60 cursor-not-allowed text-sm py-2">
            Out of Stock 😔
          </button>
        ) : (
          <button
            onClick={() => addItem(product)}
            className="btn-primary w-full text-sm py-2.5 flex items-center justify-center gap-2 group-hover:shadow-lg"
          >
            <ShoppingCart size={15} />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  )
}
