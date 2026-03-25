'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext({})

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hml_cart')
    if (saved) setItems(JSON.parse(saved))
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('hml_cart', JSON.stringify(items))
  }, [items])

  function addItem(product, qty = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        toast.success('Cart updated! 🛒')
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + qty } : i)
      }
      toast.success('Added to cart! 🌸')
      return [...prev, { ...product, quantity: qty }]
    })
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id))
    toast('Removed from cart', { icon: '🗑️' })
  }

  function updateQty(id, qty) {
    if (qty < 1) { removeItem(id); return }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  function clearCart() {
    setItems([])
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
