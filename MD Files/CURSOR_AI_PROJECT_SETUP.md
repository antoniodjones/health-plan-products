# CURSOR AI PROJECT SETUP GUIDE
## Products & Benefits Platform

**Date:** November 3, 2025  
**Purpose:** Complete setup guide for Cursor AI development environment

---

## 📋 PREREQUISITES

Before you start, ensure you have:

- ✅ **Node.js 18.x or higher** (check: `node --version`)
- ✅ **npm 9.x or higher** (check: `npm --version`)
- ✅ **Git** (check: `git --version`)
- ✅ **Cursor AI** installed (download from cursor.sh)
- ✅ **PostgreSQL 15** installed (or Docker for database)
- ✅ **Google Cloud SDK** (for GCP services - optional for local dev)

---

## 🚀 QUICK START (5 Minutes)

### Step 1: Create Project Directory
```bash
# Create main project directory
mkdir products-benefits-platform
cd products-benefits-platform

# Initialize git repository
git init
```

### Step 2: Create Next.js Application
```bash
# Create Next.js app with TypeScript
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Answer the prompts:
# ✔ Would you like to use TypeScript? … Yes
# ✔ Would you like to use ESLint? … Yes
# ✔ Would you like to use Tailwind CSS? … Yes
# ✔ Would you like to use `src/` directory? … Yes
# ✔ Would you like to use App Router? … Yes
# ✔ Would you like to customize the default import alias? … Yes (@/*)
```

### Step 3: Install Additional Dependencies
```bash
# UI Components & Styling
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material @mui/x-data-grid
npm install recharts react-hook-form zod @hookform/resolvers
npm install react-dnd react-dnd-html5-backend
npm install date-fns lodash

# State Management & Data Fetching
npm install @tanstack/react-query axios zustand

# Database & Backend
npm install prisma @prisma/client
npm install bcrypt jsonwebtoken
npm install express cors helmet

# Dev Dependencies
npm install -D @types/node @types/react @types/lodash
npm install -D @types/bcrypt @types/jsonwebtoken
npm install -D prettier eslint-config-prettier
npm install -D prisma-erd-generator
```

### Step 4: Initialize Prisma (Database ORM)
```bash
npx prisma init
```

---

## 📁 PROJECT STRUCTURE

Create this folder structure:

```
products-benefits-platform/
├── .cursor/                    # Cursor AI rules & settings
│   ├── rules.md               # Cursor AI coding rules
│   └── prompts/               # Reusable prompts
├── .github/                    # GitHub workflows (CI/CD)
├── prisma/                     # Database schema & migrations
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts                # Seed data
├── public/                     # Static assets
│   ├── images/
│   └── icons/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (admin)/          # Admin Console routes
│   │   ├── (codes)/          # Code Management routes
│   │   ├── (products)/       # Product Design routes
│   │   ├── (rating)/         # Rating & Compliance routes
│   │   ├── (analytics)/      # Analytics routes
│   │   ├── api/              # API routes
│   │   │   ├── products/
│   │   │   ├── codes/
│   │   │   ├── mappings/
│   │   │   └── auth/
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Table.tsx
│   │   │   └── ...
│   │   ├── forms/           # Form components
│   │   ├── charts/          # Chart components
│   │   └── layouts/         # Layout components
│   ├── lib/                 # Utility libraries
│   │   ├── prisma.ts       # Prisma client
│   │   ├── auth.ts         # Authentication
│   │   ├── api-client.ts   # API client (axios)
│   │   └── utils.ts        # Helper functions
│   ├── hooks/              # Custom React hooks
│   │   ├── useProducts.ts
│   │   ├── useCodes.ts
│   │   └── useAuth.ts
│   ├── store/              # Zustand stores
│   │   ├── authStore.ts
│   │   └── appStore.ts
│   ├── types/              # TypeScript types
│   │   ├── product.ts
│   │   ├── code.ts
│   │   └── api.ts
│   └── styles/             # Global styles
│       └── globals.css
├── tests/                  # Test files
│   ├── unit/
│   └── integration/
├── docs/                   # Documentation
│   ├── api/
│   ├── architecture/
│   └── user-guides/
├── scripts/               # Build & deployment scripts
│   ├── setup-db.sh
│   └── deploy.sh
├── .env.local            # Local environment variables
├── .env.example          # Example environment variables
├── .gitignore
├── .prettierrc           # Prettier config
├── .eslintrc.json        # ESLint config
├── next.config.js        # Next.js config
├── tailwind.config.ts    # Tailwind config
├── tsconfig.json         # TypeScript config
├── package.json
└── README.md
```

---

## 🛠️ CONFIGURATION FILES

I'll create all the necessary configuration files for you in the next steps.

---

## 📝 CURSOR AI SPECIFIC SETUP

### Create .cursor Directory and Rules

This is CRITICAL for Cursor AI to understand your project!

```bash
mkdir -p .cursor/prompts
```

The rules file tells Cursor AI how to code in your project. I'll create this in the next step.

---

## 🗄️ DATABASE SETUP

### Option A: Local PostgreSQL
```bash
# Create database
createdb products_benefits_platform_dev

# Update .env.local with connection string
DATABASE_URL="postgresql://username:password@localhost:5432/products_benefits_platform_dev"
```

### Option B: Docker PostgreSQL
```bash
# Create docker-compose.yml (I'll provide this)
docker-compose up -d
```

---

## 🔐 ENVIRONMENT VARIABLES

Create `.env.local`:
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/products_benefits_platform_dev"

# API
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRES_IN="7d"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-change-this"

# GCP (for production)
GCP_PROJECT_ID="your-gcp-project-id"
GCP_SERVICE_ACCOUNT_KEY=""

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_AGENTS="false"
```

---

## 🎨 DESIGN SYSTEM SETUP

### Tailwind Configuration
We'll extend Tailwind with your brand colors and custom utilities.

### Material-UI Theme
We'll create a custom MUI theme matching your brand.

---

## 🚀 RUNNING THE PROJECT

### Development Mode
```bash
# Start Next.js dev server
npm run dev

# In another terminal: Start Prisma Studio (database GUI)
npx prisma studio
```

### Build for Production
```bash
npm run build
npm start
```

---

## 🧪 TESTING SETUP

```bash
# Install testing libraries
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event
npm install -D jest-environment-jsdom
```

---

## 📚 DOCUMENTATION STRUCTURE

```
docs/
├── getting-started.md
├── architecture/
│   ├── system-overview.md
│   ├── database-schema.md
│   └── api-reference.md
├── development/
│   ├── coding-standards.md
│   ├── component-guide.md
│   └── testing-guide.md
└── deployment/
    ├── local-setup.md
    ├── staging.md
    └── production.md
```

---

## 🤖 CURSOR AI USAGE TIPS

### 1. Use Composer (CMD+I / CTRL+I)
- Best for creating new features
- Can generate multiple files at once
- Example: "Create a Product List component with filtering"

### 2. Use Chat (CMD+K / CTRL+K)
- Best for understanding code
- Ask questions about your codebase
- Example: "Explain the product creation workflow"

### 3. Use @ References
- `@docs` - Reference documentation
- `@codebase` - Reference your entire codebase
- `@file` - Reference specific files
- Example: "@codebase how do I add a new product field?"

### 4. Create Reusable Prompts
Store common prompts in `.cursor/prompts/`:
- `create-component.md` - Template for React components
- `create-api-route.md` - Template for API routes
- `create-database-model.md` - Template for Prisma models

---

## 📦 NEXT STEPS

After setup completes, you'll:

1. ✅ Review and customize configuration files
2. ✅ Run database migrations
3. ✅ Create your first components
4. ✅ Set up authentication
5. ✅ Start building features (Code Management Studio first)

---

## 🎯 READY TO BUILD?

I'll now create all the configuration files you need. Tell me when you're ready and I'll generate:

1. ✅ `.cursor/rules.md` (Cursor AI coding rules)
2. ✅ `prisma/schema.prisma` (Database schema)
3. ✅ `.env.example` (Environment variables template)
4. ✅ `docker-compose.yml` (Docker setup)
5. ✅ `tailwind.config.ts` (Tailwind customization)
6. ✅ `src/lib/prisma.ts` (Prisma client)
7. ✅ `src/components/ui/Button.tsx` (Example component)
8. ✅ Package.json scripts
9. ✅ Next.js configuration
10. ✅ README.md (Project overview)

**Should I create all these files now?** 🚀
