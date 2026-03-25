'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUSES = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded']

const STATUS_COLOR = {
  placed: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-purple-100 text-purple-700',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}
const PAY_COLOR = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-600',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => { fetchOrders() }, [])

  async function fetchOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  async function updateOrderStatus(id, field, value) {
    const { error } = await supabase.from('orders').update({ [field]: value }).eq('id', id)
    if (error) toast.error('Update failed')
    else { toast.success('Updated! ✅'); fetchOrders() }
  }

  const filtered = orders.filter(o => {
    const matchSearch = o.order_number.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || o.order_status === filterStatus
    return matchSearch && matchStatus
  })

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-plum">Orders 📦</h1>
        <p className="text-gray-500 font-cute mt-1">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mauve" />
          <input className="input-field pl-11" placeholder="Search by order number..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field sm:w-48" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map(s => {
          const count = orders.filter(o => o.order_status === s).length
          return (
            <button key={s}
              onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
              className={`badge text-xs cursor-pointer px-3 py-1.5 transition-all ${
                filterStatus === s ? STATUS_COLOR[s] + ' ring-2 ring-offset-1 ring-current' : STATUS_COLOR[s]
              }`}>
              {count} {s}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="loader" /></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-3xl border border-blush/50 overflow-hidden shadow-sm">
              {/* Row */}
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-cream/50 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-cute font-bold text-plum">{order.order_number}</p>
                    <p className="text-xs text-gray-400 font-cute">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-plum font-cute hidden sm:block">₹{order.total}</span>
                  <span className={`badge text-xs ${STATUS_COLOR[order.order_status]}`}>{order.order_status}</span>
                  <span className={`badge text-xs hidden sm:inline-flex ${PAY_COLOR[order.payment_status]}`}>{order.payment_status}</span>
                  {expanded === order.id ? <ChevronUp size={16} className="text-plum" /> : <ChevronDown size={16} className="text-plum" />}
                </div>
              </div>

              {/* Expanded */}
              {expanded === order.id && (
                <div className="border-t border-blush/50 px-5 pb-5 animate-slide-up">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                    {/* Left */}
                    <div>
                      <h4 className="font-cute font-bold text-gray-700 mb-3 text-sm">Order Items:</h4>
                      <div className="space-y-2">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex justify-between items-center text-sm font-cute bg-cream rounded-xl px-3 py-2">
                            <span className="text-plum font-semibold">{item.name}</span>
                            <span className="text-gray-600">×{item.quantity} · ₹{(item.price * item.quantity).toFixed(0)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 space-y-1 text-sm font-cute border-t border-blush pt-3">
                        <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
                        <div className="flex justify-between text-gray-600">
                          <span>Delivery</span>
                          <span>{parseFloat(order.delivery_charge) === 0 ? 'FREE' : `₹${order.delivery_charge}`}</span>
                        </div>
                        <div className="flex justify-between font-bold text-plum text-base border-t border-blush pt-1">
                          <span>Total</span><span>₹{order.total}</span>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      {order.address_snapshot && (
                        <div className="mt-4 bg-cream rounded-xl p-3 text-sm font-cute text-gray-600">
                          <p className="font-bold text-gray-700 mb-1">📍 Delivery Address:</p>
                          <p>{order.address_snapshot.full_name} · {order.address_snapshot.phone}</p>
                          <p>{order.address_snapshot.address_line1}</p>
                          {order.address_snapshot.address_line2 && <p>{order.address_snapshot.address_line2}</p>}
                          <p>{order.address_snapshot.city}, {order.address_snapshot.state} - {order.address_snapshot.pincode}</p>
                        </div>
                      )}
                    </div>

                    {/* Right — Controls */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 font-cute">Order Status</label>
                        <select
                          value={order.order_status}
                          onChange={e => updateOrderStatus(order.id, 'order_status', e.target.value)}
                          className="input-field"
                        >
                          {STATUSES.map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 font-cute">Payment Status</label>
                        <select
                          value={order.payment_status}
                          onChange={e => updateOrderStatus(order.id, 'payment_status', e.target.value)}
                          className="input-field"
                        >
                          {PAYMENT_STATUSES.map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      <div className="bg-cream rounded-2xl p-3 text-sm font-cute space-y-1">
                        <div className="flex justify-between text-gray-600">
                          <span>Payment:</span>
                          <span className="font-semibold capitalize">{order.payment_method}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Order ID:</span>
                          <span className="font-mono text-xs text-gray-400">{order.id.slice(0, 8)}...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400 font-cute">
              <div className="text-5xl mb-3">📦</div>
              No orders found
            </div>
          )}
        </div>
      )}
    </div>
  )
}
