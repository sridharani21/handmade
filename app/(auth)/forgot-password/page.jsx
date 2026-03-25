'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleReset(e) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`
    })
    if (error) toast.error(error.message)
    else { setSent(true); toast.success('Reset link sent! 📧') }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="card p-8 border-2 border-blush animate-slide-up text-center">
        <div className="text-6xl mb-4">📧</div>
        <h1 className="font-display text-2xl font-bold text-plum mb-3">Check your email!</h1>
        <p className="text-gray-500 font-cute mb-2">We sent a password reset link to:</p>
        <p className="font-semibold text-plum font-cute mb-6">{email}</p>
        <p className="text-sm text-gray-400 font-cute mb-6">Didn&apos;t receive it? Check your spam folder or try again.</p>
        <button onClick={() => setSent(false)} className="btn-secondary w-full mb-3">Send again</button>
        <Link href="/login" className="block text-center text-sm text-plum font-cute font-semibold hover:underline">
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <div className="card p-8 border-2 border-blush animate-slide-up">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🔑</div>
        <h1 className="font-display text-3xl font-bold text-plum">Forgot Password?</h1>
        <p className="text-gray-500 font-cute mt-1">No worries! We&apos;ll send you a reset link.</p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-cute">Email Address</label>
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mauve" />
            <input type="email" required className="input-field pl-11" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
          ) : (
            <>Send Reset Link 📧</>
          )}
        </button>
      </form>

      <Link href="/login" className="flex items-center justify-center gap-2 mt-6 text-sm text-plum font-cute font-semibold hover:underline">
        <ArrowLeft size={14} /> Back to login
      </Link>
    </div>
  )
}
