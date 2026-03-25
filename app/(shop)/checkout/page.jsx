'use client'
import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { supabase, getSettings } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Plus, CreditCard, Truck, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const [addresses, setAddresses] = useState([])
  const [selectedAddr, setSelectedAddr] = useState(null)
  const [addingAddr, setAddingAddr] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [settings, setSettings] = useState({})
  const [placing, setPlacing] = useState(false)
  const [addrForm, setAddrForm] = useState({
    full_name: '', phone: '', address_line1: '', address_line2: '',
    city: '', state: '', pincode: '', is_default: false
  })

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    fetchAddresses()
    getSettings().then(setSettings)
  }, [user])

  async function fetchAddresses() {
    const { data } = await supabase.from('addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false })
    setAddresses(data || [])
    const def = data?.find(a => a.is_default) || data?.[0]
    if (def) setSelectedAddr(def.id)
  }

  async function saveAddress() {
    if (!addrForm.full_name || !addrForm.phone || !addrForm.address_line1 || !addrForm.city || !addrForm.state || !addrForm.pincode) {
      toast.error('Please fill all required fields'); return
    }
    const { error } = await supabase.from('addresses').insert({ ...addrForm, user_id: user.id })
    if (error) { toast.error('Failed to save address'); return }
    toast.success('Address saved! 🏠')
    setAddingAddr(false)
    setAddrForm({ full_name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', pincode: '', is_default: false })
    fetchAddresses()
  }

  async function placeOrder() {
    if (!selectedAddr) { toast.error('Please select a delivery address'); return }
    if (items.length === 0) { toast.error('Cart is empty'); return }
    setPlacing(true)

    const addr = addresses.find(a => a.id === selectedAddr)
    const deliveryCharge = subtotal >= parseFloat(settings.free_delivery_above || 500)
      ? 0 : parseFloat(settings.delivery_charge || 50)
    const total = subtotal + deliveryCharge

    const { data, error } = await supabase.from('orders').insert({
      user_id: user.id,
      address_id: selectedAddr,
      address_snapshot: addr,
      items: items,
      subtotal,
      delivery_charge: deliveryCharge,
      total,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
      order_status: 'placed'
    }).select().single()

    if (error) { toast.error('Failed to place order. Please try again.'); setPlacing(false); return }

    clearCart()
    toast.success('Order placed! 🎉')
    router.push(`/orders?success=${data.id}`)
  }

  const deliveryCharge = subtotal >= parseFloat(settings.free_delivery_above || 500)
    ? 0 : parseFloat(settings.delivery_charge || 50)
  const total = subtotal + deliveryCharge

  if (!user) return null

  return (
    <div className="page-container">
      <h1 className="section-title mb-8">🛍️ Checkout</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <p className="font-display text-2xl text-plum mb-4">Your cart is empty</p>
          <Link href="/products" className="btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="card p-6 border-2 border-blush">
              <h2 className="font-display text-xl font-bold text-plum mb-4 flex items-center gap-2">
                <MapPin size={20} /> Delivery Address
              </h2>

              {addresses.length > 0 && (
                <div className="space-y-3 mb-4">
                  {addresses.map(addr => (
                    <label key={addr.id} className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedAddr === addr.id ? 'border-plum bg-blush/20' : 'border-blush hover:border-rose'
                    }`}>
                      <input type="radio" name="address" value={addr.id}
                        checked={selectedAddr === addr.id}
                        onChange={() => setSelectedAddr(addr.id)}
                        className="mt-1 accent-plum" />
                      <div className="flex-1">
                        <p className="font-semibold text-plum font-cute">{addr.full_name}
                          {addr.is_default && <span className="ml-2 badge bg-mint text-sage text-xs">Default</span>}
                        </p>
                        <p className="text-sm text-gray-600 font-cute">{addr.phone}</p>
                        <p className="text-sm text-gray-600 font-cute">
                          {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <button
                onClick={() => setAddingAddr(!addingAddr)}
                className="flex items-center gap-2 text-plum font-cute font-semibold text-sm hover:underline"
              >
                {addingAddr ? <ChevronUp size={16} /> : <Plus size={16} />}
                {addingAddr ? 'Cancel' : 'Add New Address'}
              </button>

              {addingAddr && (
                <div className="mt-4 space-y-3 animate-slide-up">
                  <div className="grid grid-cols-2 gap-3">
                    <input className="input-field" placeholder="Full Name *" value={addrForm.full_name}
                      onChange={e => setAddrForm(f => ({ ...f, full_name: e.target.value }))} />
                    <input className="input-field" placeholder="Phone *" value={addrForm.phone}
                      onChange={e => setAddrForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <input className="input-field" placeholder="Address Line 1 *" value={addrForm.address_line1}
                    onChange={e => setAddrForm(f => ({ ...f, address_line1: e.target.value }))} />
                  <input className="input-field" placeholder="Address Line 2 (optional)" value={addrForm.address_line2}
                    onChange={e => setAddrForm(f => ({ ...f, address_line2: e.target.value }))} />
                  <div className="grid grid-cols-3 gap-3">
                    <input className="input-field" placeholder="City *" value={addrForm.city}
                      onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))} />
                    <input className="input-field" placeholder="State *" value={addrForm.state}
                      onChange={e => setAddrForm(f => ({ ...f, state: e.target.value }))} />
                    <input className="input-field" placeholder="Pincode *" value={addrForm.pincode}
                      onChange={e => setAddrForm(f => ({ ...f, pincode: e.target.value }))} />
                  </div>
                  <label className="flex items-center gap-2 font-cute text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox" className="accent-plum" checked={addrForm.is_default}
                      onChange={e => setAddrForm(f => ({ ...f, is_default: e.target.checked }))} />
                    Set as default address
                  </label>
                  <button onClick={saveAddress} className="btn-primary">Save Address</button>
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="card p-6 border-2 border-blush">
              <h2 className="font-display text-xl font-bold text-plum mb-4 flex items-center gap-2">
                <CreditCard size={20} /> Payment Method
              </h2>
              <div className="space-y-3">
                {settings.cod_enabled !== 'false' && (
                  <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod' ? 'border-plum bg-blush/20' : 'border-blush hover:border-rose'
                  }`}>
                    <input type="radio" name="payment" value="cod"
                      checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')}
                      className="accent-plum" />
                    <Truck size={20} className="text-plum" />
                    <div>
                      <p className="font-semibold text-plum font-cute">Cash on Delivery</p>
                      <p className="text-xs text-gray-500 font-cute">Pay when you receive your order</p>
                    </div>
                  </label>
                )}

                {settings.online_payment_enabled !== 'false' && (
                  <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'online' ? 'border-plum bg-blush/20' : 'border-blush hover:border-rose'
                  }`}>
                    <input type="radio" name="payment" value="online"
                      checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')}
                      className="accent-plum" />
                    <CreditCard size={20} className="text-plum" />
                    <div>
                      <p className="font-semibold text-plum font-cute">Online Payment (UPI)</p>
                      <p className="text-xs text-gray-500 font-cute">Pay via UPI QR code — scan after ordering</p>
                    </div>
                  </label>
                )}

                {paymentMethod === 'online' && settings.qr_code_url && (
                  <div className="mt-4 p-4 bg-cream rounded-2xl border border-blush text-center animate-slide-up">
                    <p className="font-cute font-semibold text-plum mb-3">Scan to Pay</p>
                    <div className="w-48 h-48 mx-auto relative bg-white rounded-2xl p-2 shadow-md">
                      <Image src={settings.qr_code_url} alt="UPI QR Code" fill className="object-contain p-2" />
                    </div>
                    <p className="text-sm text-gray-500 font-cute mt-3">UPI: {settings.upi_id}</p>
                    <p className="text-xs text-gray-400 font-cute mt-1">Amount: ₹{total.toFixed(2)}</p>
                    <p className="text-xs text-orange-500 font-cute mt-2">⚠️ Send payment screenshot to confirm your order</p>
                  </div>
                )}

                {paymentMethod === 'online' && !settings.qr_code_url && (
                  <div className="mt-3 p-4 bg-butter/50 rounded-2xl border border-butter text-center">
                    <p className="font-cute font-semibold text-plum">UPI ID: {settings.upi_id || 'Contact seller'}</p>
                    <p className="text-xs text-gray-500 mt-1">Amount: ₹{total.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right — Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 border-2 border-blush sticky top-24">
              <h2 className="font-display text-xl font-bold text-plum mb-4">Order Summary</h2>

              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-cream">
                      {item.images?.[0] ? (
                        <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                      ) : <div className="w-full h-full flex items-center justify-center text-xl">🌸</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-cute text-sm text-plum font-semibold truncate">{item.name}</p>
                      <p className="text-xs text-gray-500 font-cute">×{item.quantity}</p>
                    </div>
                    <p className="font-bold text-plum text-sm">₹{(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-blush pt-4 space-y-2">
                <div className="flex justify-between text-sm font-cute text-gray-600">
                  <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-cute text-gray-600">
                  <span>Delivery</span>
                  <span className={deliveryCharge === 0 ? 'text-sage font-semibold' : ''}>
                    {deliveryCharge === 0 ? 'FREE 🎉' : `₹${deliveryCharge}`}
                  </span>
                </div>
                {deliveryCharge > 0 && (
                  <p className="text-xs text-gray-400 font-cute">Free delivery above ₹{settings.free_delivery_above || 500}</p>
                )}
                <div className="border-t border-blush pt-2 flex justify-between font-display text-lg font-bold text-plum">
                  <span>Total</span><span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={placing || !selectedAddr}
                className="btn-primary w-full mt-5 flex items-center justify-center gap-2"
              >
                {placing ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Placing Order...</>
                ) : (
                  <>🎉 Place Order</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
