# EVConsults Platform — Content Management System & Secure Admin Portal

This repository contains the complete codebase for **EVConsults** (evconsults.pk), a premium, responsive corporate consultancy website focused on electric vehicle charging infrastructure in Pakistan. It is built using **Next.js 14 App Router** and features a database-driven architecture using **Prisma ORM**, a secure credentials-based **Admin Panel** protected by **Auth.js (NextAuth v5)**, custom **Three.js animations** for hero backgrounds, and dynamic content modules.

---

## Technical Stack
- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL (with Prisma Client)
- **Authentication:** Auth.js (NextAuth v5) using a secure Credentials provider
- **UI & Animation:** React 18, Framer Motion, Lucide React, and Three.js (for the interactive energy background)
- **Media Uploads:** Cloudinary (using server-signed client uploads)
- **Notifications:** Nodemailer (Gmail integration)

---

## 1. Environment Variables Configuration
To run the project, create a file named `.env.local` in the root directory. Copy and configure the following template:

```env
# ─── DATABASE SETTINGS ──────────────────────────────────────
# PostgreSQL Connection URL (e.g., local PostgreSQL instance, Supabase, Neon)
DATABASE_URL="postgresql://username:password@localhost:5432/evconsults?schema=public"

# ─── NEXTAUTH (AUTH.JS) SETTINGS ───────────────────────────
# Generate a secure secret using: openssl rand -base64 32
AUTH_SECRET="your_nextauth_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# ─── CLOUDINARY MEDIA SETTINGS ─────────────────────────────
# Credentials from your Cloudinary Dashboard
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# ─── SMTP (EMAIL NOTIFICATIONS) SETTINGS ───────────────────
# Real SMTP credentials for forwarding contact form requests
SMTP_USER="your_gmail_username@gmail.com"
# For Gmail, use an App Password (not your primary password)
SMTP_PASS="your_gmail_app_password"
```

---

## 2. Database & PostgreSQL Setup

### Option A: Local PostgreSQL Database
1. Download and install PostgreSQL for your operating system (e.g., pgAdmin / PostgreSQL installer).
2. Start the PostgreSQL service.
3. Create a new database named `evconsults`.
4. Update the `DATABASE_URL` connection string in your `.env.local` to point to your local PostgreSQL server instance.

### Option B: Cloud Database (Supabase / Neon / Render)
1. Sign up for a free PostgreSQL database provider like **Supabase** or **Neon**.
2. Provision a new PostgreSQL instance.
3. Copy the transaction or direct connection string URL and assign it to the `DATABASE_URL` in `.env.local`.

---

## 3. Prisma Migrations and Database Initialization

Once the database is running and `DATABASE_URL` is set, execute the following commands in sequence:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Generate the Prisma Client:**
   ```bash
   npx prisma generate
   ```

3. **Run Database Migrations (Applies the schema):**
   ```bash
   npx prisma migrate dev --name init
   ```
   *Alternative for rapid prototyping or temporary setups:*
   ```bash
   npx prisma db push
   ```

4. **Seed the Database (Seeds pages, sections, and the default admin user):**
   ```bash
   npx prisma db seed
   ```

---

## 4. Creating the First Admin User & Logging In

When you run `npx prisma db seed`, the seed script will automatically register the initial admin account using the following credentials:
- **Default Email:** `admin@evconsults.pk`
- **Default Password:** `admin123` *(Be sure to update this password in the database or admin portal once logged in!)*

To access the admin dashboard:
1. Navigate to `/admin` or `/admin/login`.
2. Enter the email and password above.
3. Upon validation, the Auth.js session cookie will be written, and you will be redirected to the secure `/admin/dashboard` page.

---

## 5. Cloudinary Setup (Media Library Uploads)

To enable uploading images/logos via the Admin Panel's Media Library:
1. Log in or sign up at [Cloudinary](https://cloudinary.com).
2. Retrieve your `Cloud Name`, `API Key`, and `API Secret` from the Dashboard console.
3. Paste these values into the corresponding variables in your `.env.local` file.
4. Ensure you set up an upload folder or configure an unsigned/signed upload preset if customized. The platform uses secure server-side signatures to execute uploads directly from the client browser to Cloudinary.

---

## 6. Running the Application Locally
After configuring your `.env.local` and running the seed command, start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the client-facing website, and [http://localhost:3000/admin](http://localhost:3000/admin) to manage the website content.

---

## 7. Deploying to Vercel

To host the site on Vercel:
1. Push your project code to a GitHub, GitLab, or Bitbucket repository.
2. Log into the Vercel Dashboard and click **Add New Project**.
3. Select your repository and import it.
4. Under **Environment Variables**, add all keys declared in `.env.local`:
   - `DATABASE_URL`
   - `AUTH_SECRET` (Use a securely generated random string)
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `SMTP_USER`
   - `SMTP_PASS`
5. Vercel will build and deploy the Next.js static and dynamic routing modules automatically.
6. Run the prisma seed logic on your remote database to populate pages if not already done.
