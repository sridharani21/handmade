'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSignup(e) {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } }
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Account created! Please check your email to verify. 📧')
      router.push('/login')
    }
    setLoading(false)
  }

  return (
    <div className="card p-8 border-2 border-blush animate-slide-up">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">✨</div>
        <h1 className="font-display text-3xl font-bold text-plum">Create Account</h1>
        <p className="text-gray-500 font-cute mt-1">Join our little handmade family!</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-cute">Full Name</label>
          <input type="text" required className="input-field" placeholder="Your name"
            value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-cute">Email</label>
          <input type="email" required className="input-field" placeholder="you@example.com"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-cute">Password</label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} required className="input-field pr-12"
              placeholder="Min 6 characters"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-mauve hover:text-plum transition-colors">
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-cute">Confirm Password</label>
          <input type="password" required className="input-field" placeholder="Repeat your password"
            value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account...</>
          ) : (
            <><UserPlus size={18} /> Create Account</>
          )}
        </button>
      </form>

      <p className="text-center mt-6 text-sm font-cute text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="text-plum font-semibold hover:underline">Sign in 🌸</Link>
      </p>
    </div>
  )
}
