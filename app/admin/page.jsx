'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ShoppingBag, Package, Users, TrendingUp, Clock, CheckCircle, Truck, XCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, products: 0, users: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const [
      { count: orderCount },
      { count: productCount },
      { count: userCount },
      { data: orders },
      { data: revenue },
    ] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('orders').select('total').neq('order_status', 'cancelled'),
    ])
    const totalRevenue = revenue?.reduce((s, o) => s + parseFloat(o.total), 0) || 0
    setStats({ orders: orderCount || 0, products: productCount || 0, users: userCount || 0, revenue: totalRevenue })
    setRecentOrders(orders || [])
    setLoading(false)
  }

  const STATUS_COLOR = {
    placed: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-purple-100 text-purple-700',
    processing: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  const STATUS_ICON = { placed: Clock, confirmed: CheckCircle, processing: Package, shipped: Truck, delivered: CheckCircle, cancelled: XCircle }

  if (loading) return <div className="flex justify-center py-20"><div className="loader" /></div>

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-plum">Dashboard 🌸</h1>
        <p className="text-gray-500 font-cute mt-1">Welcome back, here's what's happening</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'from-blue-400 to-blue-600', link: '/admin/orders' },
          { label: 'Active Products', value: stats.products, icon: Package, color: 'from-plum to-mauve', link: '/admin/products' },
          { label: 'Customers', value: stats.users, icon: Users, color: 'from-rose to-mauve', link: '#' },
          { label: 'Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'from-green-400 to-green-600', link: '/admin/orders' },
        ].map(stat => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.link}
              className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border border-blush/50">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-sm`}>
                <Icon size={22} className="text-white" />
              </div>
              <p className="font-display text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 font-cute">{stat.label}</p>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link href="/admin/products" className="flex items-center gap-3 bg-gradient-to-r from-plum to-mauve text-white p-5 rounded-3xl hover:shadow-lg transition-all hover:-translate-y-0.5">
          <Package size={24} />
          <div>
            <p className="font-cute font-bold">Manage Products</p>
            <p className="text-xs text-white/70 font-cute">Add, edit, delete items</p>
          </div>
        </Link>
        <Link href="/admin/orders" className="flex items-center gap-3 bg-gradient-to-r from-sage to-mint/80 text-white p-5 rounded-3xl hover:shadow-lg transition-all hover:-translate-y-0.5">
          <ShoppingBag size={24} />
          <div>
            <p className="font-cute font-bold">View Orders</p>
            <p className="text-xs text-white/70 font-cute">Update order status</p>
          </div>
        </Link>
        <Link href="/admin/settings" className="flex items-center gap-3 bg-gradient-to-r from-peach to-rose text-white p-5 rounded-3xl hover:shadow-lg transition-all hover:-translate-y-0.5">
          <TrendingUp size={24} />
          <div>
            <p className="font-cute font-bold">Shop Settings</p>
            <p className="text-xs text-white/70 font-cute">Update charges, QR code</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-3xl border border-blush/50 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-blush/50">
          <h2 className="font-display text-xl font-bold text-plum">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-plum font-cute font-semibold hover:underline">View all →</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-cute">No orders yet 📦</div>
        ) : (
          <div className="divide-y divide-blush/30">
            {recentOrders.map(order => {
              const Icon = STATUS_ICON[order.order_status] || Clock
              return (
                <div key={order.id} className="flex items-center justify-between px-6 py-4 hover:bg-cream/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blush/30 rounded-2xl flex items-center justify-center">
                      <Icon size={16} className="text-plum" />
                    </div>
                    <div>
                      <p className="font-cute font-bold text-plum text-sm">{order.order_number}</p>
                      <p className="text-xs text-gray-400 font-cute">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {order.payment_method.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-plum font-cute">₹{order.total}</span>
                    <span className={`badge text-xs ${STATUS_COLOR[order.order_status]}`}>{order.order_status}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
