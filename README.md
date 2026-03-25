# 🌸 Handmade with Love — E-Commerce Shop

A complete handmade goods e-commerce website built with **Next.js 14 + Supabase**.

---

## 📦 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + forgot password) |
| Storage | Supabase Storage (product images, QR code) |
| Styling | Tailwind CSS + Google Fonts |
| State | React Context (Cart, Wishlist, Auth) |

---

## 🚀 Step-by-Step Setup

### Step 1 — Create Supabase Project

1. Go to https://supabase.com and sign up (free)
2. Click **New Project** → give it a name (e.g. `handmade-shop`)
3. Choose a strong password → select region → click **Create**
4. Wait for it to initialize (~1 min)

### Step 2 — Run the Database Schema

1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire contents of `supabase-schema.sql` (in this project root)
4. Paste it into the editor and click **Run**
5. You should see "Success" messages

### Step 3 — Set Up Storage Buckets

1. In Supabase dashboard → **Storage** (left sidebar)
2. Click **New Bucket** → name: `product-images` → check **Public bucket** → Create
3. Click **New Bucket** again → name: `shop-assets` → check **Public bucket** → Create

### Step 4 — Get Your Supabase Keys

1. In Supabase dashboard → **Settings** → **API**
2. Copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon / public** key (long string starting with `eyJ...`)

### Step 5 — Configure Environment Variables

Edit the `.env.local` file in this project:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
NEXT_PUBLIC_ADMIN_EMAIL=youremail@example.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 6 — Install & Run Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:3000 in your browser 🎉

### Step 7 — Make Yourself Admin

1. Go to http://localhost:3000/signup and create an account with your email
2. Go to Supabase dashboard → **SQL Editor** → run this:

```sql
UPDATE profiles 
SET is_admin = TRUE 
WHERE id = (SELECT id FROM auth.users WHERE email = 'youremail@example.com');
```

3. Now visit http://localhost:3000/admin — you have full admin access!

### Step 8 — Add Your QR Code (for UPI payments)

1. Login as admin → go to http://localhost:3000/admin/settings
2. Under **Payment Settings** → click **Upload QR**
3. Upload your UPI QR code image
4. Enter your UPI ID
5. Click **Save All Settings**

---

## 🌐 Deploy to Vercel (Free)

### Option A — Via GitHub (Recommended)

1. Push this project to a GitHub repo:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/handmade-shop.git
git push -u origin main
```

2. Go to https://vercel.com → Sign in with GitHub
3. Click **Add New Project** → import your repo
4. Add Environment Variables (same as `.env.local` but change `SITE_URL`):
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
   - `NEXT_PUBLIC_ADMIN_EMAIL` = your email
   - `NEXT_PUBLIC_SITE_URL` = `https://your-project.vercel.app`
5. Click **Deploy** — done! 🎉

### Option B — Via Vercel CLI

```bash
npm install -g vercel
vercel
# Follow prompts, add env vars when asked
```

### After Deploying — Update Password Reset URL

1. In Supabase dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL** to your Vercel URL: `https://your-project.vercel.app`
3. Add to **Redirect URLs**: `https://your-project.vercel.app/reset-password`

---

## 📁 Folder Structure

```
handmade-shop/
├── app/
│   ├── (auth)/             ← Login, Signup, Forgot/Reset Password
│   ├── (shop)/             ← Home, Products, Cart, Wishlist, Checkout, Orders
│   ├── admin/              ← Admin Dashboard, Products, Orders, Settings
│   └── globals.css
├── components/
│   ├── Navbar.jsx
│   ├── CartDrawer.jsx
│   ├── ProductCard.jsx
│   ├── ReviewSection.jsx
│   ├── AdminSidebar.jsx
│   └── Footer.jsx
├── context/
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── WishlistContext.jsx
├── lib/
│   └── supabase.js
├── supabase-schema.sql     ← Run this in Supabase SQL Editor
└── .env.local              ← Add your keys here
```

---

## ✨ Features

### Customer Features
- 🌸 Beautiful homepage with hero, categories, featured & new arrivals
- 🛍️ Product listing with search, filter by category, sort by price
- 📖 Product detail with image gallery, reviews, related products
- 🛒 Sliding cart drawer with quantity controls
- 💕 Wishlist (saved to database, persists across devices)
- 🏠 Multiple delivery addresses, default address support
- 💳 COD + UPI QR code payment
- 📦 Order history with status tracking
- ⭐ Write, edit, delete product reviews with star ratings
- 🔐 Forgot password / reset password via email

### Admin Features
- 📊 Dashboard with order/revenue stats
- ➕ Add, edit, delete products with image upload
- 🔴 Mark products as Out of Stock instantly
- ✨ Feature/unfeature products
- 📦 View all orders, update order status & payment status
- 🚚 Set delivery charges & free delivery threshold
- 💳 Toggle COD / Online payment on/off
- 📱 Upload UPI QR code
- 📂 Add/delete product categories
- 🏪 Edit shop name, tagline, social links

---

## ❓ Common Issues

**Q: Login isn't working?**
A: Make sure email confirmation is disabled or check your email. In Supabase → Authentication → Providers → Email → disable "Confirm email" for testing.

**Q: Images not showing after upload?**
A: Make sure both storage buckets (`product-images` and `shop-assets`) are set to **Public**.

**Q: Admin page redirects to login?**
A: Run the SQL to set your profile as admin (Step 7 above).

**Q: Password reset email not arriving?**
A: Check spam folder. Also make sure `NEXT_PUBLIC_SITE_URL` is set correctly in your environment.
