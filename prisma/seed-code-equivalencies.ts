/**
 * Seed Code Equivalencies (Epic 8)
 * Seeds common CPT ↔ LOINC ↔ SNOMED mappings
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding code equivalencies...');

  // Clear existing equivalencies
  console.log('Clearing existing equivalencies...');
  await prisma.equivalencyMapping.deleteMany({});
  await prisma.codeEquivalency.deleteMany({});

  // ============================================================================
  // 1. HbA1c Test Equivalency
  // ============================================================================
  console.log('\n📊 Creating HbA1c Test equivalency...');
  
  // Find the codes
  const cptHbA1c = await prisma.codeSet.findFirst({
    where: { code: '83036', codeType: 'CPT' },
  });

  const loincHbA1c = await prisma.codeSet.findFirst({
    where: { code: '4548-4', codeType: 'LOINC' },
  });

  if (cptHbA1c && loincHbA1c) {
    const hba1cEquiv = await prisma.codeEquivalency.create({
      data: {
        name: 'HbA1c Test',
        description: 'Hemoglobin A1c measurement in blood',
        category: 'LABORATORY',
        source: 'MANUAL',
        confidence: 1.0,
      },
    });

    // Create CPT ↔ LOINC mapping
    await prisma.equivalencyMapping.create({
      data: {
        equivalencyId: hba1cEquiv.id,
        sourceCodeId: cptHbA1c.id,
        targetCodeId: loincHbA1c.id,
        relationship: 'EXACT',
        bidirectional: true,
        confidence: 1.0,
      },
    });

    console.log(`✅ Created HbA1c equivalency: CPT 83036 ↔ LOINC 4548-4`);
  } else {
    console.log('⚠️  Skipping HbA1c - codes not found');
  }

  // ============================================================================
  // 2. Lipid Panel Equivalency
  // ============================================================================
  console.log('\n🩸 Creating Lipid Panel equivalency...');

  const cptLipid = await prisma.codeSet.findFirst({
    where: { code: '80061', codeType: 'CPT' },
  });

  const loincLipid = await prisma.codeSet.findFirst({
    where: { code: '24331-1', codeType: 'LOINC' },
  });

  if (cptLipid && loincLipid) {
    const lipidEquiv = await prisma.codeEquivalency.create({
      data: {
        name: 'Lipid Panel',
        description: 'Lipid panel blood test',
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
        confidence: 1.0,
      },
    });

    console.log(`✅ Created Lipid Panel equivalency: CPT 80061 ↔ LOINC 24331-1`);
  } else {
    console.log('⚠️  Skipping Lipid Panel - codes not found');
  }

  // ============================================================================
  // 3. Office Visit Equivalencies
  // ============================================================================
  console.log('\n🏥 Creating Office Visit equivalencies...');

  // CPT 99213 - Office Visit
  const cpt99213 = await prisma.codeSet.findFirst({
    where: { code: '99213', codeType: 'CPT' },
  });

  // CPT 99214 - Office Visit
  const cpt99214 = await prisma.codeSet.findFirst({
    where: { code: '99214', codeType: 'CPT' },
  });

  if (cpt99213 && cpt99214) {
    const officeVisitEquiv = await prisma.codeEquivalency.create({
      data: {
        name: 'Office Visit - Established Patient',
        description: 'Office or outpatient visit for established patient',
        category: 'PROCEDURE',
        source: 'MANUAL',
        confidence: 0.95,
      },
    });

    // Both are office visits, but 99214 is more complex (related, not exact)
    await prisma.equivalencyMapping.create({
      data: {
        equivalencyId: officeVisitEquiv.id,
        sourceCodeId: cpt99213.id,
        targetCodeId: cpt99214.id,
        relationship: 'RELATED',
        bidirectional: true,
        confidence: 0.95,
      },
    });

    console.log(`✅ Created Office Visit equivalency: CPT 99213 ↔ 99214 (related)`);
  } else {
    console.log('⚠️  Skipping Office Visit - codes not found');
  }

  // ============================================================================
  // 4. Diabetes Diagnosis Equivalencies
  // ============================================================================
  console.log('\n💉 Creating Diabetes diagnosis equivalencies...');

  const icdDiabetes = await prisma.codeSet.findFirst({
    where: { code: 'E11.9', codeType: 'ICD_10_CM' },
  });

  if (icdDiabetes) {
    const diabetesEquiv = await prisma.codeEquivalency.create({
      data: {
        name: 'Type 2 Diabetes Mellitus',
        description: 'Type 2 diabetes mellitus without complications',
        category: 'DIAGNOSIS',
        source: 'MANUAL',
        confidence: 1.0,
      },
    });

    console.log(`✅ Created Diabetes diagnosis equivalency (ICD-10 E11.9)`);
    console.log(`   Note: SNOMED mapping would be added when SNOMED codes are seeded`);
  } else {
    console.log('⚠️  Skipping Diabetes - codes not found');
  }

  // ============================================================================
  // 5. Colonoscopy Equivalencies
  // ============================================================================
  console.log('\n🔬 Creating Colonoscopy equivalencies...');

  const cptColonoscopy = await prisma.codeSet.findFirst({
    where: { code: '45378', codeType: 'CPT' },
  });

  const hcpcsColonoscopy = await prisma.codeSet.findFirst({
    where: { code: 'G0105', codeType: 'HCPCS' },
  });

  if (cptColonoscopy && hcpcsColonoscopy) {
    const colonoscopyEquiv = await prisma.codeEquivalency.create({
      data: {
        name: 'Diagnostic Colonoscopy',
        description: 'Colonoscopy diagnostic procedure',
        category: 'PROCEDURE',
        source: 'CMS_CROSSWALK',
        confidence: 1.0,
      },
    });

    await prisma.equivalencyMapping.create({
      data: {
        equivalencyId: colonoscopyEquiv.id,
        sourceCodeId: cptColonoscopy.id,
        targetCodeId: hcpcsColonoscopy.id,
        relationship: 'EXACT',
        bidirectional: true,
        confidence: 1.0,
      },
    });

    console.log(`✅ Created Colonoscopy equivalency: CPT 45378 ↔ HCPCS G0105`);
  } else {
    console.log('⚠️  Skipping Colonoscopy - codes not found');
  }

  // ============================================================================
  // Summary Statistics
  // ============================================================================
  console.log('\n📊 Seed Summary:');
  
  const totalEquivalencies = await prisma.codeEquivalency.count();
  const totalMappings = await prisma.equivalencyMapping.count();
  
  const byCategory = await prisma.codeEquivalency.groupBy({
    by: ['category'],
    _count: true,
  });

  console.log(`\n✅ Seeded ${totalEquivalencies} code equivalencies`);
  console.log(`✅ Created ${totalMappings} equivalency mappings`);
  console.log('\nBy Category:');
  byCategory.forEach((cat) => {
    console.log(`   ${cat.category}: ${cat._count} equivalencies`);
  });

  console.log('\n🎉 Code equivalency seeding complete!');
  console.log('\n💡 Next steps:');
  console.log('   1. Import CMS CPT-HCPCS crosswalk for comprehensive mappings');
  console.log('   2. Import NLM UMLS for ICD-10 ↔ SNOMED mappings');
  console.log('   3. Enable AI-suggested mappings for new codes');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding code equivalencies:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

