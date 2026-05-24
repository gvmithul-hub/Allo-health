# Inventory Reservation System

A full-stack Inventory Reservation System built using Next.js, Prisma ORM, PostgreSQL (Supabase), and TypeScript.

The project allows users to reserve products from warehouses while preventing overselling using transactional inventory reservation handling and concurrency-safe backend operations.

---

# Features

- Product and warehouse-based inventory management
- Create, confirm, and release reservations
- Automatic reservation expiry handling
- Concurrency-safe stock reservation
- Dynamic inventory updates
- REST API integration
- Full-stack implementation using Next.js

---

# Tech Stack

- Next.js
- React
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- Tailwind CSS
- Vercel

---

# API Endpoints

```http
GET /api/products
POST /api/reservations
GET /api/reservations/:id
POST /api/reservations/:id/confirm
POST /api/reservations/:id/release
GET /api/cron/release-expired
```

---

# Concurrency Handling

The system prevents overselling using:

- Prisma Transactions
- Atomic Inventory Updates
- Reservation Validation Checks

---

# Automatic Expiry System

Reservations automatically expire after 10 minutes.

Expired reservations:

- Release reserved stock
- Update reservation status to `RELEASED`

Implemented using Vercel Cron Jobs.

---

# Installation

```bash
npm install
npx prisma generate
npm run dev
```

---



# Author

## GV Mithul

- Registration Number: 22MID0246
- Email: gvmithul@gmail.com
- VIT University
- Integrated M.Tech CSE (Data Science)
