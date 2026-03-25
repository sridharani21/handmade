import Link from 'next/link'

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-blush/20 to-mint/20 flex items-center justify-center p-4">
      <div className="absolute top-6 left-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-plum to-rose flex items-center justify-center text-white text-lg font-bold shadow-md group-hover:scale-110 transition-transform">
            🌸
          </div>
          <div>
            <p className="font-display font-bold text-plum text-lg leading-tight">Handmade</p>
            <p className="text-xs text-mauve font-cute font-medium -mt-1">with Love ✨</p>
          </div>
        </Link>
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-rose/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-mint/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
