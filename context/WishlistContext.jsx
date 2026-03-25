'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const WishlistContext = createContext({})

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) fetchWishlist()
    else setItems([])
  }, [user])

  async function fetchWishlist() {
    const { data } = await supabase
      .from('wishlists')
      .select('product_id, products(*)')
      .eq('user_id', user.id)
    setItems(data?.map(w => w.products) || [])
  }

  async function toggleWishlist(product) {
    if (!user) { toast('Please login to save items 💕'); return }
    const isWished = items.some(i => i.id === product.id)
    if (isWished) {
      await supabase.from('wishlists').delete().eq('user_id', user.id).eq('product_id', product.id)
      setItems(prev => prev.filter(i => i.id !== product.id))
      toast('Removed from wishlist', { icon: '💔' })
    } else {
      await supabase.from('wishlists').insert({ user_id: user.id, product_id: product.id })
      setItems(prev => [...prev, product])
      toast.success('Saved to wishlist! 💕')
    }
  }

  function isWished(productId) {
    return items.some(i => i.id === productId)
  }

  return (
    <WishlistContext.Provider value={{ items, toggleWishlist, isWished, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
