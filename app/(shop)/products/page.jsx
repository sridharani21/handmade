import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import ProductsFilter from './ProductsFilter'

async function getProducts(searchParams) {
  let query = supabase
    .from('products')
    .select('*, categories(name, slug, emoji)')
    .eq('is_active', true)

  if (searchParams.category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', searchParams.category).single()
    if (cat) query = query.eq('category_id', cat.id)
  }
  if (searchParams.featured === 'true') query = query.eq('is_featured', true)
  if (searchParams.q) query = query.ilike('name', `%${searchParams.q}%`)

  const sort = searchParams.sort || 'newest'
  if (sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data } = await query
  return data || []
}

async function getCategories() {
  const { data } = await supabase.from('categories').select('*').order('display_order')
  return data || []
}

export default async function ProductsPage({ searchParams }) {
  const [products, categories] = await Promise.all([getProducts(searchParams), getCategories()])

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="section-title">
          {searchParams.category
            ? categories.find(c => c.slug === searchParams.category)?.name || 'Products'
            : searchParams.featured === 'true' ? '✨ Featured Picks'
            : searchParams.q ? `Search: "${searchParams.q}"`
            : '🛍️ Shop All'}
        </h1>
        <p className="text-gray-500 font-cute mt-1">{products.length} items found</p>
      </div>

      <ProductsFilter categories={categories} />

      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🌸</div>
          <h3 className="font-display text-2xl text-plum mb-2">No products found</h3>
          <p className="text-gray-500 font-cute">Try a different category or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
