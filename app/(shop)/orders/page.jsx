'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Package, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'

const STATUS_STYLES = {
  placed: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-purple-100 text-purple-700',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const STATUS_EMOJI = {
  placed: '📋', confirmed: '✅', processing: '⚙️',
  shipped: '🚚', delivered: '🎉', cancelled: '❌'
}

export default function OrdersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const successOrderId = searchParams.get('success')

  const [orders, setOrders] = useState([])
  const [fetching, setFetching] = useState(true)
  const [expanded, setExpanded] = useState(successOrderId || null)

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return }
    if (user) fetchOrders()
  }, [user, loading])

  async function fetchOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setFetching(false)
  }

  if (loading || fetching) {
    return <div className="page-container flex justify-center py-20"><div className="loader" /></div>
  }

  return (
    <div className="page-container">
      {successOrderId && (
        <div className="mb-8 bg-green-50 border-2 border-green-200 rounded-3xl p-6 flex items-center gap-4 animate-slide-up">
          <CheckCircle size={40} className="text-green-500 flex-shrink-0" />
          <div>
            <h2 className="font-display text-xl font-bold text-green-700">Order Placed Successfully! 🎉</h2>
            <p className="text-green-600 font-cute">Thank you for your order. We'll start preparing it with love!</p>
          </div>
        </div>
      )}

      <h1 className="section-title mb-8 flex items-center gap-3">
        <Package className="text-plum" /> My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-7xl mb-4 animate-float">📦</div>
          <h2 className="font-display text-2xl text-plum mb-3">No orders yet</h2>
          <p className="text-gray-500 font-cute mb-8">Your order history will appear here</p>
          <Link href="/products" className="btn-primary">Start Shopping 🌸</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card border-2 border-blush/50 overflow-hidden">
              {/* Header */}
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-cream/50 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blush to-rose/40 rounded-2xl flex items-center justify-center text-xl">
                    {STATUS_EMOJI[order.order_status]}
                  </div>
                  <div>
                    <p className="font-cute font-bold text-plum">{order.order_number}</p>
                    <p className="text-xs text-gray-400 font-cute">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="font-bold text-plum font-cute">₹{order.total}</p>
                    <p className="text-xs text-gray-400 font-cute capitalize">{order.payment_method}</p>
                  </div>
                  <span className={`badge text-xs ${STATUS_STYLES[order.order_status]}`}>
                    {order.order_status}
                  </span>
                  {expanded === order.id ? <ChevronUp size={18} className="text-plum" /> : <ChevronDown size={18} className="text-plum" />}
                </div>
              </div>

              {/* Expanded */}
              {expanded === order.id && (
                <div className="border-t border-blush px-5 pb-5 animate-slide-up">
                  {/* Items */}
                  <div className="mt-4 space-y-3">
                    <h4 className="font-cute font-bold text-gray-600 text-sm">Items ordered:</h4>
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-cream rounded-2xl p-3">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-blush/30">
                          {item.images?.[0] ? (
                            <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                          ) : <div className="w-full h-full flex items-center justify-center text-2xl">🌸</div>}
                        </div>
                        <div className="flex-1">
                          <p className="font-cute font-semibold text-plum text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500 font-cute">×{item.quantity} × ₹{item.price}</p>
                        </div>
                        <p className="font-bold text-plum text-sm">₹{(item.price * item.quantity).toFixed(0)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Price breakdown */}
                  <div className="mt-4 bg-cream rounded-2xl p-4 space-y-1 text-sm font-cute">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span><span>₹{order.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery</span>
                      <span>{parseFloat(order.delivery_charge) === 0 ? 'FREE' : `₹${order.delivery_charge}`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-plum text-base pt-1 border-t border-blush">
                      <span>Total</span><span>₹{order.total}</span>
                    </div>
                  </div>

                  {/* Delivery address */}
                  {order.address_snapshot && (
                    <div className="mt-4 text-sm font-cute text-gray-600">
                      <h4 className="font-bold text-gray-700 mb-1">📍 Delivery Address:</h4>
                      <p>{order.address_snapshot.full_name} • {order.address_snapshot.phone}</p>
                      <p>{order.address_snapshot.address_line1}, {order.address_snapshot.city}, {order.address_snapshot.state} - {order.address_snapshot.pincode}</p>
                    </div>
                  )}

                  {/* Payment status */}
                  <div className="mt-3 flex items-center gap-2 text-sm font-cute">
                    <span className="text-gray-500">Payment:</span>
                    <span className={`badge text-xs ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {order.payment_status}
                    </span>
                    <span className="text-gray-400">via {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
