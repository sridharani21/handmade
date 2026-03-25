import AdminSidebar from '@/components/AdminSidebar'
import AdminGuard from './AdminGuard'

export const metadata = { title: 'Admin — Handmade with Love' }

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 ml-0 lg:ml-64 transition-all">
          <div className="p-6 sm:p-8 max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}
