# Troubleshooting: Code Mappings Empty

## Issue
The Code Mappings page shows "No equivalencies found" even though data should be seeded.

## Possible Causes & Solutions

### 1. **Equivalencies Not Seeded**

**Check:**
```bash
cd "/Users/antonio.jones/Desktop/Coding Projects/health-plan-products"
npm run db:seed:equivalencies
```

**Expected Output:**
```
🌱 Seeding code equivalencies...
Clearing existing equivalencies...
📊 Creating HbA1c Test equivalency...
✅ Created HbA1c equivalency: CPT 83036 ↔ LOINC 4548-4
...
✅ Seeded 5 code equivalencies
✅ Created X equivalency mappings
```

### 2. **Dev Server Not Running**

**Start the dev server:**
```bash
npm run dev
```

**Then navigate to:**
```
http://localhost:3000/mappings
```

### 3. **Database Connection Issue**

**Check `.env.local` exists and has correct DATABASE_URL:**
```bash
cat .env.local | grep DATABASE_URL
```

**Should show:**
```
DATABASE_URL="postgresql://postgres:x40Lr9Bz2P@35.193.247.210:5432/code_management_db"
```

**If missing, create it:**
```bash
cp env.example .env.local
# Then edit .env.local with correct password
```

### 4. **Prisma Client Out of Sync**

**Regenerate Prisma Client:**
```bash
npx prisma generate
```

**Then restart dev server:**
```bash
npm run dev
```

### 5. **API Route Not Working**

**Test the API directly:**
```bash
# Test statistics endpoint
curl http://localhost:3000/api/code-equivalencies/statistics

# Test list endpoint
curl http://localhost:3000/api/code-equivalencies
```

**Expected Response:**
```json
{
  "equivalencies": [...],
  "total": 5,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
```

### 6. **Browser Cache**

**Clear browser cache and hard reload:**
- Chrome/Edge: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Firefox: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

---

## Quick Fix Steps

**Run these commands in order:**

```bash
# 1. Navigate to project
cd "/Users/antonio.jones/Desktop/Coding Projects/health-plan-products"

# 2. Ensure database is accessible
npx prisma db push

# 3. Regenerate Prisma client
npx prisma generate

# 4. Seed equivalencies
npm run db:seed:equivalencies

# 5. Start dev server (if not running)
npm run dev

# 6. Open browser to http://localhost:3000/mappings
# 7. Click "Equivalency Mappings" tab
# 8. Click "Refresh" button
```

---

## Verify Data in Database

**Run this query in Cloud Shell or local psql:**

```sql
-- Connect to database
psql "postgresql://postgres:x40Lr9Bz2P@35.193.247.210:5432/code_management_db"

-- Check equivalencies
SELECT id, name, category, source, confidence 
FROM code_equivalencies;

-- Check mappings
SELECT 
  ce.name,
  cs1.code_type || ' ' || cs1.code as source_code,
  cs2.code_type || ' ' || cs2.code as target_code,
  em.relationship
FROM equivalency_mappings em
JOIN code_equivalencies ce ON em.equivalency_id = ce.id
JOIN code_sets cs1 ON em.source_code_id = cs1.id
JOIN code_sets cs2 ON em.target_code_id = cs2.id;
```

**Expected Result:**
- 5 rows in `code_equivalencies`
- 5 rows in `equivalency_mappings`

---

## Still Not Working?

### Check Console for Errors

**Open browser DevTools:**
1. Press `F12` or `Cmd+Option+I` (Mac)
2. Go to **Console** tab
3. Look for red errors
4. Go to **Network** tab
5. Refresh page
6. Look for failed API calls (red status codes)

**Common Errors:**

**Error: "Failed to fetch"**
- Dev server not running → Run `npm run dev`

**Error: "404 Not Found"**
- API route missing → Check `/api/code-equivalencies/route.ts` exists

**Error: "500 Internal Server Error"**
- Database connection issue → Check `.env.local`
- Prisma client issue → Run `npx prisma generate`

**Error: "PrismaClientInitializationError"**
- Database not accessible → Check GCP Cloud SQL IP whitelist
- Wrong password → Check `.env.local` DATABASE_URL

---

## Manual Test of Components

**Test each component individually:**

### 1. Test Statistics API
```bash
curl http://localhost:3000/api/code-equivalencies/statistics
```

### 2. Test List API
```bash
curl http://localhost:3000/api/code-equivalencies?page=1&pageSize=20
```

### 3. Test Specific Equivalency
```bash
# Get ID from list API, then:
curl http://localhost:3000/api/code-equivalencies/[ID]
```

### 4. Test Lookup API
```bash
curl "http://localhost:3000/api/code-equivalencies/lookup?code=83036&system=CPT"
```

---

## Expected Behavior

### **Equivalency Mappings Tab Should Show:**

**Statistics Cards:**
- Total Equivalencies: 5
- Coverage Rate: X%
- Avg Confidence: 98.0%
- Top Category: LABORATORY (2)

**Equivalencies List:**
1. **HbA1c Test** (LABORATORY)
   - CPT 83036 ↔ LOINC 4548-4
   - Source: MANUAL, Confidence: 100%

2. **Lipid Panel** (LABORATORY)
   - CPT 80061 ↔ LOINC 24331-1
   - Source: MANUAL, Confidence: 100%

3. **Office Visit - Established Patient** (PROCEDURE)
   - CPT 99213 ↔ CPT 99214
   - Source: MANUAL, Confidence: 95%

4. **Type 2 Diabetes Mellitus** (DIAGNOSIS)
   - ICD-10 E11.9
   - Source: MANUAL, Confidence: 100%

5. **Diagnostic Colonoscopy** (PROCEDURE)
   - CPT 45378 ↔ HCPCS G0105
   - Source: CMS_CROSSWALK, Confidence: 100%

---

## Contact for Help

If none of these solutions work, provide:
1. Screenshot of browser console errors
2. Output of `npm run dev`
3. Output of `npm run db:seed:equivalencies`
4. Output of database query above

