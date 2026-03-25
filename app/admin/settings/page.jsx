'use client'
import { useState, useEffect } from 'react'
import { supabase, uploadImage } from '@/lib/supabase'
import Image from 'next/image'
import { Save, Plus, Trash2, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const [settings, setSettings] = useState({})
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [qrUploading, setQrUploading] = useState(false)
  const [newCat, setNewCat] = useState({ name: '', slug: '', emoji: '🌸', description: '' })
  const [addingCat, setAddingCat] = useState(false)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const [{ data: s }, { data: c }] = await Promise.all([
      supabase.from('settings').select('key, value'),
      supabase.from('categories').select('*').order('display_order')
    ])
    const obj = (s || []).reduce((acc, r) => ({ ...acc, [r.key]: r.value }), {})
    setSettings(obj)
    setCategories(c || [])
    setLoading(false)
  }

  function set(key, value) {
    setSettings(s => ({ ...s, [key]: value }))
  }

  async function saveSettings() {
    setSaving(true)
    const updates = Object.entries(settings).map(([key, value]) => ({ key, value }))
    for (const update of updates) {
      await supabase.from('settings').upsert(update, { onConflict: 'key' })
    }
    toast.success('Settings saved! ✅')
    setSaving(false)
  }

  async function handleQrUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setQrUploading(true)
    const { url, error } = await uploadImage(file, 'shop-assets')
    if (error) toast.error('Upload failed')
    else { set('qr_code_url', url); toast.success('QR code uploaded! 📱') }
    setQrUploading(false)
  }

  function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function addCategory() {
    if (!newCat.name) { toast.error('Category name required'); return }
    const payload = { ...newCat, slug: newCat.slug || slugify(newCat.name) }
    const { error } = await supabase.from('categories').insert(payload)
    if (error) toast.error(error.message.includes('unique') ? 'Name/slug already exists' : error.message)
    else { toast.success('Category added! 🌸'); setNewCat({ name: '', slug: '', emoji: '🌸', description: '' }); setAddingCat(false); fetchData() }
  }

  async function deleteCategory(id) {
    await supabase.from('categories').delete().eq('id', id)
    toast.success('Deleted'); fetchData()
  }

  if (loading) return <div className="flex justify-center py-20"><div className="loader" /></div>

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-plum">Settings ⚙️</h1>
        <p className="text-gray-500 font-cute mt-1">Manage your shop settings</p>
      </div>

      {/* Shop Info */}
      <div className="bg-white rounded-3xl border border-blush/50 p-6 shadow-sm">
        <h2 className="font-display text-xl font-bold text-plum mb-5 flex items-center gap-2">🏪 Shop Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1 font-cute">Shop Name</label>
            <input className="input-field" value={settings.shop_name || ''} onChange={e => set('shop_name', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1 font-cute">Tagline</label>
            <input className="input-field" value={settings.shop_tagline || ''} onChange={e => set('shop_tagline', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 font-cute">WhatsApp Number</label>
            <input className="input-field" placeholder="+91 XXXXXXXXXX" value={settings.whatsapp_number || ''} onChange={e => set('whatsapp_number', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 font-cute">Instagram URL</label>
            <input className="input-field" placeholder="https://instagram.com/yourshop" value={settings.instagram_url || ''} onChange={e => set('instagram_url', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Delivery */}
      <div className="bg-white rounded-3xl border border-blush/50 p-6 shadow-sm">
        <h2 className="font-display text-xl font-bold text-plum mb-5 flex items-center gap-2">🚚 Delivery Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 font-cute">Delivery Charge (₹)</label>
            <input className="input-field" type="number" min="0" value={settings.delivery_charge || ''}
              onChange={e => set('delivery_charge', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 font-cute">Free Delivery Above (₹)</label>
            <input className="input-field" type="number" min="0" value={settings.free_delivery_above || ''}
              onChange={e => set('free_delivery_above', e.target.value)} />
            <p className="text-xs text-gray-400 font-cute mt-1">Orders above this amount get free delivery</p>
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white rounded-3xl border border-blush/50 p-6 shadow-sm">
        <h2 className="font-display text-xl font-bold text-plum mb-5 flex items-center gap-2">💳 Payment Settings</h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center gap-3 flex-1 p-4 bg-cream rounded-2xl cursor-pointer">
              <div className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${settings.cod_enabled !== 'false' ? 'bg-plum' : 'bg-gray-200'}`}
                onClick={() => set('cod_enabled', settings.cod_enabled === 'false' ? 'true' : 'false')}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${settings.cod_enabled !== 'false' ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="font-cute font-semibold text-plum">Cash on Delivery</span>
            </label>
            <label className="flex items-center gap-3 flex-1 p-4 bg-cream rounded-2xl cursor-pointer">
              <div className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${settings.online_payment_enabled !== 'false' ? 'bg-plum' : 'bg-gray-200'}`}
                onClick={() => set('online_payment_enabled', settings.online_payment_enabled === 'false' ? 'true' : 'false')}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${settings.online_payment_enabled !== 'false' ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="font-cute font-semibold text-plum">Online Payment (UPI)</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 font-cute">UPI ID</label>
              <input className="input-field" placeholder="yourname@paytm" value={settings.upi_id || ''}
                onChange={e => set('upi_id', e.target.value)} />
            </div>
          </div>

          {/* QR Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-cute">Payment QR Code</label>
            <div className="flex items-start gap-4">
              {settings.qr_code_url && (
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-blush bg-white p-2">
                  <Image src={settings.qr_code_url} alt="QR Code" fill className="object-contain p-1" />
                </div>
              )}
              <label className={`flex flex-col items-center gap-2 w-32 h-32 rounded-2xl border-2 border-dashed border-blush hover:border-rose cursor-pointer transition-colors justify-center ${qrUploading ? 'opacity-50' : ''}`}>
                <Upload size={24} className="text-mauve" />
                <span className="text-xs text-mauve font-cute text-center">{qrUploading ? 'Uploading...' : settings.qr_code_url ? 'Replace QR' : 'Upload QR'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleQrUpload} disabled={qrUploading} />
              </label>
            </div>
            <p className="text-xs text-gray-400 font-cute mt-2">This QR will be shown to customers who choose online payment</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-3xl border border-blush/50 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-plum flex items-center gap-2">📂 Categories</h2>
          <button onClick={() => setAddingCat(!addingCat)} className="btn-outline text-sm flex items-center gap-1">
            <Plus size={14} /> Add Category
          </button>
        </div>

        {addingCat && (
          <div className="mb-4 p-4 bg-cream rounded-2xl animate-slide-up">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              <input className="input-field" placeholder="Name *" value={newCat.name}
                onChange={e => setNewCat(c => ({ ...c, name: e.target.value, slug: c.slug || slugify(e.target.value) }))} />
              <input className="input-field" placeholder="Slug" value={newCat.slug}
                onChange={e => setNewCat(c => ({ ...c, slug: slugify(e.target.value) }))} />
              <input className="input-field" placeholder="Emoji 🌸" value={newCat.emoji}
                onChange={e => setNewCat(c => ({ ...c, emoji: e.target.value }))} />
              <input className="input-field" placeholder="Description" value={newCat.description}
                onChange={e => setNewCat(c => ({ ...c, description: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <button onClick={addCategory} className="btn-primary text-sm py-2 px-5">Add</button>
              <button onClick={() => setAddingCat(false)} className="btn-secondary text-sm py-2 px-5">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between bg-cream rounded-2xl px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.emoji}</span>
                <div>
                  <p className="font-cute font-semibold text-plum text-sm">{cat.name}</p>
                  <p className="text-xs text-gray-400 font-cute">{cat.slug}</p>
                </div>
              </div>
              <button onClick={() => deleteCategory(cat.id)}
                className="p-1.5 rounded-lg hover:bg-red-100 text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="sticky bottom-6">
        <button onClick={saveSettings} disabled={saving}
          className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 shadow-xl">
          {saving ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
          ) : (
            <><Save size={18} /> Save All Settings</>
          )}
        </button>
      </div>
    </div>
  )
}
