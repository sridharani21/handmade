'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleReset(e) {
    e.preventDefault()
    if (password !== confirm) { toast.error('Passwords do not match'); return }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) toast.error(error.message)
    else {
      toast.success('Password updated! 🎉')
      router.push('/login')
    }
    setLoading(false)
  }

  return (
    <div className="card p-8 border-2 border-blush animate-slide-up">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🔐</div>
        <h1 className="font-display text-3xl font-bold text-plum">Set New Password</h1>
        <p className="text-gray-500 font-cute mt-1">Choose a strong new password</p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-cute">New Password</label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} required className="input-field pr-12"
              placeholder="Min 6 characters"
              value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-mauve hover:text-plum">
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5 font-cute">Confirm Password</label>
          <input type="password" required className="input-field" placeholder="Repeat password"
            value={confirm} onChange={e => setConfirm(e.target.value)} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Updating...' : 'Update Password 🔐'}
        </button>
      </form>
    </div>
  )
}
