/**
 * Quick Equivalency Seed Script
 * Run with: npx tsx seed-equivalencies-now.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting equivalency seed...\n');

  try {
    // Step 1: Clear existing equivalencies
    console.log('Step 1: Clearing existing equivalencies...');
    await prisma.equivalencyMapping.deleteMany({});
    await prisma.codeEquivalency.deleteMany({});
    console.log('✅ Cleared\n');

    // Step 2: Create HbA1c equivalency
    console.log('Step 2: Creating HbA1c Test equivalency...');
    
    // Find or create CPT code
    let cptHbA1c = await prisma.codeSet.findFirst({
      where: { code: '83036', codeType: 'CPT' },
    });
    
    if (!cptHbA1c) {
      console.log('  Creating CPT 83036...');
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
    console.log(`  ✓ CPT code: ${cptHbA1c.code}`);

    // Find or create LOINC code
    let loincHbA1c = await prisma.codeSet.findFirst({
      where: { code: '4548-4', codeType: 'LOINC' },
    });
    
    if (!loincHbA1c) {
      console.log('  Creating LOINC 4548-4...');
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
    console.log(`  ✓ LOINC code: ${loincHbA1c.code}`);

    // Create equivalency
    const hba1cEquiv = await prisma.codeEquivalency.create({
      data: {
        name: 'HbA1c Test',
        description: 'Hemoglobin A1c measurement in blood',
        category: 'LABORATORY',
        source: 'MANUAL',
        confidence: 1.0,
      },
    });
    console.log(`  ✓ Equivalency created: ${hba1cEquiv.name}`);

    // Create mapping
    await prisma.equivalencyMapping.create({
      data: {
        equivalencyId: hba1cEquiv.id,
        sourceCodeId: cptHbA1c.id,
        targetCodeId: loincHbA1c.id,
        relationship: 'EXACT',
        bidirectional: true,
      },
    });
    console.log(`  ✓ Mapping: CPT ${cptHbA1c.code} ↔ LOINC ${loincHbA1c.code}\n`);

    // Step 3: Create Lipid Panel equivalency
    console.log('Step 3: Creating Lipid Panel equivalency...');
    
    let cptLipid = await prisma.codeSet.findFirst({
      where: { code: '80061', codeType: 'CPT' },
    });
    
    if (!cptLipid) {
      console.log('  Creating CPT 80061...');
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
    console.log(`  ✓ CPT code: ${cptLipid.code}`);

    let loincLipid = await prisma.codeSet.findFirst({
      where: { code: '24331-1', codeType: 'LOINC' },
    });
    
    if (!loincLipid) {
      console.log('  Creating LOINC 24331-1...');
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
    console.log(`  ✓ LOINC code: ${loincLipid.code}`);

    const lipidEquiv = await prisma.codeEquivalency.create({
      data: {
        name: 'Lipid Panel',
        description: 'Comprehensive lipid profile test',
        category: 'LABORATORY',
        source: 'MANUAL',
        confidence: 1.0,
      },
    });
    console.log(`  ✓ Equivalency created: ${lipidEquiv.name}`);

    await prisma.equivalencyMapping.create({
      data: {
        equivalencyId: lipidEquiv.id,
        sourceCodeId: cptLipid.id,
        targetCodeId: loincLipid.id,
        relationship: 'EXACT',
        bidirectional: true,
      },
    });
    console.log(`  ✓ Mapping: CPT ${cptLipid.code} ↔ LOINC ${loincLipid.code}\n`);

    // Step 4: Create Office Visit equivalency
    console.log('Step 4: Creating Office Visit equivalency...');
    
    let cpt99213 = await prisma.codeSet.findFirst({
      where: { code: '99213', codeType: 'CPT' },
    });
    
    if (!cpt99213) {
      console.log('  Creating CPT 99213...');
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
    console.log(`  ✓ CPT code: ${cpt99213.code}`);

    let cpt99214 = await prisma.codeSet.findFirst({
      where: { code: '99214', codeType: 'CPT' },
    });
    
    if (!cpt99214) {
      console.log('  Creating CPT 99214...');
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
    console.log(`  ✓ CPT code: ${cpt99214.code}`);

    const officeVisitEquiv = await prisma.codeEquivalency.create({
      data: {
        name: 'Office Visit - Established Patient',
        description: 'Related office visit codes for established patients',
        category: 'PROCEDURE',
        source: 'MANUAL',
        confidence: 0.95,
      },
    });
    console.log(`  ✓ Equivalency created: ${officeVisitEquiv.name}`);

    await prisma.equivalencyMapping.create({
      data: {
        equivalencyId: officeVisitEquiv.id,
        sourceCodeId: cpt99213.id,
        targetCodeId: cpt99214.id,
        relationship: 'RELATED',
        bidirectional: true,
      },
    });
    console.log(`  ✓ Mapping: CPT ${cpt99213.code} ↔ CPT ${cpt99214.code}\n`);

    // Step 5: Summary
    const totalEquivalencies = await prisma.codeEquivalency.count();
    const totalMappings = await prisma.equivalencyMapping.count();

    console.log('═══════════════════════════════════════');
    console.log('✅ SEEDING COMPLETE!');
    console.log('═══════════════════════════════════════');
    console.log(`📊 Total Equivalencies: ${totalEquivalencies}`);
    console.log(`🔗 Total Mappings: ${totalMappings}`);
    console.log('\nEquivalencies created:');
    console.log('1. HbA1c Test (LABORATORY)');
    console.log('   CPT 83036 ↔ LOINC 4548-4');
    console.log('2. Lipid Panel (LABORATORY)');
    console.log('   CPT 80061 ↔ LOINC 24331-1');
    console.log('3. Office Visit (PROCEDURE)');
    console.log('   CPT 99213 ↔ CPT 99214');
    console.log('\n✨ Refresh your browser to see the data!');
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Fatal error:', error);
    await prisma.$disconnect();
    process.exit(1);
  });

