# 🛍️ NexusStore - Full-Stack E-Commerce Web Application

A production-ready full-stack e-commerce web application with a React frontend, Node.js & Express RESTful API, MongoDB Atlas integration (with Mongoose), and deployment configuration for **Render** (Backend) and **Vercel** (Frontend).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons, React Router v7 |
| **Backend** | Node.js, Express.js, Mongoose, JWT, bcryptjs, CORS |
| **Database** | MongoDB Atlas Cluster (`mongodb+srv://...`) with seamless local JSON fallback |
| **Cloud Hosting** | **Render** (Backend API Web Service) & **Vercel** (Frontend Client) |

---

## 🌟 Key Features

### 👤 Customer Experience
- **Authentication & Security:** Secure user registration, login, and JWT-authenticated session management with bcrypt-hashed passwords.
- **Dynamic Catalog:** Browse products across multiple categories (Electronics, Audio, Wearables, Workspace, Fashion) with live search and price filtering.
- **Rich Product Details:** High-resolution image galleries, technical specification tables, verified customer reviews, and interactive star ratings.
- **Smart Shopping Cart:** Quantity controls, persistent cart retention in local storage, free shipping progress indicator, and promotional coupon code support (`SAVE10`).
- **Streamlined Checkout:** Fast 3-step checkout with delivery address capture and payment options (Credit Card simulation, PayPal, Cash on Delivery).
- **Order Tracking:** Real-time visual fulfillment stepper (Order Placed ➔ Confirmed ➔ Shipped ➔ Delivered), tracking numbers, order timeline history, and order cancellation.

### 🛡️ Administrator Operations Console
- **Visual Analytics Dashboard:** Live metrics for gross revenue, average order value (AOV), 7-day revenue trend bar charts with hover tooltips, category revenue distribution, top-selling product leaderboard, and low-stock alerts.
- **Category Management:** Full CRUD (Create, Read, Update, Delete) for store categories with icon pickers and safety guards.
- **Inventory Management:** Full CRUD for catalog products with stock tracking and category assignments.
- **Order Fulfillment:** Filter customer orders by status and advance fulfillment stages (Processing ➔ Shipped ➔ Delivered) with custom dispatch notes.
- **User Management:** View registered customer accounts and toggle administrator privileges.

---

## 🔑 Demo Login Accounts

Quick 1-click login buttons are provided directly on the **Sign In** page.

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Administrator** | `admin@eshop.com` | `admin123` | Full access to Admin Dashboard, Product Inventory CRUD, and Order Status Updates |
| **Customer** | `user@eshop.com` | `user123` | Product browsing, Cart, Checkout, and Order Tracking |

---

## 🚀 Deployment Guide (Render + Vercel)

### Step 1: MongoDB Atlas IP Access (Crucial)
1. Go to your [MongoDB Atlas Dashboard](https://cloud.mongodb.com/).
2. In the left navigation, click **Network Access** under Security.
3. Click **Add IP Address** -> select **Allow Access from Anywhere** (`0.0.0.0/0`) -> click **Confirm**.
   *(This ensures Render cloud instances can connect to your database cluster).*

---

### Step 2: Deploy Backend to Render

1. Push your repository to GitHub.
2. Log into [Render](https://render.com/) and click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Fill in the following settings:
   - **Name:** `ecommerce-api`
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. In **Environment Variables**, add:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `super_secret_jwt_key_eshop_2026_dev`
   - `MONGODB_URI`: `mongodb+srv://krishnaganeshreddydarpally_db_user:2mtZTAMBjmon0LFF@cluster0.ybpzgyx.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0`
6. Click **Deploy Web Service**.
7. Once deployed, copy your Render public URL (e.g., `https://ecommerce-api-xxxx.onrender.com`).
   - Test it by visiting `https://ecommerce-api-xxxx.onrender.com/api/health` in your browser.

---

### Step 3: Deploy Frontend to Vercel

1. Log into [Vercel](https://vercel.com/) and click **Add New...** -> **Project**.
2. Import your GitHub repository.
3. Configure the project:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click **Edit** and choose `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: Paste your Render backend URL (e.g., `https://ecommerce-api-xxxx.onrender.com`)
5. Click **Deploy**.
6. Vercel will build and assign you a live domain (e.g., `https://ecommerce-client-xxxx.vercel.app`).

Your full-stack e-commerce store is now completely live!
