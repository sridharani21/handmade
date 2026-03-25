'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

export default function ProductsFilter({ categories }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')

  function update(key, value) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/products?${params.toString()}`)
  }

  function handleSearch(e) {
    e.preventDefault()
    update('q', search)
  }

  const activeCategory = searchParams.get('category')
  const activeSort = searchParams.get('sort') || 'newest'

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mauve" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-11"
          />
        </div>
        <button type="submit" className="btn-primary px-5">Search</button>
      </form>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => update('category', '')}
          className={`badge px-4 py-2 text-sm font-cute font-semibold transition-all cursor-pointer ${
            !activeCategory ? 'bg-plum text-white' : 'bg-white text-plum border-2 border-blush hover:border-rose'
          }`}
        >
          All 🌸
        </button>
        {categories.map(cat => (
          <button key={cat.id}
            onClick={() => update('category', cat.slug)}
            className={`badge px-4 py-2 text-sm font-cute font-semibold transition-all cursor-pointer ${
              activeCategory === cat.slug ? 'bg-plum text-white' : 'bg-white text-plum border-2 border-blush hover:border-rose'
            }`}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={16} className="text-plum" />
        <span className="text-sm font-cute font-semibold text-gray-600">Sort:</span>
        {[
          { val: 'newest', label: 'Newest' },
          { val: 'price_asc', label: 'Price ↑' },
          { val: 'price_desc', label: 'Price ↓' },
        ].map(opt => (
          <button key={opt.val}
            onClick={() => update('sort', opt.val)}
            className={`text-sm px-4 py-1.5 rounded-full font-cute font-semibold border-2 transition-all ${
              activeSort === opt.val ? 'bg-plum text-white border-plum' : 'bg-white text-gray-600 border-blush hover:border-rose'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
