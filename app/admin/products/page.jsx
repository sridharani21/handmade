'use client'
import { useState, useEffect } from 'react'
import { supabase, uploadImage } from '@/lib/supabase'
import Image from 'next/image'
import { Plus, Edit2, Trash2, X, Check, AlertCircle, Search, ImagePlus } from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  name: '', slug: '', description: '', price: '', compare_price: '',
  category_id: '', images: [], tags: '', material: '', dimensions: '',
  care_instructions: '', is_active: true, is_featured: false,
  is_out_of_stock: false, stock_quantity: 0
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

 useEffect(() => { fetchData() }, [])

async function fetchData() {
  const [{ data: prods }, { data: cats }] = await Promise.all([
    supabase.from('products').select('*, categories(name, emoji)').order('created_at', { ascending: false }),
    supabase.from('categories').select('*').eq('is_deleted', false).order('display_order') // only active categories
  ])
  setProducts(prods || [])
  setCategories(cats || [])
  setLoading(false)
}

  function openNew() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  function openEdit(product) {
    setEditing(product.id)
    setForm({
      ...product,
      tags: product.tags?.join(', ') || '',
      compare_price: product.compare_price || '',
      images: product.images || []
    })
    setShowModal(true)
  }

  function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const { url, error } = await uploadImage(file, 'product-images')
    if (error) toast.error('Image upload failed')
    else setForm(f => ({ ...f, images: [...f.images, url] }))
    setUploading(false)
  }

  function removeImage(idx) {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
  }

  async function handleSave() {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return }
    setSaving(true)
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      price: parseFloat(form.price),
      compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      stock_quantity: parseInt(form.stock_quantity) || 0,
      category_id: form.category_id || null,
    }
    delete payload.categories

    let error
    if (editing) {
      ({ error } = await supabase.from('products').update(payload).eq('id', editing))
    } else {
      ({ error } = await supabase.from('products').insert(payload))
    }

    if (error) {
      toast.error(error.message.includes('slug') ? 'Slug already exists, change it' : 'Save failed: ' + error.message)
    } else {
      toast.success(editing ? 'Product updated! ✨' : 'Product added! 🌸')
      setShowModal(false)
      fetchData()
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) toast.error('Delete failed')
    else { toast.success('Product deleted'); setDeleteConfirm(null); fetchData() }
  }

  async function toggleStock(product) {
    await supabase.from('products').update({ is_out_of_stock: !product.is_out_of_stock }).eq('id', product.id)
    toast.success(product.is_out_of_stock ? 'Marked as In Stock ✅' : 'Marked as Out of Stock')
    fetchData()
  }

  async function toggleFeatured(product) {
    await supabase.from('products').update({ is_featured: !product.is_featured }).eq('id', product.id)
    fetchData()
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.categories?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-plum">Products 🛍️</h1>
          <p className="text-gray-500 font-cute mt-1">{products.length} total products</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mauve" />
        <input className="input-field pl-11" placeholder="Search products..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="loader" /></div>
      ) : (
        <div className="bg-white rounded-3xl border border-blush/50 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blush/50 bg-cream/50">
                  <th className="text-left px-4 py-3 font-cute text-sm font-semibold text-gray-600">Product</th>
                  <th className="text-left px-4 py-3 font-cute text-sm font-semibold text-gray-600 hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-cute text-sm font-semibold text-gray-600">Price</th>
                  <th className="text-center px-4 py-3 font-cute text-sm font-semibold text-gray-600 hidden md:table-cell">Status</th>
                  <th className="text-center px-4 py-3 font-cute text-sm font-semibold text-gray-600 hidden md:table-cell">Stock</th>
                  <th className="text-right px-4 py-3 font-cute text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blush/20">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-cream/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-blush/20 flex-shrink-0">
                          {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                          ) : <div className="w-full h-full flex items-center justify-center text-xl">🌸</div>}
                        </div>
                        <div>
                          <p className="font-cute font-semibold text-plum text-sm max-w-[160px] truncate">{product.name}</p>
                          {product.is_featured && <span className="badge bg-butter text-plum text-xs">✨ Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-gray-600 font-cute">
                        {product.categories ? `${product.categories.emoji} ${product.categories.name}` : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-plum font-cute">₹{product.price}</p>
                      {product.compare_price && <p className="text-xs text-gray-400 line-through font-cute">₹{product.compare_price}</p>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-center">
                      <span className={`badge text-xs ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {product.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-center">
                      <button onClick={() => toggleStock(product)}
                        className={`badge text-xs cursor-pointer hover:opacity-80 transition-opacity ${
                          product.is_out_of_stock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
                        }`}>
                        {product.is_out_of_stock ? 'Out of Stock' : 'In Stock'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(product)}
                          className="p-2 rounded-xl hover:bg-blush transition-colors text-plum" title="Edit">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => setDeleteConfirm(product.id)}
                          className="p-2 rounded-xl hover:bg-red-50 transition-colors text-red-400" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 font-cute">No products found 🌸</div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl animate-slide-up">
            <div className="text-center mb-4">
              <AlertCircle size={40} className="text-red-400 mx-auto mb-2" />
              <h3 className="font-display text-xl font-bold text-plum">Delete Product?</h3>
              <p className="text-gray-500 font-cute text-sm mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white py-3 rounded-full font-cute font-semibold hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-blush sticky top-0 bg-white rounded-t-3xl z-10">
              <h2 className="font-display text-2xl font-bold text-plum">
                {editing ? 'Edit Product ✏️' : 'New Product 🌸'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-blush transition-colors">
                <X size={20} className="text-plum" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1 font-cute">Product Name *</label>
                  <input className="input-field" placeholder="e.g. Handmade Macramé Earrings"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: f.slug || slugify(e.target.value) }))} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 font-cute">Price (₹) *</label>
                  <input className="input-field" type="number" min="0" placeholder="299"
                    value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 font-cute">Compare Price (₹)</label>
                  <input className="input-field" type="number" min="0" placeholder="399 (optional)"
                    value={form.compare_price} onChange={e => setForm(f => ({ ...f, compare_price: e.target.value }))} />
                </div>
              </div>

              {/* Category + Slug */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 font-cute">Category</label>
                  <select className="input-field" value={form.category_id}
                    onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
                    <option value="">No category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 font-cute">Slug (URL)</label>
                  <input className="input-field" placeholder="handmade-earrings"
                    value={form.slug} onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))} />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 font-cute">Description</label>
                <textarea className="input-field resize-none" rows={3} placeholder="Describe this beautiful piece..."
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-cute">Product Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                      <Image src={img} alt="" fill className="object-cover" />
                      <button onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                  ))}
                  <label className={`w-20 h-20 rounded-xl border-2 border-dashed border-blush flex flex-col items-center justify-center cursor-pointer hover:border-rose transition-colors ${uploading ? 'opacity-50' : ''}`}>
                    <ImagePlus size={20} className="text-mauve mb-1" />
                    <span className="text-xs text-mauve font-cute">{uploading ? '...' : 'Add'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 font-cute">Material</label>
                  <input className="input-field" placeholder="Cotton, Wood, etc"
                    value={form.material || ''} onChange={e => setForm(f => ({ ...f, material: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 font-cute">Dimensions</label>
                  <input className="input-field" placeholder="5cm × 3cm"
                    value={form.dimensions || ''} onChange={e => setForm(f => ({ ...f, dimensions: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 font-cute">Care Instructions</label>
                <input className="input-field" placeholder="Wipe clean, avoid water..."
                  value={form.care_instructions || ''} onChange={e => setForm(f => ({ ...f, care_instructions: e.target.value }))} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 font-cute">Tags (comma separated)</label>
                <input className="input-field" placeholder="handmade, gift, earrings"
                  value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'is_active', label: 'Active', emoji: '👁️' },
                  { key: 'is_featured', label: 'Featured', emoji: '✨' },
                  { key: 'is_out_of_stock', label: 'Out of Stock', emoji: '❌' },
                ].map(tog => (
                  <label key={tog.key} className="flex flex-col items-center gap-2 p-3 bg-cream rounded-2xl cursor-pointer hover:bg-blush/30 transition-colors">
                    <span className="text-2xl">{tog.emoji}</span>
                    <span className="text-xs font-cute font-semibold text-gray-600 text-center">{tog.label}</span>
                    <div className={`w-10 h-5 rounded-full transition-colors relative ${form[tog.key] ? 'bg-plum' : 'bg-gray-200'}`}
                      onClick={() => setForm(f => ({ ...f, [tog.key]: !f[tog.key] }))}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form[tog.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-blush sticky bottom-0 bg-white rounded-b-3xl">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</> : <><Check size={16} /> {editing ? 'Update' : 'Add Product'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
