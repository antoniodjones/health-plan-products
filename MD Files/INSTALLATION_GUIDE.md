# CURSOR AI PROJECT - STEP-BY-STEP INSTALLATION GUIDE
## Products & Benefits Platform

**Time Required:** 10-15 minutes  
**Difficulty:** Beginner-friendly

---

## 📋 WHAT YOU'LL GET

After this setup, you'll have:
- ✅ Complete Next.js 14 project with TypeScript
- ✅ PostgreSQL database with complete schema (all 12 epics)
- ✅ Cursor AI configured with coding rules
- ✅ All dependencies installed
- ✅ Ready to start building

---

## 🎯 STEP 1: DOWNLOAD PROJECT FILES

**I've created all the configuration files for you!**

Download these files from the outputs directory:
- `.cursor/rules.md` - Cursor AI coding rules
- `prisma/schema.prisma` - Database schema
- `.env.example` - Environment variables template
- `docker-compose.yml` - Docker services
- `package.json` - Dependencies and scripts
- `README.md` - Project documentation
- `CURSOR_AI_PROJECT_SETUP.md` - Setup guide

**Download location:** `/mnt/user-data/outputs/cursor-project-setup/`

---

## 🚀 STEP 2: CREATE PROJECT

Open your terminal and run:

```bash
# 1. Create project directory
mkdir products-benefits-platform
cd products-benefits-platform

# 2. Initialize Next.js project
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Answer prompts:
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … Yes
✔ Would you like to use App Router? … Yes
✔ Would you like to customize the default import alias? … Yes (@/*)
```

**Wait for installation to complete (~2 minutes)**

---

## 📦 STEP 3: COPY CONFIGURATION FILES

Copy the downloaded files into your project:

```bash
# 1. Create .cursor directory
mkdir .cursor

# 2. Copy Cursor AI rules
cp /path/to/downloaded/.cursor/rules.md .cursor/

# 3. Create prisma directory
mkdir prisma

# 4. Copy Prisma schema
cp /path/to/downloaded/prisma/schema.prisma prisma/

# 5. Copy environment template
cp /path/to/downloaded/.env.example .env.example

# 6. Copy Docker Compose
cp /path/to/downloaded/docker-compose.yml .

# 7. Copy README
cp /path/to/downloaded/README.md .

# 8. Merge package.json dependencies
# Open both package.json files and add the new dependencies/scripts
# Or just replace the entire file:
cp /path/to/downloaded/package.json .
```

**Or use this shortcut:**
```bash
# If you have all files in ~/Downloads/cursor-project-setup/
cp -r ~/Downloads/cursor-project-setup/.cursor .
cp -r ~/Downloads/cursor-project-setup/prisma .
cp ~/Downloads/cursor-project-setup/.env.example .
cp ~/Downloads/cursor-project-setup/docker-compose.yml .
cp ~/Downloads/cursor-project-setup/package.json .
cp ~/Downloads/cursor-project-setup/README.md .
```

---

## 📦 STEP 4: INSTALL DEPENDENCIES

```bash
npm install
```

**This will install:**
- Next.js & React
- TypeScript
- Tailwind CSS & Material-UI
- Prisma (database ORM)
- React Query (data fetching)
- React Hook Form & Zod (forms & validation)
- And 20+ other packages

**Wait for installation (~3-5 minutes)**

---

## 🔐 STEP 5: CONFIGURE ENVIRONMENT

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your favorite editor
# You can leave the defaults for local development
code .env.local  # VSCode
cursor .env.local  # Cursor
nano .env.local  # Terminal editor
```

**For local development, the defaults work fine!**

The important one:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/products_benefits_platform_dev"
```

---

## 🐳 STEP 6: START DATABASE

```bash
# Start PostgreSQL + Redis with Docker
docker-compose up -d

# Verify it's running
docker ps

# You should see:
# - products-benefits-db (PostgreSQL)
# - products-benefits-cache (Redis)

# View logs (optional)
docker-compose logs -f postgres
# Press Ctrl+C to exit logs
```

**Wait 5-10 seconds for PostgreSQL to initialize**

---

## 🗄️ STEP 7: SETUP DATABASE

```bash
# Generate Prisma Client
npx prisma generate

# Push database schema (creates all tables)
npx prisma db push

# You should see:
# ✔ Created database 'products_benefits_platform_dev'
# ✔ Generated Prisma Client
# ✔ Database synchronized with schema
```

**This creates 20+ tables for all 12 epics!**

---

## 🎨 STEP 8: OPEN IN CURSOR AI

```bash
# Open project in Cursor AI
cursor .
```

**Cursor AI will automatically:**
- Load the `.cursor/rules.md` file
- Understand your project structure
- Follow your coding standards
- Help you build features

---

## ✅ STEP 9: VERIFY SETUP

```bash
# Start development server
npm run dev
```

**Open browser:** http://localhost:3000

You should see the Next.js welcome page!

**Also open Prisma Studio (database GUI):**
```bash
# In a new terminal window
npx prisma studio
```

**Open browser:** http://localhost:5555

You should see your database with all tables!

---

## 🎉 SUCCESS!

Your project is now ready! You should have:

✅ Next.js app running on http://localhost:3000  
✅ PostgreSQL database with complete schema  
✅ Prisma Studio on http://localhost:5555  
✅ Cursor AI configured with coding rules  
✅ All dependencies installed  

---

## 🚀 WHAT'S NEXT?

### Option A: Build Your First Component

**Use Cursor AI Composer (CMD+I or CTRL+I):**

```
Create a ProductList component that:
1. Fetches products from the database
2. Displays them in a table
3. Has columns: name, LOB, status, actions
4. Includes filters for LOB and status
5. Uses Material-UI DataGrid
```

Cursor AI will generate:
- The component file
- API route
- Types
- Hooks

### Option B: Seed Database with Sample Data

**Create seed file:**
```bash
# Create prisma/seed.ts
cursor prisma/seed.ts
```

**Ask Cursor AI:**
```
Create a Prisma seed script that adds:
1. 3 sample products (Bronze, Silver, Gold)
2. 5 sample CPT codes
3. 3 sample code mappings
```

**Run seed:**
```bash
npx prisma db seed
```

### Option C: Follow the Epic Development Order

1. **Epic 1:** Code Set Data Management (already has schema)
2. **Epic 6:** Product Catalog & Management (CRITICAL - build first!)
3. **Epic 7:** Benefit Design Studio
4. Continue with remaining epics...

---

## 🤖 USING CURSOR AI

### Composer (CMD+I / CTRL+I) - CREATE FEATURES
**Best for:** Creating new components, pages, API routes

**Example prompts:**
```
1. "Create a Product List page with filtering and sorting"

2. "Create an API route at /api/products that:
   - GET: Returns all products
   - POST: Creates a new product
   - Uses Prisma for database queries
   - Validates input with Zod"

3. "Create a ProductCard component that displays product info and has edit/delete buttons"
```

### Chat (CMD+K / CTRL+K) - UNDERSTAND CODE
**Best for:** Asking questions, understanding code

**Example prompts:**
```
1. "@codebase how is authentication handled?"

2. "@file explain this component"

3. "@docs what are the Prisma models for products?"
```

### Use @ References
- `@codebase` - Your entire codebase
- `@docs` - Documentation
- `@file` - Specific file
- `@folder` - Specific folder

---

## 🛠️ TROUBLESHOOTING

### Problem: Database won't start
**Solution:**
```bash
# Check if port 5432 is in use
lsof -ti:5432

# Stop existing PostgreSQL
brew services stop postgresql  # macOS with Homebrew
sudo service postgresql stop  # Linux

# Or change port in docker-compose.yml to 5433
```

### Problem: Prisma can't connect
**Solution:**
```bash
# Check database is running
docker ps

# Check connection string in .env.local
# Should be: postgresql://postgres:postgres@localhost:5432/products_benefits_platform_dev

# Reset database
docker-compose down -v
docker-compose up -d
npx prisma db push
```

### Problem: Next.js won't start
**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Start again
npm run dev
```

### Problem: Cursor AI not following rules
**Solution:**
- Verify `.cursor/rules.md` exists
- Restart Cursor AI
- Use `@docs` to reference rules explicitly

---

## 📚 HELPFUL COMMANDS

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server

# Database
npx prisma studio       # Open database GUI
npx prisma db push      # Sync schema to database
npx prisma generate     # Generate Prisma Client
npm run db:seed         # Seed database

# Docker
docker-compose up -d    # Start services
docker-compose down     # Stop services
docker-compose logs -f  # View logs

# Code Quality
npm run lint            # Lint code
npm run format          # Format code
npm run type-check      # Check TypeScript
npm test                # Run tests
```

---

## 🎯 RECOMMENDED FIRST TASKS

**Week 1: Foundation**
1. ✅ Setup project (you just did this!)
2. Create seed data (`prisma/seed.ts`)
3. Build Product List page
4. Build Product Detail page
5. Create API routes for products

**Week 2: Epic 6 - Product Catalog**
1. Create Product form
2. Product CRUD operations
3. Product search & filtering
4. Product versioning
5. Product approval workflow

**Week 3: Epic 7 - Benefit Design Studio**
1. Design canvas layout (3-panel)
2. Component library (benefit segments)
3. Drag-and-drop functionality
4. Real-time cost preview
5. Save benefit packages

---

## 📞 NEED HELP?

**Resources:**
- **README.md** - Project overview and documentation
- **CURSOR_AI_PROJECT_SETUP.md** - Detailed setup guide
- **.cursor/rules.md** - Coding standards
- **prisma/schema.prisma** - Database schema (commented)

**Common Issues:**
- Port conflicts → Change ports in docker-compose.yml
- Database connection → Check .env.local DATABASE_URL
- Dependencies → `npm clean:install`
- Cursor AI → Restart Cursor or check .cursor/rules.md

---

## ✅ CHECKLIST

Use this checklist to verify your setup:

- [ ] Node.js 18+ installed
- [ ] Docker Desktop running
- [ ] Project created with Next.js
- [ ] All config files copied
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] Database running (`docker-compose up -d`)
- [ ] Database schema pushed (`npx prisma db push`)
- [ ] Dev server running (`npm run dev`)
- [ ] Prisma Studio accessible (`npx prisma studio`)
- [ ] Cursor AI open with project
- [ ] Can see tables in Prisma Studio

**All checked?** 🎉 **You're ready to build!**

---

## 🎓 LEARNING RESOURCES

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

### Prisma
- [Prisma Documentation](https://www.prisma.io/docs)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Cursor AI
- [Cursor Documentation](https://cursor.sh/docs)
- [Cursor AI Tips](https://cursor.sh/tips)

---

**Congratulations! Your Products & Benefits Platform is ready to build! 🚀**

**Next:** Start with Epic 6 (Product Catalog) - it's the critical foundation! 🎯
