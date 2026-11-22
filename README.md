# FixMate — Smart Device & Home Appliance Repair Platform (Frontend)

FixMate is a full-stack, enterprise-grade repair service management platform connecting residential and commercial device owners with certified local technicians. Built for Assignment 09 (Smart Device & Home Appliance Repair Service Platform Category).

---

## 🚀 Live Demo & Repository Links

- **Frontend Client:** [FixMate Client](https://fixmate-client.vercel.app)
- **Backend API:** [FixMate API Server](https://fixmate-server.onrender.com)
- **GitHub Client Repo:** `fixmate-client`
- **GitHub Server Repo:** `fixmate-server`

---

## 🔑 Examiner Test Accounts

The platform includes pre-seeded, verified MongoDB Atlas accounts across all three roles for evaluation:

| Role | Email | Password | Primary Capabilities |
|---|---|---|---|
| **Admin** | `admin@fixmate.io` | `Password123!` | Moderate services, inspect platform users, review Stripe transaction ledgers |
| **Technician 1** | `marcus.tech@fixmate.io` | `Password123!` | Create & edit repair services, manage repair queue, accept/advance jobs |
| **Technician 2** | `elena.tech@fixmate.io` | `Password123!` | Appliance specialist (AC, Refrigerator, Electrical), manage assignments |
| **Customer** | `customer@fixmate.io` | `Password123!` | Browse services, book repairs without upfront fees, pay via Stripe Checkout |

> **Tip:** You can click the quick demo buttons on the `/sign-in` page to autofill any of these test credentials instantly.

---

## 📋 Exact Assignment Route Map

FixMate satisfies all assignment route specifications with direct navigation, client-side linking, and page reloads:

| Assignment Route | Description | Role Access |
|---|---|---|
| `/` | Homepage with hero, 7 repair categories, how-it-works, and featured services | Public |
| `/services` | Directory with server search, category filters, mode filters, sorting, pagination | Public |
| `/services/[id]` | Comprehensive service details, technician credentials, booking modal | Public / Customer |
| `/sign-in` | Direct sign-in portal with quick demo autofill buttons | Public |
| `/sign-up` | Registration portal supporting Customer and Technician onboarding | Public |
| `/payment/success` | Stripe return page with cryptographic session verification & 90-day warranty receipt | Customer |
| `/payment/cancel` | Stripe cancellation return page reassuring booking preservation | Customer |
| `/dashboard/profile` | Unified profile management (avatar upload, phone, area, bio) | Customer, Tech, Admin |
| `/dashboard/customer` | Customer overview with active jobs, completed repairs, total spent | Customer |
| `/dashboard/customer/bookings` | Customer bookings tracking with cancel and Stripe Pay actions | Customer |
| `/dashboard/customer/bookings/[id]` | Deep booking detail with 4-stage lifecycle timeline stepper | Customer |
| `/dashboard/technician` | Technician workspace overview with pending requests and active jobs | Technician |
| `/dashboard/technician/add-service` | Service listing creation form with category & mode selection | Technician |
| `/dashboard/technician/my-services` | Technician service catalog management (view, edit, delete) | Technician |
| `/dashboard/technician/requests` | Technician repair queue with Accept, Decline, In-Progress, Complete actions | Technician |
| `/dashboard/admin` | Platform moderation overview (users, services, bookings, Stripe volume) | Admin |
| `/dashboard/admin/services` | Service moderation queue (Approve, Reject, Delete) | Admin |
| `/dashboard/admin/transactions` | Stripe gross volume ledger with linked booking inspection | Admin |
| `/terms` | Platform Terms of Service, warranty coverage, and cancellation rules | Public |
| `/privacy` | Privacy Policy detailing data handling and Stripe PCI isolation | Public |

---

## 🛠️ Tech Stack & Key Architecture Highlights

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, Lucide Icons, Class Variance Authority
- **Design System Palette:**
  - **Warm Ivory (`#F5F3EE`):** Clean page backgrounds
  - **Graphite (`#202522`):** Primary typography and high-contrast surfaces
  - **Repair Orange (`#F26A3D`):** Primary action buttons, badges, and brand highlights
  - **Muted Sage (`#DCE8DE`):** Verified status tags and subtle badges
- **State & Data Fetching:** Custom HTTP API Client with JWT session management, automatic 401 token handling, and Sonner toast notifications
- **Image Upload:** Direct multipart upload to `/api/upload/image` with ImgBB cloud storage
- **Payment Lifecycle:** Zero upfront payment model. Bookings remain unpaid until repair completion, triggering server-side Stripe Checkout session generation and idempotent webhook / session return verification.

---

## ⚙️ Local Development Setup

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd fixmate-client
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### 4. Build for Production

```bash
npm run build
npm run start
```

---

## 🔒 Security & Data Integrity

- **Route Guards:** Role-based `DashboardShell` enforcing customer, technician, or admin authorization before rendering protected views.
- **Form Validation:** Client-side Zod validation mirrors backend schemas to prevent invalid payload submissions.
- **Strict Payment Verification:** Payments are never assumed settled on the client; the `/payment/success` page makes a server-side call to `POST /api/payments/verify-session` to confirm Stripe settlement with MongoDB.
