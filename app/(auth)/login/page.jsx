'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (error) {
      toast.error(error.message === 'Invalid login credentials' ? 'Wrong email or password' : error.message)
    } else {
      toast.success('Welcome back! 🌸')
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <div className="card p-8 border-2 border-blush animate-slide-up">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🌸</div>
        <h1 className="font-display text-3xl font-bold text-plum">Welcome Back!</h1>
        <p className="text-gray-500 font-cute mt-1">Sign in to continue shopping</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-cute">Email</label>
          <input type="email" required className="input-field" placeholder="you@example.com"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-cute">Password</label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} required className="input-field pr-12"
              placeholder="Your password"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-mauve hover:text-plum transition-colors">
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-plum font-cute font-semibold hover:underline">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</>
          ) : (
            <><LogIn size={18} /> Sign In</>
          )}
        </button>
      </form>

      <p className="text-center mt-6 text-sm font-cute text-gray-500">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-plum font-semibold hover:underline">Sign up free 🌸</Link>
      </p>
    </div>
  )
}
