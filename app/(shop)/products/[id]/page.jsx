export const dynamic = 'force-dynamic'
export const revalidate = 0

import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ReviewSection from '@/components/ReviewSection'
import AddToCartSection from './AddToCartSection'
import ImageGallery from './ImageGallery'
import { Star, Tag, Package, Ruler, Sparkles } from 'lucide-react'

async function getProduct(id) {
  const { data } = await supabase
    .from('products')
    .select('*, categories(name, slug, emoji)')
    .eq('id', id)
    .eq('is_active', true)
    .single()
  return data
}

async function getRelated(categoryId, currentId) {
  if (!categoryId) return []
  const { data } = await supabase
    .from('products')
    .select('id, name, price, images, compare_price, is_out_of_stock')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('id', currentId)
    .limit(4)
  return data || []
}

async function getAvgRating(productId) {
  const { data } = await supabase
    .from('reviews')
    .select('rating')
    .eq('product_id', productId)
    .eq('is_approved', true)
  if (!data || !data.length) return { avg: 0, count: 0 }
  return {
    avg: data.reduce((s, r) => s + r.rating, 0) / data.length,
    count: data.length,
  }
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.id)
  if (!product) notFound()

  const [{ avg, count }, related] = await Promise.all([
    getAvgRating(product.id),
    getRelated(product.category_id, product.id),
  ])

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  return (
    <div className="page-container animate-fade-in">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm font-cute text-gray-400 mb-8 flex-wrap">
        <Link href="/" className="hover:text-plum transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-plum transition-colors">Shop</Link>
        {product.categories && (
          <>
            <span>/</span>
            <Link
              href={`/products?category=${product.categories.slug}`}
              className="hover:text-plum transition-colors"
            >
              {product.categories.emoji} {product.categories.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-plum font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">

        {/* Image Gallery — client component handles clicking */}
        <ImageGallery
          images={product.images || []}
          productName={product.name}
          isOutOfStock={product.is_out_of_stock}
          discount={discount}
        />

        {/* Product Info */}
        <div>
          {product.categories && (
            <Link
              href={`/products?category=${product.categories.slug}`}
              className="inline-flex items-center gap-1 text-sm font-cute font-semibold text-mauve hover:text-plum mb-3 transition-colors"
            >
              {product.categories.emoji} {product.categories.name}
            </Link>
          )}

          <h1 className="font-display text-3xl font-bold text-plum mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          {count > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star
                    key={s}
                    size={16}
                    fill="currentColor"
                    className={s <= Math.round(avg) ? 'star-filled' : 'star-empty'}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 font-cute">
                {avg.toFixed(1)} ({count} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-4xl font-bold text-plum">₹{product.price}</span>
            {product.compare_price && (
              <span className="text-xl text-gray-400 line-through font-cute">
                ₹{product.compare_price}
              </span>
            )}
            {discount > 0 && (
              <span className="badge bg-green-100 text-green-700 text-sm">
                Save {discount}%
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-600 leading-relaxed font-cute mb-6">
              {product.description}
            </p>
          )}

          {/* Details */}
          <div className="space-y-2 mb-6">
            {product.material && (
              <div className="flex items-center gap-2 text-sm font-cute text-gray-600">
                <Sparkles size={15} className="text-mauve flex-shrink-0" />
                <span><strong>Material:</strong> {product.material}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex items-center gap-2 text-sm font-cute text-gray-600">
                <Ruler size={15} className="text-mauve flex-shrink-0" />
                <span><strong>Dimensions:</strong> {product.dimensions}</span>
              </div>
            )}
            {product.care_instructions && (
              <div className="flex items-center gap-2 text-sm font-cute text-gray-600">
                <Package size={15} className="text-mauve flex-shrink-0" />
                <span><strong>Care:</strong> {product.care_instructions}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map(tag => (
                <span key={tag} className="badge bg-cream text-plum border border-blush text-xs">
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>
          )}

          {/* Add to cart */}
          <AddToCartSection product={product} />
        </div>
      </div>

      {/* Reviews */}
      <ReviewSection productId={product.id} />

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="section-title mb-6">You might also like 💕</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map(p => (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className="card p-3 hover:-translate-y-1 transition-all"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream mb-3">
                  {p.images?.[0] ? (
                    <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🌸</div>
                  )}
                </div>
                <p className="font-cute font-semibold text-plum text-sm line-clamp-2">{p.name}</p>
                <p className="font-bold text-plum mt-1">₹{p.price}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}