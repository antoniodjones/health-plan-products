# Setup Instructions

## ✅ What's Been Completed

Your Products & Benefits Platform foundation is now fully set up:

1. **✅ Project Structure** - Complete Next.js 14 with TypeScript, Tailwind, App Router
2. **✅ Package.json** - 40+ dependencies installed (React Query, MUI, Prisma, Zod, etc.)
3. **✅ Database Schema** - 20+ models covering all 12 epics
4. **✅ Docker Configuration** - PostgreSQL 15 + Redis 7
5. **✅ Environment Setup** - `env.example` with all variables
6. **✅ Cursor AI Rules** - Complete coding standards in `.cursor/rules.md`
7. **✅ Documentation** - Comprehensive README.md
8. **✅ TypeScript Config** - Strict mode enabled
9. **✅ Prisma Client** - Generated and ready to use

---

## 🚀 Next Steps to Get Running

### Step 1: Start Docker Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Verify services are running
docker-compose ps
```

Expected output:
```
NAME                          STATUS
products-benefits-postgres    Up
products-benefits-redis       Up
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp env.example .env.local
```

**Edit `.env.local`** with your values:
- Database URL is already set for local Docker
- Add AI API keys if using AI-driven features:
  - `GOOGLE_AI_API_KEY` (for Gemini Pro)
  - `OPENAI_API_KEY` (for GPT-4)

### Step 3: Initialize Database

```bash
# Push schema to database
npx prisma db push

# Seed with sample data (optional but recommended)
npm run db:seed
```

Expected output:
```
✅ Database schema pushed
✅ Prisma Client generated
🌱 Seeding database...
✅ Created organization: Sample Health Plan
✅ Created users: admin@samplehealthplan.com pm@samplehealthplan.com
✅ Created 5 benefit segments
✅ Created 3 code sets
✅ Created sample product: Gold PPO 2026 - California
✅ Created sample plan: Gold PPO - Los Angeles
✅ Created benefit package: Gold PPO Medical Benefits
🎉 Seeding completed!
```

### Step 4: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You should see the landing page with three product creation modalities!

---

## 🎓 Test Credentials (After Seeding)

- **Admin User**
  - Email: `admin@samplehealthplan.com`
  - Password: `password123`

- **Product Manager**
  - Email: `pm@samplehealthplan.com`
  - Password: `password123`

---

## 🛠️ Useful Commands

### Development
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript types
npm run format           # Format code with Prettier
```

### Database
```bash
npx prisma studio        # Open visual database editor
npx prisma db push       # Push schema changes
npx prisma generate      # Regenerate Prisma Client
npm run db:seed          # Seed sample data
```

### Docker
```bash
docker-compose up -d     # Start services
docker-compose down      # Stop services
docker-compose logs -f   # View logs
docker-compose ps        # Check status
```

---

## 📊 Verify Installation

### Check 1: Docker Services Running
```bash
docker-compose ps
```
Both PostgreSQL and Redis should show "Up"

### Check 2: Database Connection
```bash
npx prisma studio
```
Should open visual database editor at http://localhost:5555

### Check 3: Application Running
```bash
npm run dev
```
Should start without errors and be accessible at http://localhost:3000

### Check 4: TypeScript Compilation
```bash
npm run type-check
```
Should complete without errors

---

## 🎯 What to Build First

Based on your documentation, here's the recommended order:

### Week 1: Product Catalog Foundation (Epic 6)

**Goal**: Build product CRUD operations

1. **Product List Page**
   ```
   Create src/app/(dashboard)/products/page.tsx
   - Display products in MUI DataGrid
   - Filter by LOB, status, effectiveDate
   - Search by name
   ```

2. **Product API Routes**
   ```
   Create src/app/api/products/route.ts
   - GET /api/products (list with filters)
   - POST /api/products (create new)
   ```

3. **Product Detail Page**
   ```
   Create src/app/(dashboard)/products/[id]/page.tsx
   - Show product details
   - List plans under product
   - Action buttons (edit, duplicate, archive)
   ```

### Week 2: Product Creation Wizard (Epic 7)

**Goal**: Implement guided product creation

1. **Wizard Flow Engine**
   ```
   Create src/components/features/product-wizard/
   - Multi-step form (10 steps)
   - Progress indicator
   - Save draft functionality
   ```

2. **Wizard Steps**
   - Step 1: Plan Basics
   - Step 2: Coverage & Network
   - Step 3: Medical Benefits
   - Step 4: Cost Sharing
   - ... continue through all 10 steps

### Week 3: Visual Benefit Builder (Epic 7)

**Goal**: Drag-and-drop benefit configuration

1. **Visual Canvas**
   ```
   Create src/components/features/visual-builder/
   - Drag-drop interface (react-beautiful-dnd)
   - Component library sidebar
   - Real-time cost calculation
   ```

### Week 4+: AI-Driven Creation (Epic 7 - Critical Feature)

**Goal**: Natural language product creation

1. **AI Chat Interface**
   ```
   Create src/components/features/ai-creator/
   - Conversational UI
   - Intent parsing
   - Agent orchestration
   ```

2. **AI Product Agent**
   ```
   Create src/services/ai/product-agent.ts
   - Integrate with Gemini Pro or GPT-4
   - Parse user requirements
   - Generate product configuration
   ```

---

## 🤖 Using Cursor AI to Build Features

### Example Prompt for Product List Page

```
Create a Product List page at src/app/(dashboard)/products/page.tsx that:

1. Uses React Server Components
2. Fetches products from database via Prisma
3. Displays in MUI DataGrid with columns:
   - Product ID
   - Name
   - Line of Business
   - Status
   - Effective Date
4. Includes filters for:
   - Line of Business (dropdown)
   - Status (dropdown)
   - Search by name (text input)
5. Links to product detail page on row click
6. "Create Product" button in top-right
7. Uses TypeScript with proper types
8. Follows coding standards in .cursor/rules.md
9. Uses Tailwind for spacing/layout
10. Handles loading and error states

Also create:
- API route at src/app/api/products/route.ts
- Type definitions in src/types/product.ts
```

Cursor AI will generate complete, working code following your coding standards!

---

## 🐛 Troubleshooting

### Issue: Docker services won't start
```bash
# Check if ports are already in use
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Kill conflicting processes or change ports in docker-compose.yml
```

### Issue: Database connection error
```bash
# Verify PostgreSQL is running
docker-compose ps

# Check logs
docker-compose logs postgres

# Restart services
docker-compose restart
```

### Issue: Prisma client errors
```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
npx prisma db push
npm run db:seed
```

### Issue: TypeScript errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Additional Resources

- **Project Documentation**: Check `MD Files/` folder for detailed planning docs
- **Coding Standards**: `.cursor/rules.md`
- **Database Schema**: `prisma/schema.prisma`
- **Architecture Vision**: `MD Files/Products_Benefits_Platform_Vision_Strategy_Roadmap.md`
- **Epic Analysis**: `MD Files/Products_Benefits_Platform_Complete_Epic_Analysis.md`

---

## ✨ You're Ready to Build!

Everything is configured and ready. Start with the Product List page and work your way through the features systematically.

**Remember**: Ask Cursor AI for help! Reference `@codebase` and `.cursor/rules.md` to get context-aware code generation.

Good luck building the future of healthcare benefits! 🚀

