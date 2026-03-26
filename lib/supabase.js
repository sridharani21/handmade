import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, opts = {}) => fetch(url, { ...opts, cache: 'no-store' }),
  },
})

// Separate client with no cache — use this for admin dropdowns
export const supabaseFresh = createClient(supabaseUrl, supabaseAnonKey)

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export async function getSettings() {
  const { data } = await supabase.from('settings').select('key, value')
  if (!data) return {}
  return data.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {})
}

export async function uploadImage(file, bucket = 'product-images') {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
  const { data, error } = await supabase.storage.from(bucket).upload(fileName, file)
  if (error) return { url: null, error }
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName)
  return { url: publicUrl, error: null }
}

export async function getProductRating(productId) {
  const { data } = await supabase
    .from('reviews')
    .select('rating')
    .eq('product_id', productId)
    .eq('is_approved', true)
  if (!data || data.length === 0) return { avg: 0, count: 0 }
  const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length
  return { avg: Math.round(avg * 10) / 10, count: data.length }
}