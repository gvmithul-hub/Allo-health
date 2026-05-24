````md
# Inventory Reservation System

A full-stack Inventory Reservation System built using Next.js, Prisma, PostgreSQL (Supabase), and TypeScript.

The application allows users to reserve inventory items from warehouses while preventing overselling using transactional reservation handling.

---

# Live Demo

Add your deployed Vercel URL here:

```bash
https://inventory-reservation-system-sable.vercel.app/
````

---

# GitHub Repository

```bash
https://github.com/Shankar-tadikonda89/inventory-reservation-system
```

---

# Features

## Inventory Management

* Products stored across multiple warehouses
* Tracks:

  * Total Stock
  * Reserved Stock
  * Available Stock

---

## Reservation System

Users can:

* Reserve inventory
* Confirm reservation
* Cancel reservation
* Automatically release expired reservations

---

## Concurrency Handling

Prevents overselling using:

* PostgreSQL transactions
* Atomic reservation updates
* Consistent inventory management

---

## Reservation Expiry

Reservations automatically expire after 10 minutes.

Expired reservations:

* Release reserved inventory
* Update reservation status to `RELEASED`

Implemented using:

* Vercel Cron Jobs

---

# Tech Stack

## Frontend

* Next.js 16
* React
* Tailwind CSS
* TypeScript

---

## Backend

* Next.js API Routes
* Prisma ORM
* PostgreSQL

---

## Database

* Supabase PostgreSQL

---

## Deployment

* Vercel

---

# Architecture

```text
Next.js Frontend
        ↓
Next.js API Routes
        ↓
Prisma ORM
        ↓
Supabase PostgreSQL
```

---

# Database Schema

## Product

Stores product information.

## Warehouse

Stores warehouse information.

## Inventory

Tracks:

* Total Stock
* Reserved Stock

for each product per warehouse.

## Reservation

Tracks:

* Reserved items
* Reservation status
* Expiry time

---

# API Endpoints

## Products

### Get Products

```http
GET /api/products
```

---

## Reservations

### Create Reservation

```http
POST /api/reservations
```

Request:

```json
{
  "productId": "PRODUCT_ID",
  "warehouseId": "WAREHOUSE_ID",
  "quantity": 1
}
```

---

### Get Reservation

```http
GET /api/reservations/:id
```

---

### Confirm Reservation

```http
POST /api/reservations/:id/confirm
```

---

### Release Reservation

```http
POST /api/reservations/:id/release
```

---

## Cron Job

### Release Expired Reservations

```http
GET /api/cron/release-expired
```

---

# Reservation Flow

```text
Reserve Product
      ↓
Stock Reserved
      ↓
Reservation Created
      ↓
Confirm OR Release
      ↓
Inventory Updated
```

---

# Concurrency Handling

The system prevents race conditions using database transactions.

Without concurrency protection:

```text
Two users reserve the last item simultaneously
→ Overselling occurs
```

Solution used:

* Prisma transactions
* Atomic inventory updates
* Stock validation before reservation

---

# HTTP Status Codes

## 409 Conflict

Returned when:

```text
Not enough stock available
```

---

## 410 Gone

Returned when:

```text
Reservation expired
```

---

# Local Setup

## Clone Repository

```bash
git clone https://github.com/Shankar-tadikonda89/inventory-reservation-system.git
```

---

## Move Into Project

```bash
cd inventory-reservation-system
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create:

```bash
.env
```

Add:

```env
DATABASE_URL=YOUR_SUPABASE_DATABASE_URL
```

---

## Start Development Server

```bash
npm run dev
```

---

# Deployment

The application is deployed using:

* Vercel
* Supabase PostgreSQL

---

# Cron Job Configuration

`vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/release-expired",
      "schedule": "* * * * *"
    }
  ]
}
```

---

# Future Improvements

* Authentication
* Payment Integration
* Redis Distributed Locking
* WebSockets for live inventory updates
* Admin Dashboard
* Analytics
* Retry mechanisms
* Idempotency keys

---

# Author

Shankar Tadikonda

```bash
VIT University
Integrated M.Tech
```

```
```
