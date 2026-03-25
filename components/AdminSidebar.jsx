'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, Package, ShoppingBag, Settings, Menu, X, ExternalLink } from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  function isActive(item) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href)
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">🌸</div>
          <div>
            <p className="font-display font-bold text-white text-lg leading-tight">Admin</p>
            <p className="text-xs text-white/60 font-cute">Handmade with Love</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(item => {
          const Icon = item.icon
          const active = isActive(item)
          return (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-cute font-semibold text-sm transition-all ${
                active
                  ? 'bg-white/20 text-white shadow-md'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}>
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Link href="/" target="_blank"
          className="flex items-center gap-2 px-4 py-3 rounded-2xl text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-cute font-semibold">
          <ExternalLink size={16} /> View Shop
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-plum text-white rounded-2xl flex items-center justify-center shadow-lg">
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)}>
          <div className="w-64 h-full bg-gradient-to-b from-plum to-mauve" onClick={e => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-white/70 hover:text-white">
              <X size={20} />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-plum to-mauve z-30">
        {sidebar}
      </aside>
    </>
  )
}
