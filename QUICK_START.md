# ⚡ Quick Start Guide

## 🚀 Get Running in 5 Minutes

```bash
# 1. Start Docker
docker-compose up -d

# 2. Setup environment
cp env.example .env.local

# 3. Initialize database
npx prisma db push
npm run db:seed

# 4. Start dev server
npm run dev
```

Open **http://localhost:3000** 🎉

---

## 📁 Project Structure at a Glance

```
src/
├── app/              # Pages & API routes
├── components/       # React components  
├── lib/             # Utils & Prisma client
├── types/           # TypeScript types
├── hooks/           # Custom hooks
└── services/        # Business logic

prisma/
└── schema.prisma    # Database (20+ models)
```

---

## 🎯 The Three Ways to Create Products

### 1. 🤖 AI-Driven (5-10 min)
Natural language → AI agents build product
```
"Create Gold PPO for CA targeting families"
```

### 2. 🎨 Visual Builder (30-60 min)
Drag-and-drop components, maximum control

### 3. 🧙 Guided Wizard (15-30 min)
10-step guided flow with AI suggestions

---

## 📊 Database Models (20+)

**Phase 1: Code Management**
- CodeSet (250K+ billing codes)
- CodeMapping (code → benefit rules)
- BenefitSegment (benefit categories)
- CustomCode (proprietary codes)

**Phase 2: Product Catalog** ⭐
- Product (top-level products)
- Plan (state-specific plans)
- BenefitPackage (benefit configuration)
- ProductTemplate (reusable templates)

**Phase 3-5: Rating, Compliance, Analytics**
- RatingConfiguration
- ComplianceRule
- Publication
- ProductMetrics

---

## 🛠️ Most Used Commands

```bash
npm run dev           # Start dev server
npx prisma studio     # Visual DB editor
docker-compose logs   # View Docker logs
npm run type-check    # Check types
npm run db:seed       # Reseed data
```

---

## 🎓 Test Credentials

After seeding:
- Email: `admin@samplehealthplan.com`
- Password: `password123`

---

## 🤖 Cursor AI Tips

**Ask Cursor to build features:**
```
"Create a Product List page with:
- MUI DataGrid
- Filters for LOB and status
- Search by name
- Link to detail page
Follow .cursor/rules.md standards"
```

**Use @ references:**
- `@codebase` - Entire project context
- `@.cursor/rules.md` - Coding standards
- `@prisma/schema.prisma` - Database schema

---

## 📚 Key Documentation

| Doc | Purpose |
|-----|---------|
| `SETUP_INSTRUCTIONS.md` | Detailed setup guide |
| `README.md` | Full project overview |
| `.cursor/rules.md` | Coding standards |
| `MD Files/Products_Benefits_Platform_Vision_Strategy_Roadmap.md` | Product vision |

---

## 🎯 Build Order (Recommended)

**Week 1**: Product List + Detail pages (Epic 6)
**Week 2**: Product Creation Wizard (Epic 7)
**Week 3**: Visual Benefit Builder (Epic 7)
**Week 4**: AI-Driven Creation (Epic 7) ⭐

---

## ⚠️ Important Notes

1. **AI Features require API keys**
   - Add `GOOGLE_AI_API_KEY` to `.env.local`
   - Or `OPENAI_API_KEY` for GPT-4

2. **Database seeding creates:**
   - 1 organization (Sample Health Plan)
   - 2 users (admin, product manager)
   - 5 benefit segments
   - 3 code sets
   - 1 sample product with plan

3. **This platform handles healthcare data**
   - Always prioritize security
   - Validate all inputs with Zod
   - Use proper authentication

---

## 🐛 Quick Troubleshooting

**Docker won't start?**
```bash
docker-compose down -v
docker-compose up -d
```

**Database errors?**
```bash
npx prisma generate
npx prisma db push
```

**TypeScript errors?**
```bash
rm -rf .next && npm run dev
```

---

## ✨ You're All Set!

Start building features with Cursor AI.

**First feature to build**: Product List Page
- Location: `src/app/(dashboard)/products/page.tsx`
- Ask Cursor AI to create it following `.cursor/rules.md`

🚀 **Let's revolutionize healthcare benefits!**

