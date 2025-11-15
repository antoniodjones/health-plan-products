# Products & Benefits Platform 🏥

AI-Powered Health Plan Product Configuration and Benefits Management System

---

## 📋 Overview

Complete platform for health insurance companies to design, configure, rate, and publish health benefit plans with AI-powered optimization and automated compliance validation.

**Tech Stack:**
- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, Material-UI
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL 15
- **Deployment:** Google Cloud Platform (Cloud Run, Cloud SQL)
- **Development:** Cursor AI optimized

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 18+ and npm 9+
- Docker Desktop (for database)
- Cursor AI editor (recommended)

### Setup
```bash
# 1. Clone or create project directory
mkdir products-benefits-platform
cd products-benefits-platform

# 2. Initialize Next.js project
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 3. Copy configuration files from this setup into your project:
# - Copy .cursor/rules.md
# - Copy prisma/schema.prisma
# - Copy .env.example
# - Copy docker-compose.yml
# - Copy package.json (merge with existing)

# 4. Install dependencies
npm install

# 5. Copy environment variables
cp .env.example .env.local

# 6. Start Docker services (PostgreSQL + Redis)
docker-compose up -d

# 7. Wait 5 seconds for database to initialize
sleep 5

# 8. Push database schema
npx prisma db push

# 9. Generate Prisma Client
npx prisma generate

# 10. Start development server
npm run dev
```

**Open:** http://localhost:3000

---

## 📁 Project Structure

```
products-benefits-platform/
├── .cursor/                    # Cursor AI configuration
│   └── rules.md               # Coding standards for Cursor AI
├── prisma/
│   ├── schema.prisma          # Database schema (12 epics)
│   ├── migrations/            # Database migrations
│   └── seed.ts                # Seed data (create this)
├── public/                     # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (admin)/          # Platform Admin Console
│   │   ├── (codes)/          # Code Management Studio
│   │   ├── (products)/       # Product Design Studio
│   │   ├── (rating)/         # Rating & Compliance Workbench
│   │   ├── (analytics)/      # Publishing & Analytics
│   │   ├── api/              # API routes
│   │   │   ├── products/     # Product CRUD
│   │   │   ├── codes/        # Code management
│   │   │   ├── mappings/     # Code-to-benefit mappings
│   │   │   └── auth/         # Authentication
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   ├── ui/              # Generic components
│   │   ├── products/        # Product components
│   │   ├── codes/           # Code components
│   │   └── shared/          # Shared components
│   ├── lib/                 # Utilities
│   │   ├── prisma.ts       # Prisma client
│   │   ├── auth.ts         # Authentication
│   │   └── api-client.ts   # Axios client
│   ├── hooks/              # Custom hooks
│   ├── store/              # Zustand stores
│   ├── types/              # TypeScript types
│   └── styles/             # Global styles
├── .env.local              # Environment variables (create from .env.example)
├── .env.example            # Environment template
├── docker-compose.yml      # Docker services
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🗄️ Database

### Local Development (Docker)
```bash
# Start PostgreSQL + Redis
docker-compose up -d

# View logs
docker-compose logs -f postgres

# Stop services
docker-compose down

# Reset database
docker-compose down -v  # Removes volumes
```

### Prisma Commands
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Create migration (production)
npx prisma migrate dev --name init

# Deploy migrations (production)
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed database
npm run db:seed

# Generate ERD diagram
npm run db:erd
```

### Database Schema Overview
The schema includes models for all 12 epics:

**Epic 1-5: Code Management**
- `CodeSet`, `Code`, `CustomCode`, `CodeMapping`

**Epic 6-8: Product Management**
- `Product`, `Plan`, `BenefitPackage`, `BenefitDetail`

**Epic 9: Rating & Pricing**
- `RatingConfiguration`, `AgeCurve`, `AreaFactor`

**Epic 10: Compliance**
- (Rules stored in code, validation results in audit log)

**Epic 11: Publishing**
- `Publication`

**Epic 12: Analytics**
- `ProductMetric`

**Foundation:**
- `User` (authentication & authorization)

---

## 🧑‍💻 Development

### Running the App
```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build
npm start

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
```

### Creating New Features
1. **Define database model** in `prisma/schema.prisma`
2. **Run migration:** `npx prisma db push`
3. **Create API route** in `src/app/api/[feature]/route.ts`
4. **Create types** in `src/types/[feature].ts`
5. **Create hooks** in `src/hooks/use[Feature].ts`
6. **Create components** in `src/components/[feature]/`
7. **Create page** in `src/app/([module])/[feature]/page.tsx`

### Using Cursor AI

**Cursor AI is configured** with coding rules in `.cursor/rules.md`

**Best Practices:**
1. Use **Composer (CMD+I)** to create new features
   - Example: "Create a ProductList component with filtering and sorting"

2. Use **Chat (CMD+K)** to understand code
   - Example: "@codebase explain the product creation workflow"

3. **Reference documentation:**
   - `@docs` - Reference documentation
   - `@codebase` - Your entire codebase
   - `@file` - Specific files

4. **Example prompts:**
   - "Create a product detail page that shows product info, plans, and benefits"
   - "Add a filter sidebar to the code library with code type and category filters"
   - "Create an API route to calculate premium based on age, geography, and tobacco use"

---

## 🎨 UI Components

### Component Library Structure
```
src/components/
├── ui/                    # Generic UI (atoms)
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Table.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   └── Modal.tsx
├── forms/                # Form components
│   ├── ProductForm.tsx
│   ├── CodeMappingForm.tsx
│   └── RatingForm.tsx
├── charts/              # Data visualization
│   ├── LineChart.tsx
│   ├── BarChart.tsx
│   └── PieChart.tsx
├── products/            # Product domain
│   ├── ProductCard.tsx
│   ├── ProductList.tsx
│   ├── ProductDetail.tsx
│   └── BenefitDesigner.tsx
└── codes/              # Code domain
    ├── CodeLibrary.tsx
    ├── CodeSearch.tsx
    └── CodeMappingTable.tsx
```

### Creating a New Component
```typescript
// src/components/ui/Button.tsx
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded font-medium',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        className
      )}
      {...props}
    />
  );
}
```

---

## 🧪 Testing

### Setup
```bash
# Install testing dependencies (already in package.json)
npm install -D jest @testing-library/react @testing-library/jest-dom
```

### Running Tests
```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Example Test
```typescript
// src/components/ui/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 🚀 Deployment

### Google Cloud Platform Setup

```bash
# 1. Install Google Cloud SDK
# https://cloud.google.com/sdk/docs/install

# 2. Authenticate
gcloud auth login

# 3. Set project
gcloud config set project YOUR_PROJECT_ID

# 4. Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable cloudapis.googleapis.com

# 5. Create Cloud SQL instance
gcloud sql instances create products-benefits-db \
  --database-version=POSTGRES_15 \
  --tier=db-n1-standard-2 \
  --region=us-central1

# 6. Create database
gcloud sql databases create products_benefits_platform_prod \
  --instance=products-benefits-db

# 7. Build and deploy to Cloud Run
gcloud run deploy products-benefits-platform \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 📚 Documentation

- **[API Documentation](./docs/api/)** - API endpoints and usage
- **[Architecture](./docs/architecture/)** - System design and architecture
- **[User Guides](./docs/user-guides/)** - End-user documentation
- **[Development Guide](./docs/development/)** - Development best practices

---

## 📦 Epic Development Order

### Phase 1: Foundation (Epics 1-5) - 29 weeks
✅ **Epic 1:** Code Set Data Management (COMPLETE)
⚠️ **Epic 2:** Code-to-Benefit Mapping
⚠️ **Epic 3:** Mapping Validation & Testing
⚠️ **Epic 4:** Code Set Management UI
⚠️ **Epic 5:** Custom Code Management

### Phase 2: Product Management (Epics 6-8) - 17.5 weeks
❌ **Epic 6:** Product Catalog & Management (CRITICAL - BUILD FIRST!)
❌ **Epic 7:** Benefit Design Studio
❌ **Epic 8:** Product Templates & Accelerators

### Phase 3: Rating (Epic 9) - 7 weeks
❌ **Epic 9:** Rating & Pricing Engine

### Phase 4: Compliance (Epic 10) - 6.5 weeks
❌ **Epic 10:** Regulatory Compliance & Validation

### Phase 5: Publishing & Analytics (Epics 11-12) - 12 weeks
❌ **Epic 11:** Product Publishing & Distribution
❌ **Epic 12:** Performance Analytics & Optimization

---

## 🛠️ Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps

# View database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres

# Reset database (⚠️ loses data)
docker-compose down -v
docker-compose up -d
```

### Prisma Issues
```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database
npx prisma migrate reset

# Format schema
npx prisma format
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)
```

---

## 🤝 Contributing

### Coding Standards
- Follow `.cursor/rules.md` for all code
- Use TypeScript strictly (no `any`)
- Write tests for business logic
- Format code with Prettier
- Lint with ESLint

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/epic-6-product-catalog

# Make changes, commit often
git add .
git commit -m "feat: add product creation form"

# Push and create PR
git push origin feature/epic-6-product-catalog
```

---

## 📞 Support

- **Documentation:** [./docs](./docs)
- **Issues:** GitHub Issues
- **Email:** support@example.com

---

## 📄 License

UNLICENSED - Private/Proprietary

---

## 🎯 Next Steps

After setup:

1. ✅ Review `.cursor/rules.md` (coding standards)
2. ✅ Review `prisma/schema.prisma` (database design)
3. ✅ Create seed data (`prisma/seed.ts`)
4. ✅ Build first component (Product List)
5. ✅ Create first API route (`/api/products`)
6. ✅ Start Epic 6 (Product Catalog) - THE CRITICAL PATH!

**Happy coding! 🚀**

---

**Created with:** Cursor AI + Next.js 14 + Prisma + PostgreSQL + TypeScript
