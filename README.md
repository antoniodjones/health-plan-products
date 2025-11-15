# Products & Benefits Platform

> **AI-Native Products & Benefits Platform for Healthcare Payers**

Transform healthcare affordability by creating the world's first AI-native platform that designs cost-reducing benefits, proves ROI with data, and delivers consumer-grade shopping experiences for health insurance.

---

## 🎯 Project Vision

**Manual First, AI Last** - Build manual workflows so AI agents can **learn, replicate, and take over** when necessary, with users retaining full control.

This platform enables health insurance companies to:
- **Design better benefits faster** - From 18 months to 2 weeks
- **Reduce healthcare costs** - $250-400 PMPM through intelligent design
- **Personalize at scale** - Tailored benefit packages for every segment
- **Prove value with data** - ROI attribution for benefit decisions
- **Maintain control** - Users can always override AI and build manually

---

## ✨ Key Features

### Development Philosophy: Build → Learn → Automate

```
Phase 1: MANUAL WORKFLOWS (Weeks 1-4)
  └─ Users build products manually
  └─ AI learns from every configuration
  
Phase 2: GUIDED WIZARDS (Weeks 5-6)
  └─ Step-by-step with smart defaults
  └─ AI suggests, users approve
  
Phase 3: VISUAL BUILDER (Weeks 7-8)
  └─ Drag-drop for power users
  └─ AI learns complex patterns
  
Phase 4: AI-DRIVEN (Weeks 11-12)
  └─ Conversational product creation
  └─ AI autonomous, users oversight
```

### Three Product Creation Modalities (Built in Order)

1. **🖐️ Manual Forms** (Week 1-4) - **START HERE**
   - Complete control, form by form
   - AI learns from every decision
   - Foundation for all other modes

2. **🧙 Guided Wizard** (Week 5-6)
   - 10-step guided flow
   - Smart defaults from AI learning
   - Perfect for common products

3. **🎨 Visual Builder** (Week 7-8)
   - Drag-drop benefit components
   - Real-time cost calculation
   - Power users and complex products

4. **🤖 AI-Driven** (Week 11-12) - **LAST**
   - Natural language → complete product
   - AI learned from 8 weeks of manual data
   - Users can modify and override

---

## 🎨 Design System: Apple-Inspired

**Philosophy**: Sleek, elegant, modern, simple

### Visual Characteristics
- **Clean & Minimal** - Remove everything unnecessary
- **Apple Blue** - `#007AFF` (light) / `#0A84FF` (dark)
- **SF Pro Font** - System fonts for native feel
- **Generous Spacing** - 8px base, lots of whitespace
- **Subtle Shadows** - Depth without clutter
- **Smooth Animations** - 300ms ease transitions
- **Glass Effects** - Frosted glass backgrounds

### Component Library
- **shadcn/ui** - Built on Radix UI primitives
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Consistent iconography

---

## 🏗️ Architecture

### Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 14 (App Router), React 18 | Server components, streaming |
| **UI** | shadcn/ui + Radix UI | Accessible, customizable |
| **Styling** | Tailwind CSS | Apple-inspired design tokens |
| **State** | Zustand (global), React Query (server) | Simple, performant |
| **Backend** | Next.js API Routes | Serverless, co-located |
| **Database** | PostgreSQL 15, Prisma ORM | Type-safe, relational |
| **Cache** | Redis 7 | Session, real-time features |
| **AI/ML** | Google Gemini Pro | Cost-effective, powerful |
| **Cloud** | GCP Free Tier (dev/staging) | $0/month dev costs |
| **Auth** | NextAuth.js | Flexible, secure |

### Database Schema

**20+ models** across 5 phases:
- **Phase 1**: Code Management (CodeSet, CodeMapping, BenefitSegment)
- **Phase 2**: Product Catalog (Product, Plan, BenefitPackage) ⭐
- **Phase 3**: Rating (RatingConfiguration)
- **Phase 4**: Compliance (ComplianceRule, ComplianceValidation)
- **Phase 5**: Publishing (Publication, ProductMetrics)

### GCP Free Tier (Dev/Staging)
- **Cloud SQL**: db-f1-micro (shared core, 10GB)
- **Cloud Run**: 512MB, scale to zero
- **Cloud Storage**: 5GB free
- **Total Cost**: $0/month

### GCP Paid (Production)
- **Cloud SQL**: db-custom-2-7680 (2 vCPU, 7.5GB RAM, HA)
- **Cloud Run**: 2GB, min-instances=1
- **Total Cost**: ~$185/month

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Docker Desktop
- Git
- Code Editor (VSCode + Cursor AI recommended)

### Installation (5 minutes)

```bash
# 1. Clone repository
git clone <your-repo-url>
cd health-plan-products

# 2. Install dependencies
npm install

# 3. Setup environment
cp env.example .env.local
# Edit .env.local if needed (defaults work locally)

# 4. Start Docker services
docker-compose up -d

# 5. Initialize database
npx prisma db push
npm run db:seed

# 6. Start development server
npm run dev
```

Open **http://localhost:3000** 🎉

---

## 📂 Project Structure

```
health-plan-products/
├── .cursor/                 # Cursor AI configuration
│   └── rules.md            # Coding standards
├── prisma/                 # Database
│   ├── schema.prisma       # 20+ models
│   └── seed.ts            # Sample data
├── src/
│   ├── app/               # Next.js pages & API
│   ├── components/        
│   │   └── ui/            # shadcn/ui components
│   ├── lib/               # Utilities & Prisma
│   ├── types/             # TypeScript types
│   ├── hooks/             # React hooks
│   └── services/          # Business logic
├── MD Files/              # Planning docs
├── components.json        # shadcn/ui config
├── docker-compose.yml     # PostgreSQL + Redis
└── README.md             # This file
```

---

## 🛠️ Development Workflow

### Week 1: Product List Page (Start Here!)

**Goal**: Build product CRUD with Apple-inspired design

```bash
# Ask Cursor AI:
"Create src/app/(dashboard)/products/page.tsx with:
- shadcn/ui Table component
- Apple-inspired design (clean, minimal, spacious)
- Filters: LOB, status, state
- Search functionality
- Apple blue 'Create Product' button
- Follow @.cursor/rules.md standards"
```

Cursor AI generates:
- ✅ Product List page
- ✅ API routes
- ✅ TypeScript types
- ✅ React Query hooks
- ✅ Apple-inspired styling

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run type-check       # Check TypeScript
npm run lint             # Run ESLint

# Database
npx prisma studio        # Visual editor
npx prisma db push       # Push schema changes
npm run db:seed          # Seed sample data

# Docker
docker-compose up -d     # Start services
docker-compose down      # Stop services
docker-compose logs -f   # View logs
```

---

## 📚 Documentation

### Key Documents

| Document | Purpose |
|----------|---------|
| `DEVELOPMENT_ROADMAP.md` | **12-week plan** (manual→AI) |
| `GCP_FREE_TIER_SETUP.md` | GCP configuration |
| `SETUP_INSTRUCTIONS.md` | Detailed setup guide |
| `QUICK_START.md` | Quick reference |
| `.cursor/rules.md` | Coding standards |

### Planning Docs (MD Files/)

- `Products_Benefits_Platform_Vision_Strategy_Roadmap.md` - Product vision
- `Products_Benefits_Platform_Complete_Epic_Analysis.md` - All 12 epics
- `Product_Creation_Modalities_Analysis (1).md` - Three creation modes
- `AI_Driven_Configuration_Model_Planning.md` - AI architecture

---

## 🎓 How AI Learns

### Week 1-4: Data Collection
```typescript
// Every manual action is logged:
{
  action: "create_benefit_package",
  metalTier: "GOLD",
  decisions: { deductible: 1500, copay_pcp: 25 },
  // ... all configuration choices
}
```

### Week 5-8: Pattern Recognition
```typescript
// AI identifies patterns:
"For Gold PPO in CA, users typically:
- Deductible: $1,200-$1,800
- PCP copay: $20-$30
- Include telehealth: 85% of time"
```

### Week 9-10: Smart Suggestions
```typescript
// AI suggests based on context:
if (metalTier === "GOLD" && state === "CA") {
  suggest({ 
    deductible: 1500, 
    confidence: 0.87 
  })
}
```

### Week 11-12: Autonomous Creation
```typescript
// AI creates products end-to-end:
User: "Competitive Gold PPO for CA families"
AI: [Generates complete product in 2 minutes]
User: [Reviews, modifies if needed, approves]
```

---

## 🤖 Using Cursor AI

### Best Practices

**Reference coding standards**:
```
"Follow @.cursor/rules.md standards"
```

**Reference database schema**:
```
"Use Product model from @prisma/schema.prisma"
```

**Specify design style**:
```
"Apple-inspired design: minimal, clean, spacious, 
Apple blue (#007AFF), rounded-lg, subtle shadows"
```

### Example Prompt

```
Create src/app/(dashboard)/products/page.tsx with:

Design:
- Apple-inspired (clean, minimal, generous spacing)
- Apple blue (#007AFF) for primary actions
- Frosted glass card backgrounds
- Subtle shadows
- SF Pro-like font (system-ui)

Functionality:
- Server component fetching from Prisma
- shadcn/ui Table component
- Columns: productId, name, LOB, status, effectiveDate
- Filters: LOB (select), status (select), search (input)
- "Create Product" button (top-right, Apple blue)
- Click row → navigate to /products/[id]

Technical:
- TypeScript with proper types
- Error boundaries
- Loading states
- Follow @.cursor/rules.md
```

---

## 🗺️ 12-Week Roadmap

| Weeks | Phase | Focus | AI Role |
|-------|-------|-------|---------|
| 1-4 | Manual Workflows | CRUD, forms, validation | Learning |
| 5-6 | Guided Wizards | Step-by-step, templates | Suggesting |
| 7-8 | Visual Builder | Drag-drop, complex configs | Learning patterns |
| 9-10 | AI Co-Pilot | Smart suggestions, validation | Assisting |
| 11-12 | AI-Driven | Conversational creation | Autonomous |

**Current Phase**: **Week 1** - Manual Product Creation

---

## 🎯 Success Metrics

### After Week 4 (Manual Complete)
- ✅ Can create products manually end-to-end
- ✅ 50+ configurations logged for AI learning
- ✅ Validation rules working
- ✅ Users comfortable with workflow

### After Week 8 (Wizards + Visual)
- ✅ 60% faster than pure manual
- ✅ 200+ configurations in system
- ✅ AI learning from complex patterns

### After Week 12 (Full AI)
- ✅ AI creates products autonomously
- ✅ 90% reduction in time-to-market
- ✅ Users review/approve (not build)
- ✅ AI learns from corrections

---

## 🐛 Troubleshooting

**Docker won't start**:
```bash
docker-compose down -v && docker-compose up -d
```

**Database errors**:
```bash
npx prisma generate && npx prisma db push
```

**TypeScript errors**:
```bash
rm -rf .next && npm run dev
```

---

## 📄 License

Proprietary - All Rights Reserved

---

## 🎉 Let's Build!

You have everything you need:
- ✅ Apple-inspired design system (shadcn/ui)
- ✅ Complete database schema (20+ models)
- ✅ GCP free tier configuration
- ✅ 12-week roadmap (manual→AI)
- ✅ Comprehensive documentation

**Start with Week 1: Product List Page**

Ask Cursor AI to build it with Apple-inspired design! 🚀

---

**Next Steps**:
1. Read `DEVELOPMENT_ROADMAP.md` for week-by-week plan
2. Check `GCP_FREE_TIER_SETUP.md` for cloud setup
3. Start building Product List page
4. Let AI learn from your manual workflows

**Remember**: Manual first, AI last. Build the foundation, then automate. 💪
