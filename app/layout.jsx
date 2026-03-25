import './globals.css'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { AuthProvider } from '@/context/AuthContext'

export const metadata = {
  title: 'Handmade with Love 🌸',
  description: 'Unique handcrafted items made with love, just for you.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
              <Toaster
                position="top-center"
                toastOptions={{
                  className: 'toast-cute',
                  style: {
                    background: '#fff',
                    color: '#3d2b2b',
                    border: '2px solid #FFD6D6',
                    fontFamily: 'Quicksand, sans-serif',
                    fontWeight: '600',
                  },
                  success: {
                    iconTheme: { primary: '#8B4F7F', secondary: '#fff' },
                  },
                  error: {
                    iconTheme: { primary: '#e74c3c', secondary: '#fff' },
                  },
                }}
              />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
