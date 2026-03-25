'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Heart, User, Menu, X, Search, LogOut, Settings, Package } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import CartDrawer from './CartDrawer'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { totalItems, setIsOpen } = useCart()
  const { count: wishCount } = useWishlist()
  const { user, profile, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    setUserMenuOpen(false)
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-plum to-rose flex items-center justify-center text-white text-lg font-bold shadow-md group-hover:scale-110 transition-transform">
                🌸
              </div>
              <div className="hidden sm:block">
                <p className="font-display font-bold text-plum text-lg leading-tight">Handmade</p>
                <p className="text-xs text-mauve font-cute font-medium -mt-1">with Love ✨</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-plum transition-colors font-cute">Home</Link>
              <Link href="/products" className="text-sm font-semibold text-gray-600 hover:text-plum transition-colors font-cute">Shop</Link>
              <Link href="/products?category=gift-sets" className="text-sm font-semibold text-gray-600 hover:text-plum transition-colors font-cute">Gifts 🎁</Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <Link href="/products" className="p-2 rounded-full hover:bg-blush transition-colors">
                <Search size={20} className="text-plum" />
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist" className="relative p-2 rounded-full hover:bg-blush transition-colors">
                <Heart size={20} className="text-plum" />
                {wishCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce">
                    {wishCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button onClick={() => setIsOpen(true)} className="relative p-2 rounded-full hover:bg-blush transition-colors">
                <ShoppingCart size={20} className="text-plum" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-plum text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-blush transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mauve to-plum flex items-center justify-center text-white text-sm font-bold">
                      {profile?.full_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-blush p-2 animate-slide-up">
                      <div className="px-3 py-2 border-b border-blush mb-1">
                        <p className="font-semibold text-sm text-plum truncate">{profile?.full_name || 'My Account'}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <Link href="/orders" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-cream text-sm text-gray-700 font-cute font-medium transition-colors">
                        <Package size={16} className="text-plum" /> My Orders
                      </Link>
                      <Link href="/wishlist" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-cream text-sm text-gray-700 font-cute font-medium transition-colors">
                        <Heart size={16} className="text-rose" /> Wishlist
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-cream text-sm text-plum font-cute font-semibold transition-colors">
                          <Settings size={16} className="text-plum" /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-sm text-red-500 font-cute font-medium transition-colors mt-1">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="btn-primary text-sm py-2 px-4">
                  Login
                </Link>
              )}

              {/* Mobile menu */}
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-full hover:bg-blush">
                {menuOpen ? <X size={20} className="text-plum" /> : <Menu size={20} className="text-plum" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden bg-white border-t border-blush py-4 space-y-2 animate-slide-up">
              <Link href="/" onClick={() => setMenuOpen(false)} className="block px-4 py-2 font-cute font-semibold text-plum">🏠 Home</Link>
              <Link href="/products" onClick={() => setMenuOpen(false)} className="block px-4 py-2 font-cute font-semibold text-plum">🛍️ Shop All</Link>
              <Link href="/products?category=gift-sets" onClick={() => setMenuOpen(false)} className="block px-4 py-2 font-cute font-semibold text-plum">🎁 Gifts</Link>
              <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="block px-4 py-2 font-cute font-semibold text-plum">💕 Wishlist</Link>
              <Link href="/orders" onClick={() => setMenuOpen(false)} className="block px-4 py-2 font-cute font-semibold text-plum">📦 My Orders</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16" />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Backdrop */}
      {(userMenuOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </>
  )
}
