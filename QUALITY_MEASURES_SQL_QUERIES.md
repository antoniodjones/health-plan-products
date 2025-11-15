# 📊 Quality Measures SQL Queries

Useful SQL queries for exploring HEDIS quality measures data in PostgreSQL.

---

## 🔍 **Basic Queries**

### **1. View All Quality Measures**
```sql
SELECT 
    "measureId",
    name,
    program,
    domain,
    status,
    steward,
    "nationalBenchmark",
    "targetRate"
FROM quality_measures
ORDER BY "measureId";
```

### **2. Get Measure Details with Counts**
```sql
SELECT 
    qm."measureId",
    qm.name,
    qm.program,
    qm.domain,
    qm."nationalBenchmark",
    qm."targetRate",
    COUNT(DISTINCT ml.id) as logic_rules,
    COUNT(DISTINCT vs.id) as value_sets
FROM quality_measures qm
LEFT JOIN measure_logic ml ON ml."measureId" = qm.id
LEFT JOIN value_sets vs ON vs.id = ml."valueSetId"
GROUP BY qm.id, qm."measureId", qm.name, qm.program, qm.domain, 
         qm."nationalBenchmark", qm."targetRate"
ORDER BY qm."measureId";
```

### **3. View All Value Sets**
```sql
SELECT 
    "valueSetId",
    name,
    description,
    oid,
    purpose,
    "effectiveDate"
FROM value_sets
ORDER BY name;
```

---

## 🔗 **Relationship Queries**

### **4. Measures with Their Value Sets**
```sql
SELECT 
    qm."measureId",
    qm.name as measure_name,
    ml."logicType",
    vs."valueSetId",
    vs.name as value_set_name,
    vs.purpose,
    COUNT(vsc.id) as code_count
FROM quality_measures qm
JOIN measure_logic ml ON ml."measureId" = qm.id
LEFT JOIN value_sets vs ON vs.id = ml."valueSetId"
LEFT JOIN value_set_codes vsc ON vsc."valueSetId" = vs.id
GROUP BY qm."measureId", qm.name, ml."logicType", vs."valueSetId", vs.name, vs.purpose
ORDER BY qm."measureId", ml."logicType";
```

### **5. Value Sets with Their Codes**
```sql
SELECT 
    vs."valueSetId",
    vs.name as value_set_name,
    vs.purpose,
    cs.code,
    cs."codeType",
    cs.description as code_description,
    vsc.included
FROM value_sets vs
JOIN value_set_codes vsc ON vsc."valueSetId" = vs.id
JOIN code_sets cs ON cs.id = vsc."codeSetId"
ORDER BY vs.name, cs.code;
```

### **6. Complete Measure Profile**
```sql
SELECT 
    qm."measureId",
    qm.name,
    qm.description,
    qm.program,
    qm.domain,
    qm."nqfNumber",
    qm."cmsNumber",
    qm.steward,
    qm."reportingMethod",
    qm."measureType",
    qm."nationalBenchmark",
    qm."targetRate",
    ml."logicType",
    ml.sequence,
    ml.operator,
    ml."ageMin",
    ml."ageMax",
    ml.gender,
    ml."timeframeValue",
    ml."timeframeUnit",
    vs.name as value_set_name,
    vs.oid
FROM quality_measures qm
LEFT JOIN measure_logic ml ON ml."measureId" = qm.id
LEFT JOIN value_sets vs ON vs.id = ml."valueSetId"
WHERE qm."measureId" = 'CDC-H9'
ORDER BY ml.sequence;
```

---

## 📈 **Statistics Queries**

### **7. Measures by Program**
```sql
SELECT 
    program,
    COUNT(*) as measure_count
FROM quality_measures
GROUP BY program
ORDER BY measure_count DESC;
```

### **8. Measures by Domain**
```sql
SELECT 
    domain,
    COUNT(*) as measure_count,
    ROUND(AVG("nationalBenchmark"), 2) as avg_benchmark,
    ROUND(AVG("targetRate"), 2) as avg_target
FROM quality_measures
GROUP BY domain
ORDER BY measure_count DESC;
```

### **9. Measures by Steward**
```sql
SELECT 
    steward,
    COUNT(*) as measure_count
FROM quality_measures
WHERE steward IS NOT NULL
GROUP BY steward
ORDER BY measure_count DESC;
```

### **10. Value Set Code Summary**
```sql
SELECT 
    vs."valueSetId",
    vs.name,
    vs.purpose,
    COUNT(vsc.id) as total_codes,
    COUNT(CASE WHEN vsc.included = true THEN 1 END) as included_codes,
    COUNT(CASE WHEN vsc.included = false THEN 1 END) as excluded_codes
FROM value_sets vs
LEFT JOIN value_set_codes vsc ON vsc."valueSetId" = vs.id
GROUP BY vs.id, vs."valueSetId", vs.name, vs.purpose
ORDER BY total_codes DESC;
```

---

## 🔎 **Analysis Queries**

### **11. Measures Performance Gap Analysis**
```sql
SELECT 
    "measureId",
    name,
    program,
    domain,
    "nationalBenchmark",
    "targetRate",
    ("targetRate" - "nationalBenchmark") as performance_gap,
    ROUND((("targetRate" - "nationalBenchmark") / "nationalBenchmark" * 100), 2) as percent_improvement_needed
FROM quality_measures
WHERE "nationalBenchmark" IS NOT NULL AND "targetRate" IS NOT NULL
ORDER BY performance_gap DESC;
```

### **12. Measure Logic Complexity**
```sql
SELECT 
    qm."measureId",
    qm.name,
    COUNT(ml.id) as total_logic_rules,
    COUNT(CASE WHEN ml."logicType" = 'DENOMINATOR' THEN 1 END) as denominator_rules,
    COUNT(CASE WHEN ml."logicType" = 'NUMERATOR' THEN 1 END) as numerator_rules,
    COUNT(CASE WHEN ml."logicType" = 'EXCLUSION' THEN 1 END) as exclusion_rules
FROM quality_measures qm
LEFT JOIN measure_logic ml ON ml."measureId" = qm.id
GROUP BY qm.id, qm."measureId", qm.name
ORDER BY total_logic_rules DESC;
```

### **13. Age Range Coverage**
```sql
SELECT 
    qm."measureId",
    qm.name,
    ml."logicType",
    ml."ageMin",
    ml."ageMax",
    (ml."ageMax" - ml."ageMin") as age_span
FROM quality_measures qm
JOIN measure_logic ml ON ml."measureId" = qm.id
WHERE ml."ageMin" IS NOT NULL AND ml."ageMax" IS NOT NULL
ORDER BY age_span DESC;
```

### **14. Codes by Type in Value Sets**
```sql
SELECT 
    cs."codeType",
    COUNT(DISTINCT vsc.id) as usage_count,
    COUNT(DISTINCT vs.id) as value_set_count,
    STRING_AGG(DISTINCT vs.name, ', ') as value_sets
FROM code_sets cs
JOIN value_set_codes vsc ON vsc."codeSetId" = cs.id
JOIN value_sets vs ON vs.id = vsc."valueSetId"
GROUP BY cs."codeType"
ORDER BY usage_count DESC;
```

---

## 🎯 **Specific Measure Deep Dives**

### **15. CDC-H9 (Diabetes) Complete Profile**
```sql
-- Measure details
SELECT * FROM quality_measures WHERE "measureId" = 'CDC-H9';

-- Logic rules
SELECT 
    "logicType",
    sequence,
    operator,
    "ageMin",
    "ageMax",
    "timeframeValue",
    "timeframeUnit",
    "criteriaJson"
FROM measure_logic ml
JOIN quality_measures qm ON qm.id = ml."measureId"
WHERE qm."measureId" = 'CDC-H9'
ORDER BY sequence;

-- Value sets and codes
SELECT 
    vs.name as value_set,
    vs.purpose,
    cs.code,
    cs."codeType",
    cs.description
FROM quality_measures qm
JOIN measure_logic ml ON ml."measureId" = qm.id
JOIN value_sets vs ON vs.id = ml."valueSetId"
JOIN value_set_codes vsc ON vsc."valueSetId" = vs.id
JOIN code_sets cs ON cs.id = vsc."codeSetId"
WHERE qm."measureId" = 'CDC-H9'
ORDER BY vs.name, cs.code;
```

### **16. Prevention Measures Overview**
```sql
SELECT 
    qm."measureId",
    qm.name,
    qm."nationalBenchmark",
    qm."targetRate",
    COUNT(DISTINCT ml.id) as logic_rules,
    COUNT(DISTINCT vs.id) as value_sets,
    STRING_AGG(DISTINCT vs.name, ', ') as value_set_names
FROM quality_measures qm
LEFT JOIN measure_logic ml ON ml."measureId" = qm.id
LEFT JOIN value_sets vs ON vs.id = ml."valueSetId"
WHERE qm.domain = 'PREVENTION'
GROUP BY qm.id, qm."measureId", qm.name, qm."nationalBenchmark", qm."targetRate"
ORDER BY qm."measureId";
```

---

## 🚀 **How to Run These Queries**

### **Option 1: Cloud Shell (GCP)**
```bash
gcloud sql connect code-mgmt-db-dev --user=postgres --database=code_management_db
```

Then paste any query.

### **Option 2: Local via psql**
```bash
psql "postgresql://postgres:YOUR_PASSWORD@35.193.247.210:5432/code_management_db"
```

### **Option 3: Prisma Studio**
```bash
npm run db:studio
```

### **Option 4: VS Code Extension**
Use PostgreSQL extension and connect to:
```
Host: 35.193.247.210
Port: 5432
Database: code_management_db
Username: postgres
Password: [your password]
```

---

## 📊 **Quick Stats to Run First**

```sql
-- Overview
SELECT 
    (SELECT COUNT(*) FROM quality_measures) as total_measures,
    (SELECT COUNT(*) FROM value_sets) as total_value_sets,
    (SELECT COUNT(*) FROM value_set_codes) as total_value_set_codes,
    (SELECT COUNT(*) FROM measure_logic) as total_logic_rules,
    (SELECT COUNT(*) FROM product_measures) as total_product_assignments;
```

---

## 💡 **Pro Tips**

1. **Table Names:** Use double quotes for PostgreSQL (e.g., `"measureId"`)
2. **JSON Columns:** Use `->` or `->>` to query JSON fields:
   ```sql
   SELECT "criteriaJson"->>'description' FROM measure_logic;
   ```
3. **Date Filters:**
   ```sql
   WHERE "effectiveDate" >= '2024-01-01'
   ```
4. **Export Results:**
   ```sql
   \copy (SELECT * FROM quality_measures) TO 'measures.csv' CSV HEADER;
   ```

---

**Happy Querying!** 🎯

