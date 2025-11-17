/**
 * Simple Code Equivalencies Seed
 * Creates codes AND equivalencies together
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding code equivalencies with required codes...\n');

  // Clear existing
  console.log('Clearing existing equivalencies...');
  await prisma.equivalencyMapping.deleteMany({});
  await prisma.codeEquivalency.deleteMany({});

  // ============================================================================
  // 1. HbA1c Test: CPT 83036 ↔ LOINC 4548-4
  // ============================================================================
  console.log('📊 Creating HbA1c Test equivalency...');
  
  // Find or create CPT code
  let cptHbA1c = await prisma.codeSet.findFirst({
    where: { code: '83036', codeType: 'CPT' },
  });
  
  if (!cptHbA1c) {
    cptHbA1c = await prisma.codeSet.create({
      data: {
        code: '83036',
        codeType: 'CPT',
        description: 'Hemoglobin; glycosylated (A1c)',
        category: 'Laboratory',
        isActive: true,
        effectiveDate: new Date('2024-01-01'),
      },
    });
  }

  // Find or create LOINC code
  let loincHbA1c = await prisma.codeSet.findFirst({
    where: { code: '4548-4', codeType: 'LOINC' },
  });
  
  if (!loincHbA1c) {
    loincHbA1c = await prisma.codeSet.create({
      data: {
        code: '4548-4',
        codeType: 'LOINC',
        description: 'Hemoglobin A1c/Hemoglobin.total in Blood',
        category: 'Laboratory',
        isActive: true,
        effectiveDate: new Date('2024-01-01'),
      },
    });
  }

  const hba1cEquiv = await prisma.codeEquivalency.create({
    data: {
      name: 'HbA1c Test',
      description: 'Hemoglobin A1c measurement in blood',
      category: 'LABORATORY',
      source: 'MANUAL',
      confidence: 1.0,
    },
  });

  await prisma.equivalencyMapping.create({
    data: {
      equivalencyId: hba1cEquiv.id,
      sourceCodeId: cptHbA1c.id,
      targetCodeId: loincHbA1c.id,
      relationship: 'EXACT',
      bidirectional: true,
    },
  });

  console.log(`✅ Created HbA1c equivalency: CPT ${cptHbA1c.code} ↔ LOINC ${loincHbA1c.code}`);

  // ============================================================================
  // 2. Lipid Panel: CPT 80061 ↔ LOINC 24331-1
  // ============================================================================
  console.log('\n📊 Creating Lipid Panel equivalency...');
  
  let cptLipid = await prisma.codeSet.findFirst({
    where: { code: '80061', codeType: 'CPT' },
  });
  
  if (!cptLipid) {
    cptLipid = await prisma.codeSet.create({
      data: {
        code: '80061',
        codeType: 'CPT',
        description: 'Lipid panel',
        category: 'Laboratory',
        isActive: true,
        effectiveDate: new Date('2024-01-01'),
      },
    });
  }

  let loincLipid = await prisma.codeSet.findFirst({
    where: { code: '24331-1', codeType: 'LOINC' },
  });
  
  if (!loincLipid) {
    loincLipid = await prisma.codeSet.create({
      data: {
        code: '24331-1',
        codeType: 'LOINC',
        description: 'Lipid panel - Serum or Plasma',
        category: 'Laboratory',
        isActive: true,
        effectiveDate: new Date('2024-01-01'),
      },
    });
  }

  const lipidEquiv = await prisma.codeEquivalency.create({
    data: {
      name: 'Lipid Panel',
      description: 'Comprehensive lipid profile test',
      category: 'LABORATORY',
      source: 'MANUAL',
      confidence: 1.0,
    },
  });

  await prisma.equivalencyMapping.create({
    data: {
      equivalencyId: lipidEquiv.id,
      sourceCodeId: cptLipid.id,
      targetCodeId: loincLipid.id,
      relationship: 'EXACT',
      bidirectional: true,
    },
  });

  console.log(`✅ Created Lipid Panel equivalency: CPT ${cptLipid.code} ↔ LOINC ${loincLipid.code}`);

  // ============================================================================
  // 3. Office Visit: CPT 99213 ↔ CPT 99214 (Related)
  // ============================================================================
  console.log('\n📊 Creating Office Visit equivalency...');
  
  let cpt99213 = await prisma.codeSet.findFirst({
    where: { code: '99213', codeType: 'CPT' },
  });
  
  if (!cpt99213) {
    cpt99213 = await prisma.codeSet.create({
      data: {
        code: '99213',
        codeType: 'CPT',
        description: 'Office visit, established patient, 20-29 minutes',
        category: 'Evaluation and Management',
        isActive: true,
        effectiveDate: new Date('2024-01-01'),
      },
    });
  }

  let cpt99214 = await prisma.codeSet.findFirst({
    where: { code: '99214', codeType: 'CPT' },
  });
  
  if (!cpt99214) {
    cpt99214 = await prisma.codeSet.create({
      data: {
        code: '99214',
        codeType: 'CPT',
        description: 'Office visit, established patient, 30-39 minutes',
        category: 'Evaluation and Management',
        isActive: true,
        effectiveDate: new Date('2024-01-01'),
      },
    });
  }

  const officeVisitEquiv = await prisma.codeEquivalency.create({
    data: {
      name: 'Office Visit - Established Patient',
      description: 'Related office visit codes for established patients',
      category: 'PROCEDURE',
      source: 'MANUAL',
      confidence: 0.95,
    },
  });

  await prisma.equivalencyMapping.create({
    data: {
      equivalencyId: officeVisitEquiv.id,
      sourceCodeId: cpt99213.id,
      targetCodeId: cpt99214.id,
      relationship: 'RELATED',
      bidirectional: true,
    },
  });

  console.log(`✅ Created Office Visit equivalency: CPT ${cpt99213.code} ↔ CPT ${cpt99214.code}`);

  // ============================================================================
  // Summary
  // ============================================================================
  const totalEquivalencies = await prisma.codeEquivalency.count();
  const totalMappings = await prisma.equivalencyMapping.count();

  console.log('\n✅ Seeding complete!');
  console.log(`📊 Created ${totalEquivalencies} code equivalencies`);
  console.log(`🔗 Created ${totalMappings} equivalency mappings`);
}

main()
  .catch((error) => {
    console.error('❌ Error seeding equivalencies:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

