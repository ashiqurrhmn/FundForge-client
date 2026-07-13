<div align="center">

# 🚀 FundForge

### Empowering Innovations. Funding the Future.

A **production-grade** crowdfunding platform with multi-role authentication, Stripe-powered contributions, role-specific dashboards, and a sleek dark-mode UI.

&nbsp;

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Native-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-Auth-FF5E00?style=for-the-badge)](https://www.better-auth.com/)
[![HeroUI](https://img.shields.io/badge/HeroUI-Components-7C3AED?style=for-the-badge)](https://heroui.com/)

&nbsp;

🌍 [**Live Demo**](https://fund-forge-client.vercel.app/) &nbsp;·&nbsp; 📦 [**Client Repo**](https://github.com/ashiqurrhmn/FundForge-client) &nbsp;·&nbsp; 🔌 [**Server Repo**](https://github.com/ashiqurrhmn/FundForge-server)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Why FundForge Stands Out](#-why-fundforge-stands-out)
- [Demo Accounts](#-demo-accounts)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Author](#-author)

---

## 🎯 Overview

**FundForge** is a fully-featured crowdfunding ecosystem connecting **Supporters**, **Creators**, and **Platform Admins** through a modern, responsive web experience. Built with Next.js 16's App Router and React Server Components on the frontend, backed by an Express 5 REST API and MongoDB, it delivers a complete fundraising ecosystem — from discovering creative projects to processing Stripe payments and managing platform health.

---

## ✨ Why FundForge Stands Out

| | Feature | Description |
|---|---|---|
| 💳 | **Stripe Integration** | Securely buy credits and fund campaigns seamlessly through Stripe Checkout |
| 🔐 | **Better Auth Integration** | Seamless email/password and Google social auth with MongoDB adapter, and session management |
| 👥 | **Multi-Role RBAC** | Three distinct roles — Supporter, Creator, Admin — each with isolated dashboards and capabilities |
| 📊 | **Analytics Dashboards** | Interactive Recharts visualizations: funding trends, campaign performance, and platform stats |
| 🏢 | **Campaign Approval Workflow** | Creators submit campaigns → Admin reviews & approves → Campaigns go live for funding |
| 🎨 | **Dark-Mode Glassmorphism UI** | Premium dark aesthetic with ambient glows, gradient accents, and Framer Motion micro-animations |
| ⚡ | **React Compiler + RSC** | Next.js 16 with React 19, React Compiler enabled, and Server Components for blazing-fast page loads |
| 🔍 | **Smart Campaign Discovery** | Filter campaigns by category, search by keywords, and sort by funding goal or deadline |

---

## 🔑 Demo Accounts

Experience the platform from different perspectives using these test accounts:

**🧑💼 Supporter**
- **Email:** `user@gmail.com`
- **Password:** `12345Asdf`

**🎨 Creator**
- **Email:** `micro@gmail.com`
- **Password:** `12345Asdf`

**🛡️ Admin**
- **Email:** `admin@gmail.com`
- **Password:** `12345Asdf`

---

## 🔧 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **Next.js 16 & React 19** | App Router, Server Components, API Routes |
| **Tailwind CSS v4** | Utility-first responsive styling |
| **HeroUI 3.x** | Accessible, beautiful component library |
| **Framer Motion 12.x** | Page transitions, hover effects, micro-animations |
| **Better Auth 1.6+** | Authentication with MongoDB adapter |
| **Recharts 3.x** | Interactive data visualization for dashboards |
| **Stripe.js 9.x** | Client-side Stripe Checkout integration |
| **Swiper 14.x** | Smooth touch-enabled testimonial sliders |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | High-performance REST API server |
| **MongoDB 7.x** | NoSQL database via native driver |
| **Stripe SDK** | Server-side payment processing |
| **CORS + Dotenv** | Middleware and environment configuration |

---

## 🔑 Key Features

### 🔒 Authentication & Authorization
- Email/password registration and Google Sign-in via **Better Auth**
- Role selection at signup: **Supporter** or **Creator**
- Secure session handling with MongoDB-backed persistence
- Route protection with role-based redirects and middleware

### 🔍 Campaign Discovery
- Full-text search by **keyword** and dynamic **category filtering**
- Visually stunning Bento-grid layouts for campaign display
- Dedicated campaign detail pages showing funding progress, deadlines, and creator info
- Smooth scroll animations using Framer Motion

### 💳 Funding & Payments
- Supporter wallet system using Platform Credits (Cr)
- Secure credit purchases via Stripe Checkout sessions
- One-click contribution to live campaigns
- Automated campaign progress updates upon successful funding

### 📊 Role-Specific Dashboards

**🧑💼 Supporter Dashboard**
- Contribution history with status tracking
- Wallet credit balance management
- Payment history via Stripe
- Discovery recommendations based on top categories

**🎨 Creator Dashboard**
- Full CRUD for campaign creation and management
- Track total funds raised and pending contributions
- Analytics: campaign views, funding over time, and backer metrics
- Withdrawal management for successful campaigns

**🛡️ Admin Dashboard**
- Platform-wide statistics: total users, active campaigns, total funds raised
- Campaign moderation workflow (Approve/Reject)
- User management and role oversight
- Payment and withdrawal oversight

---

## 📁 Project Structure

```
FundForge-client/
├── src/
│   ├── app/
│   │   ├── (dashboard)/        # Role-based dashboards (Admin, Creator, Supporter)
│   │   ├── api/                # Next.js API routes (Auth, Stripe)
│   │   ├── explore/            # Campaign discovery catalog
│   │   ├── login/              # Authentication pages
│   │   ├── signup/             
│   │   ├── unauthorized/       # 403 redirect page
│   │   ├── layout.tsx          # Root layout with providers
│   │   └── page.tsx            # Animated Landing page
│   ├── components/             # Reusable UI (HeroUI, Framer Motion)
│   │   ├── categories-section.tsx
│   │   ├── featured-campaigns.tsx
│   │   └── testimonial-section.tsx
│   └── lib/                    # Utilities, Auth Config, Fetch Helpers
├── public/                     # Static assets
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ (v22 recommended)
- **MongoDB** cluster ([MongoDB Atlas](https://www.mongodb.com/atlas) recommended)
- **Stripe Account** with API keys ([stripe.com](https://stripe.com))

### Installation

```bash
# ── 1. Clone both repositories ──────────────────────────────

git clone https://github.com/ashiqurrhmn/FundForge-client.git
git clone https://github.com/ashiqurrhmn/FundForge-server.git

# ── 2. Set up the Backend ───────────────────────────────────

cd FundForge-server
npm install

# Create .env file with your MongoDB & Stripe secrets
npm start
# → Server runs on http://localhost:5000

# ── 3. Set up the Frontend ──────────────────────────────────

cd ../FundForge-client
npm install

# Create .env file with your Better Auth, NEXT_PUBLIC_API_URL, & Stripe keys
npm run dev
# → Frontend runs on http://localhost:3000
```

---

## 👤 Author

<div align="center">

**Built with 🔥 by [Md. Ashiqur Rahman](https://ashiqur-portfolio0.vercel.app/)**

&nbsp;

[![Portfolio](https://img.shields.io/badge/Portfolio-ashiqur--portfolio0.vercel.app-00D4AA?style=for-the-badge&logo=vercel&logoColor=white)](https://ashiqur-portfolio0.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-@ashiqurrhmn-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ashiqurrhmn)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ashiqur_Rahman-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ashiqur-rahman00/)
[![Email](https://img.shields.io/badge/Email-ashiqur1312@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:ashiqur1312@gmail.com)

</div>

---

<div align="center">

### ⭐ If you found this helpful, give it a star!

**Built with ❤️ using Next.js 16, Express 5, MongoDB, and Stripe**

&nbsp;

[![Star Client](https://img.shields.io/github/stars/ashiqurrhmn/FundForge-client?style=social&label=Star%20Client)](https://github.com/ashiqurrhmn/FundForge-client)
[![Star Server](https://img.shields.io/github/stars/ashiqurrhmn/FundForge-server?style=social&label=Star%20Server)](https://github.com/ashiqurrhmn/FundForge-server)

&nbsp;

<sub>© 2026 FundForge. All rights reserved.</sub>

</div>
