'use client'
import { useState, useEffect } from 'react'
import { Star, Edit2, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button"
          onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}>
          <Star size={24}
            className={(hover || value) >= s ? 'star-filled' : 'star-empty'}
            fill="currentColor" />
        </button>
      ))}
    </div>
  )
}

export default function ReviewSection({ productId }) {
  const { user, profile } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ rating: 5, title: '', body: '' })
  const [submitting, setSubmitting] = useState(false)
  const [myReview, setMyReview] = useState(null)

  useEffect(() => { fetchReviews() }, [productId])

  async function fetchReviews() {
    const { data } = await supabase
      .from('reviews')
      .select('*, profiles(full_name)')
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
    setReviews(data || [])
    if (user) {
      const mine = data?.find(r => r.user_id === user.id)
      setMyReview(mine || null)
      if (mine) setForm({ rating: mine.rating, title: mine.title || '', body: mine.body || '' })
    }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!user) { toast('Please login to leave a review 💕'); return }
    setSubmitting(true)
    const payload = { product_id: productId, user_id: user.id, ...form }
    let error
    if (myReview) {
      ({ error } = await supabase.from('reviews').update(payload).eq('id', myReview.id))
    } else {
      ({ error } = await supabase.from('reviews').insert(payload))
    }
    if (error) { toast.error('Failed to submit review'); }
    else { toast.success(myReview ? 'Review updated! ✨' : 'Review posted! 🌸'); setEditing(false); fetchReviews() }
    setSubmitting(false)
  }

  async function handleDelete() {
    if (!myReview) return
    await supabase.from('reviews').delete().eq('id', myReview.id)
    setMyReview(null); setForm({ rating: 5, title: '', body: '' })
    toast('Review deleted'); fetchReviews()
  }

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0
  const ratingCounts = [5,4,3,2,1].map(s => ({ star: s, count: reviews.filter(r => r.rating === s).length }))

  return (
    <div className="mt-12">
      <h2 className="section-title mb-8 flex items-center gap-2">
        ⭐ Customer Reviews
      </h2>

      {/* Summary */}
      {reviews.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 mb-8 bg-gradient-to-r from-cream to-blush/20 rounded-3xl p-6">
          <div className="text-center">
            <div className="font-display text-5xl font-bold text-plum">{avg.toFixed(1)}</div>
            <div className="flex justify-center gap-0.5 my-2">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={16} fill="currentColor"
                  className={s <= Math.round(avg) ? 'star-filled' : 'star-empty'} />
              ))}
            </div>
            <p className="text-sm text-gray-500 font-cute">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {ratingCounts.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-3 font-cute text-gray-600">{star}</span>
                <Star size={12} fill="currentColor" className="star-filled" />
                <div className="flex-1 bg-blush/40 rounded-full h-2 overflow-hidden">
                  <div className="bg-plum h-full rounded-full transition-all"
                    style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%' }} />
                </div>
                <span className="w-6 text-gray-400 font-cute">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write Review */}
      {user && (
        <div className="mb-8 card p-6 border-2 border-blush">
          {myReview && !editing ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-plum font-cute">Your Review</p>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(true)} className="p-1.5 rounded-full hover:bg-blush text-mauve transition-colors">
                    <Edit2 size={15} />
                  </button>
                  <button onClick={handleDelete} className="p-1.5 rounded-full hover:bg-red-100 text-red-400 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div className="flex gap-0.5 mb-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} fill="currentColor"
                    className={s <= myReview.rating ? 'star-filled' : 'star-empty'} />
                ))}
              </div>
              {myReview.title && <p className="font-semibold text-sm text-gray-700 mt-1">{myReview.title}</p>}
              {myReview.body && <p className="text-sm text-gray-600 mt-1">{myReview.body}</p>}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 className="font-display font-bold text-plum mb-4">
                {myReview ? 'Edit Your Review' : 'Write a Review 💕'}
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-cute">Rating *</label>
                <StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
              </div>
              <div className="mb-3">
                <input className="input-field" placeholder="Review title (optional)"
                  value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="mb-4">
                <textarea className="input-field resize-none" rows={3} placeholder="Share your experience..."
                  value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? 'Posting...' : myReview ? 'Update Review' : 'Post Review 🌸'}
                </button>
                {editing && (
                  <button type="button" onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
                )}
              </div>
            </form>
          )}
        </div>
      )}

      {!user && (
        <div className="mb-8 text-center py-6 bg-cream rounded-2xl border-2 border-dashed border-blush">
          <p className="text-gray-500 font-cute">
            <a href="/login" className="text-plum font-semibold hover:underline">Login</a> to write a review 💕
          </p>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="flex justify-center py-8"><div className="loader" /></div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-2">⭐</div>
          <p className="font-cute">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="card p-5 border border-blush/50">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mauve to-plum flex items-center justify-center text-white text-sm font-bold">
                      {review.profiles?.full_name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-plum font-cute">
                        {review.profiles?.full_name || 'Customer'}
                        {review.is_verified_purchase && (
                          <span className="ml-2 badge bg-mint text-sage text-xs">✓ Verified</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 font-cute">
                        {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={13} fill="currentColor"
                      className={s <= review.rating ? 'star-filled' : 'star-empty'} />
                  ))}
                </div>
              </div>
              {review.title && <p className="font-semibold text-gray-800 text-sm mb-1">{review.title}</p>}
              {review.body && <p className="text-gray-600 text-sm leading-relaxed">{review.body}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
