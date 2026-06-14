# Veda Global Exports - Agricultural Trading Platform (MERN)

This repository holds the full Veda Global Exports website code, complete with B2B/B2C Mode Selector, Shopping Cart, Enquiry & Checkout pipelines, dynamic Category systems, and a comprehensive Admin Control Panel.

## Features

1. **B2B / B2C Dual Mode**:
   - **B2B (Wholesale) Mode**: Hides prices, enables "Request Quote" buttons, and redirects users to a detailed corporate inquiry form.
   - **B2C (Retail) Mode**: Displays product pricing, adds floating cart toggles, item addition drawer, and direct checkout routes.
2. **Dynamic Products & Categories**: Sourced directly from MongoDB with full active/inactive filter flags.
3. **CMS System**: Homepage sections, testimonials, FAQs, and legal policies are editable from the admin portal.
4. **Settings Manager**: Toggle landing mode default, logo strings, contact detail objects, and social links.
5. **Secure Authentication**: Admin dashboard views are protected behind JSON Web Token (JWT) credentials.

## Folder Structure

```
VedaGlobal/
├── client/                 # React SPA (Vite + CSS)
│   ├── src/
│   │   ├── api/            # Axios instance config
│   │   ├── components/     # ModeSwitch, CartDrawer, EnquiryForm, CheckoutForm
│   │   ├── context/        # ModeContext, CartContext
│   │   ├── pages/          # Products, ProductDetails, Cart, Checkout, AdminLogin, AdminDashboard
│   │   └── main.jsx
├── server/                 # Express REST API (NodeJS + Mongoose)
│   ├── config/             # DB connectivity details
│   ├── controllers/        # Product, category, order, enquiry, and CMS handlers
│   ├── models/             # Schema configuration files
│   ├── routes/             # API routing endpoints
│   ├── seed.js             # Seed script for initial setup
│   └── server.js
```

## Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/vedaglobal
JWT_SECRET=vedaglobalsecret123
DEFAULT_ADMIN_EMAIL=admin@vedaglobal.com
DEFAULT_ADMIN_PASSWORD=VedaGlobalPass123!
NODE_ENV=development
```

### Frontend (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

## Setup & Running Guide

### 1. Database Seeding
Ensure MongoDB is running locally on port 27017, then seed the system:
```bash
cd server
npm install
npm run seed
```
*Seeding creates: 10 agricultural products, 6 categories, 3 sample enquiries, 3 sample test orders, CMS entries, and the default admin user.*

### 2. Launch Backend Server
```bash
npm run dev
```
- **Backend URL**: `http://localhost:5000`
- **APIs root**: `http://localhost:5000/api`

### 3. Launch Frontend Client
```bash
cd ../client
npm install
npm run dev
```
- **Frontend URL**: `http://localhost:5173` (or active Vite localhost port)

## Credentials & Portals
- **Admin Login Route**: `/admin`
- **Default Admin Email**: `admin@vedaglobal.com`
- **Default Admin Password**: `VedaGlobalPass123!`
