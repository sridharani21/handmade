export const dynamic = 'force-dynamic'
export const revalidate = 0

import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { ArrowRight, Sparkles, Truck, Shield, Heart } from 'lucide-react'

async function getHomeData() {
  const [{ data: featured }, { data: categories }, { data: newArrivals }] = await Promise.all([
    supabase.from('products').select('*, categories(name, slug, emoji)').eq('is_featured', true).eq('is_active', true).limit(8),
    supabase.from('categories').select('*').order('display_order'),
    supabase.from('products').select('*, categories(name, slug, emoji)').eq('is_active', true).order('created_at', { ascending: false }).limit(8),
  ])
  return { featured: featured || [], categories: categories || [], newArrivals: newArrivals || [] }
}

export default async function HomePage() {
  const { featured, categories, newArrivals } = await getHomeData()

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream via-blush/30 to-mint/20 py-16 sm:py-24">
        <div className="absolute top-10 left-10 w-40 h-40 bg-rose/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-56 h-56 bg-mint/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-butter/30 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-2 mb-6 border border-blush shadow-sm">
            <Sparkles size={14} className="text-plum" />
            <span className="text-sm font-cute font-semibold text-plum">Handcrafted with love 💕</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-plum mb-6 leading-tight">
            Unique Handmade
            <span className="block italic text-mauve">Treasures for You</span>
          </h1>
          <p className="text-lg text-gray-500 font-cute max-w-xl mx-auto mb-8 leading-relaxed">
            Every piece is crafted by hand with care, love, and the finest materials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4 animate-float">
              Shop Now 🌸 <ArrowRight size={18} />
            </Link>
            <Link href="/products?featured=true" className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-4">
              ✨ Featured Picks
            </Link>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="bg-white border-y border-blush/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: Heart, label: 'Made with Love', sub: 'Every piece is handcrafted' },
              { icon: Truck, label: 'Fast Delivery', sub: 'COD & Online payment' },
              { icon: Shield, label: 'Secure Checkout', sub: 'Safe & trusted shopping' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="w-10 h-10 bg-blush rounded-2xl flex items-center justify-center mb-2">
                  <Icon size={18} className="text-plum" />
                </div>
                <p className="font-cute font-bold text-plum text-sm">{label}</p>
                <p className="text-xs text-gray-400 font-cute hidden sm:block">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="page-container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">Shop by Category</h2>
            <Link href="/products" className="text-sm text-plum font-semibold font-cute hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map(cat => (
              <Link key={cat.id} href={`/products?category=${cat.slug}`}
                className="group card p-4 text-center hover:border-2 hover:border-rose transition-all hover:-translate-y-1">
                <div className="text-4xl mb-2 group-hover:animate-wiggle">{cat.emoji}</div>
                <p className="font-cute font-semibold text-plum text-sm">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="page-container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">✨ Featured Picks</h2>
            <Link href="/products?featured=true" className="text-sm text-plum font-semibold font-cute hover:underline flex items-center gap-1">
              See all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Banner */}
      <section className="page-container">
        <div className="bg-gradient-to-r from-plum via-mauve to-rose rounded-4xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">Looking for a Perfect Gift? 🎁</h2>
            <p className="font-cute text-white/80 mb-6 text-lg">Explore our curated gift sets — handcrafted with extra love!</p>
            <Link href="/products?category=gift-sets" className="inline-flex items-center gap-2 bg-white text-plum px-8 py-3 rounded-full font-cute font-bold hover:bg-cream transition-colors">
              Shop Gift Sets <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="page-container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">🆕 New Arrivals</h2>
            <Link href="/products" className="text-sm text-plum font-semibold font-cute hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}