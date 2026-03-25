import Link from 'next/link'
import { Heart, Instagram, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t-2 border-blush mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-plum to-rose flex items-center justify-center text-white text-lg">🌸</div>
              <div>
                <p className="font-display font-bold text-plum text-lg">Handmade with Love</p>
                <p className="text-xs text-mauve font-cute">Crafted just for you ✨</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-cute leading-relaxed max-w-xs">
              Every piece is handcrafted with care and love. We believe in the beauty of handmade things and the joy they bring.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://www.instagram.com/dhaarus_handmade_hub?utm_source=qr&igsh=MTZidmc4bnBicnhjZQ==" className="w-9 h-9 bg-blush rounded-full flex items-center justify-center hover:bg-rose hover:text-white text-plum transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-blush rounded-full flex items-center justify-center hover:bg-sage hover:text-white text-plum transition-colors">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-plum mb-4">Shop</h4>
            <ul className="space-y-2 text-sm font-cute">
              <li><Link href="/products" className="text-gray-500 hover:text-plum transition-colors">All Products</Link></li>
              <li><Link href="/products?category=jewellery" className="text-gray-500 hover:text-plum transition-colors">Jewellery 💎</Link></li>
              <li><Link href="/products?category=home-decor" className="text-gray-500 hover:text-plum transition-colors">Home Decor 🏡</Link></li>
              <li><Link href="/products?category=gift-sets" className="text-gray-500 hover:text-plum transition-colors">Gift Sets 🎁</Link></li>
              <li><Link href="/products?featured=true" className="text-gray-500 hover:text-plum transition-colors">✨ Featured</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-display font-bold text-plum mb-4">Help</h4>
            <ul className="space-y-2 text-sm font-cute">
              <li><Link href="/orders" className="text-gray-500 hover:text-plum transition-colors">Track Order</Link></li>
              <li><Link href="/wishlist" className="text-gray-500 hover:text-plum transition-colors">Wishlist 💕</Link></li>
              <li><Link href="/login" className="text-gray-500 hover:text-plum transition-colors">Login / Signup</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blush mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-400 font-cute flex items-center gap-1">
            Made with <Heart size={14} className="text-rose" fill="currentColor" /> — Handmade with Love
          </p>
          <p className="text-sm text-gray-400 font-cute">© {new Date().getFullYear()} All rights reserved</p>
        </div>
      </div>
    </footer>
  )
}
