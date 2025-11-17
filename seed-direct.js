const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting equivalency seed...\n');

  // Clear existing
  console.log('Step 1: Clearing...');
  await prisma.equivalencyMapping.deleteMany({});
  await prisma.codeEquivalency.deleteMany({});
  console.log('✅ Cleared\n');

  // HbA1c
  console.log('Step 2: HbA1c Test...');
  let cpt1 = await prisma.codeSet.findFirst({ where: { code: '83036', codeType: 'CPT' } });
  if (!cpt1) {
    cpt1 = await prisma.codeSet.create({
      data: { code: '83036', codeType: 'CPT', description: 'Hemoglobin A1c', category: 'Lab', isActive: true, effectiveDate: new Date('2024-01-01') }
    });
  }
  
  let loinc1 = await prisma.codeSet.findFirst({ where: { code: '4548-4', codeType: 'LOINC' } });
  if (!loinc1) {
    loinc1 = await prisma.codeSet.create({
      data: { code: '4548-4', codeType: 'LOINC', description: 'HbA1c Blood', category: 'Lab', isActive: true, effectiveDate: new Date('2024-01-01') }
    });
  }

  const eq1 = await prisma.codeEquivalency.create({
    data: { name: 'HbA1c Test', description: 'HbA1c measurement', category: 'LABORATORY', source: 'MANUAL', confidence: 1.0 }
  });

  await prisma.equivalencyMapping.create({
    data: { equivalencyId: eq1.id, sourceCodeId: cpt1.id, targetCodeId: loinc1.id, relationship: 'EXACT', bidirectional: true }
  });
  console.log('✅ HbA1c: CPT 83036 ↔ LOINC 4548-4\n');

  // Lipid Panel
  console.log('Step 3: Lipid Panel...');
  let cpt2 = await prisma.codeSet.findFirst({ where: { code: '80061', codeType: 'CPT' } });
  if (!cpt2) {
    cpt2 = await prisma.codeSet.create({
      data: { code: '80061', codeType: 'CPT', description: 'Lipid panel', category: 'Lab', isActive: true, effectiveDate: new Date('2024-01-01') }
    });
  }
  
  let loinc2 = await prisma.codeSet.findFirst({ where: { code: '24331-1', codeType: 'LOINC' } });
  if (!loinc2) {
    loinc2 = await prisma.codeSet.create({
      data: { code: '24331-1', codeType: 'LOINC', description: 'Lipid panel', category: 'Lab', isActive: true, effectiveDate: new Date('2024-01-01') }
    });
  }

  const eq2 = await prisma.codeEquivalency.create({
    data: { name: 'Lipid Panel', description: 'Lipid profile', category: 'LABORATORY', source: 'MANUAL', confidence: 1.0 }
  });

  await prisma.equivalencyMapping.create({
    data: { equivalencyId: eq2.id, sourceCodeId: cpt2.id, targetCodeId: loinc2.id, relationship: 'EXACT', bidirectional: true }
  });
  console.log('✅ Lipid: CPT 80061 ↔ LOINC 24331-1\n');

  // Office Visit
  console.log('Step 4: Office Visit...');
  let cpt3 = await prisma.codeSet.findFirst({ where: { code: '99213', codeType: 'CPT' } });
  if (!cpt3) {
    cpt3 = await prisma.codeSet.create({
      data: { code: '99213', codeType: 'CPT', description: 'Office visit 20-29 min', category: 'E&M', isActive: true, effectiveDate: new Date('2024-01-01') }
    });
  }
  
  let cpt4 = await prisma.codeSet.findFirst({ where: { code: '99214', codeType: 'CPT' } });
  if (!cpt4) {
    cpt4 = await prisma.codeSet.create({
      data: { code: '99214', codeType: 'CPT', description: 'Office visit 30-39 min', category: 'E&M', isActive: true, effectiveDate: new Date('2024-01-01') }
    });
  }

  const eq3 = await prisma.codeEquivalency.create({
    data: { name: 'Office Visit', description: 'Related office visits', category: 'PROCEDURE', source: 'MANUAL', confidence: 0.95 }
  });

  await prisma.equivalencyMapping.create({
    data: { equivalencyId: eq3.id, sourceCodeId: cpt3.id, targetCodeId: cpt4.id, relationship: 'RELATED', bidirectional: true }
  });
  console.log('✅ Office: CPT 99213 ↔ CPT 99214\n');

  const total = await prisma.codeEquivalency.count();
  console.log('═══════════════════════════════════════');
  console.log('✅ DONE! Created ' + total + ' equivalencies');
  console.log('✨ Refresh browser to see data!');
  console.log('═══════════════════════════════════════\n');
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => { 
    console.error('❌ ERROR:', e); 
    prisma.$disconnect(); 
    process.exit(1); 
  });

