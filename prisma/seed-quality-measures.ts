/**
 * Seed script for Quality Measures (HEDIS)
 * Real-world HEDIS 2024 measures with actual value sets and codes
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Quality Measures (HEDIS)...\n');

  // Clear existing quality measures data
  console.log('🧹 Clearing existing quality measures data...');
  await prisma.measureLogic.deleteMany({});
  await prisma.productMeasure.deleteMany({});
  await prisma.valueSetCode.deleteMany({});
  await prisma.valueSet.deleteMany({});
  await prisma.qualityMeasure.deleteMany({});
  console.log('✅ Cleared existing data\n');

  // ============================================================================
  // MEASURE 1: CDC-H9 - Comprehensive Diabetes Care: HbA1c Control (<8%)
  // ============================================================================
  console.log('📊 Creating HEDIS CDC-H9 (Diabetes HbA1c Control)...');
  
  const cdcH9 = await prisma.qualityMeasure.create({
    data: {
      measureId: 'CDC-H9',
      name: 'Comprehensive Diabetes Care: HbA1c Control (<8%)',
      description: 'The percentage of members 18–75 years of age with diabetes (type 1 and type 2) whose most recent HbA1c level during the measurement year is <8.0% or who had an HbA1c level <8.0% and was tested in the year prior to the measurement year.',
      program: 'HEDIS',
      domain: 'EFFECTIVENESS_OF_CARE',
      version: '2024',
      effectiveDate: new Date('2024-01-01'),
      status: 'ACTIVE',
      nqfNumber: '0575',
      cmsNumber: 'ACO-37',
      steward: 'NCQA',
      reportingMethod: 'Hybrid',
      measureType: 'Process',
      nationalBenchmark: 65.8,
      targetRate: 70.0,
    },
  });

  // Value Set: Diabetes Diagnosis
  const diabetesValueSet = await prisma.valueSet.create({
    data: {
      valueSetId: '2.16.840.1.113883.3.464.1003.103.12.1001',
      name: 'Diabetes',
      description: 'ICD-10-CM codes for Type 1 and Type 2 Diabetes Mellitus',
      oid: '2.16.840.1.113883.3.464.1003.103.12.1001',
      version: '2024',
      purpose: 'Denominator',
      effectiveDate: new Date('2024-01-01'),
    },
  });

  // Add diabetes codes to value set
  const diabetesCodes = ['E10.9', 'E11.9', 'E13.9', 'E10.65', 'E11.65'];
  for (const code of diabetesCodes) {
    const codeSet = await prisma.codeSet.findFirst({
      where: { code, codeType: 'ICD_10_CM' },
    });
    
    if (codeSet) {
      await prisma.valueSetCode.create({
        data: {
          valueSetId: diabetesValueSet.id,
          codeSetId: codeSet.id,
          included: true,
          notes: 'Diabetes diagnosis code for measure eligibility',
        },
      });
    }
  }

  // Value Set: HbA1c Tests (CPT codes)
  const hba1cTestsValueSet = await prisma.valueSet.create({
    data: {
      valueSetId: '2.16.840.1.113883.3.464.1003.198.12.1013',
      name: 'HbA1c Laboratory Test',
      description: 'CPT codes for Hemoglobin A1c laboratory tests',
      oid: '2.16.840.1.113883.3.464.1003.198.12.1013',
      version: '2024',
      purpose: 'Numerator',
      effectiveDate: new Date('2024-01-01'),
    },
  });

  const hba1cCptCodes = ['83036', '83037'];
  for (const code of hba1cCptCodes) {
    const codeSet = await prisma.codeSet.findFirst({
      where: { code, codeType: 'CPT' },
    });
    
    if (codeSet) {
      await prisma.valueSetCode.create({
        data: {
          valueSetId: hba1cTestsValueSet.id,
          codeSetId: codeSet.id,
          included: true,
          notes: 'HbA1c lab test code',
        },
      });
    }
  }

  // Measure Logic for CDC-H9
  await prisma.measureLogic.createMany({
    data: [
      {
        measureId: cdcH9.id,
        logicType: 'DENOMINATOR',
        sequence: 1,
        valueSetId: diabetesValueSet.id,
        operator: 'AT_LEAST_ONE',
        ageMin: 18,
        ageMax: 75,
        criteriaJson: {
          description: 'Members 18-75 years with diabetes diagnosis',
          continuous_enrollment: 'Two years',
        },
      },
      {
        measureId: cdcH9.id,
        logicType: 'NUMERATOR',
        sequence: 1,
        valueSetId: hba1cTestsValueSet.id,
        operator: 'AT_LEAST_ONE',
        timeframeValue: 365,
        timeframeUnit: 'DAYS',
        criteriaJson: {
          description: 'HbA1c test performed with result <8%',
          result_threshold: '<8.0%',
        },
      },
      {
        measureId: cdcH9.id,
        logicType: 'EXCLUSION',
        sequence: 1,
        criteriaJson: {
          description: 'Members with polycystic ovarian syndrome or gestational/steroid-induced diabetes',
          exclusion_codes: ['E08', 'E09', 'E72.04'],
        },
      },
    ],
  });

  console.log('✅ CDC-H9 created with value sets and logic\n');

  // ============================================================================
  // MEASURE 2: COL - Colorectal Cancer Screening
  // ============================================================================
  console.log('📊 Creating HEDIS COL (Colorectal Cancer Screening)...');
  
  const col = await prisma.qualityMeasure.create({
    data: {
      measureId: 'COL',
      name: 'Colorectal Cancer Screening',
      description: 'The percentage of members 50–75 years of age who had appropriate screening for colorectal cancer.',
      program: 'HEDIS',
      domain: 'PREVENTION',
      version: '2024',
      effectiveDate: new Date('2024-01-01'),
      status: 'ACTIVE',
      nqfNumber: '0034',
      cmsNumber: 'ACO-21',
      steward: 'NCQA',
      reportingMethod: 'Administrative',
      measureType: 'Process',
      nationalBenchmark: 72.5,
      targetRate: 75.0,
    },
  });

  // Value Set: Colonoscopy
  const colonoscopyValueSet = await prisma.valueSet.create({
    data: {
      valueSetId: '2.16.840.1.113883.3.464.1003.108.12.1020',
      name: 'Colonoscopy',
      description: 'CPT codes for colonoscopy procedures',
      oid: '2.16.840.1.113883.3.464.1003.108.12.1020',
      version: '2024',
      purpose: 'Numerator',
      effectiveDate: new Date('2024-01-01'),
    },
  });

  const colonoscopyCodes = ['44388', '44389', '44390', '44391', '44392', '44394', '45355', '45378', '45380', '45384', '45385'];
  for (const code of colonoscopyCodes) {
    const codeSet = await prisma.codeSet.findFirst({
      where: { code, codeType: 'CPT' },
    });
    
    if (codeSet) {
      await prisma.valueSetCode.create({
        data: {
          valueSetId: colonoscopyValueSet.id,
          codeSetId: codeSet.id,
          included: true,
          notes: 'Colonoscopy procedure code',
        },
      });
    }
  }

  // Value Set: Fecal Occult Blood Test (FOBT)
  const fobtValueSet = await prisma.valueSet.create({
    data: {
      valueSetId: '2.16.840.1.113883.3.464.1003.198.12.1011',
      name: 'Fecal Occult Blood Test (FOBT)',
      description: 'CPT codes for fecal occult blood tests',
      oid: '2.16.840.1.113883.3.464.1003.198.12.1011',
      version: '2024',
      purpose: 'Numerator',
      effectiveDate: new Date('2024-01-01'),
    },
  });

  const fobtCodes = ['82270', '82274'];
  for (const code of fobtCodes) {
    const codeSet = await prisma.codeSet.findFirst({
      where: { code, codeType: 'CPT' },
    });
    
    if (codeSet) {
      await prisma.valueSetCode.create({
        data: {
          valueSetId: fobtValueSet.id,
          codeSetId: codeSet.id,
          included: true,
          notes: 'FOBT lab test code',
        },
      });
    }
  }

  // Measure Logic for COL
  await prisma.measureLogic.createMany({
    data: [
      {
        measureId: col.id,
        logicType: 'DENOMINATOR',
        sequence: 1,
        ageMin: 50,
        ageMax: 75,
        criteriaJson: {
          description: 'Members 50-75 years of age',
          continuous_enrollment: 'One year',
        },
      },
      {
        measureId: col.id,
        logicType: 'NUMERATOR',
        sequence: 1,
        valueSetId: colonoscopyValueSet.id,
        operator: 'AT_LEAST_ONE',
        timeframeValue: 10,
        timeframeUnit: 'YEARS',
        criteriaJson: {
          description: 'Colonoscopy within 10 years',
        },
      },
      {
        measureId: col.id,
        logicType: 'NUMERATOR',
        sequence: 2,
        valueSetId: fobtValueSet.id,
        operator: 'AT_LEAST_ONE',
        timeframeValue: 1,
        timeframeUnit: 'YEARS',
        criteriaJson: {
          description: 'FOBT within 1 year (alternative)',
        },
      },
      {
        measureId: col.id,
        logicType: 'EXCLUSION',
        sequence: 1,
        criteriaJson: {
          description: 'Members with total colectomy or colorectal cancer',
          exclusion_codes: ['C18', 'C19', 'C20', 'Z90.49'],
        },
      },
    ],
  });

  console.log('✅ COL created with value sets and logic\n');

  // ============================================================================
  // MEASURE 3: BCS - Breast Cancer Screening
  // ============================================================================
  console.log('📊 Creating HEDIS BCS (Breast Cancer Screening)...');
  
  const bcs = await prisma.qualityMeasure.create({
    data: {
      measureId: 'BCS',
      name: 'Breast Cancer Screening',
      description: 'The percentage of women 50–74 years of age who had a mammography to screen for breast cancer in the past 27 months.',
      program: 'HEDIS',
      domain: 'PREVENTION',
      version: '2024',
      effectiveDate: new Date('2024-01-01'),
      status: 'ACTIVE',
      nqfNumber: '2372',
      cmsNumber: 'ACO-18',
      steward: 'NCQA',
      reportingMethod: 'Administrative',
      measureType: 'Process',
      nationalBenchmark: 78.2,
      targetRate: 80.0,
    },
  });

  // Value Set: Mammography
  const mammographyValueSet = await prisma.valueSet.create({
    data: {
      valueSetId: '2.16.840.1.113883.3.464.1003.108.12.1018',
      name: 'Mammography',
      description: 'CPT codes for mammography screening procedures',
      oid: '2.16.840.1.113883.3.464.1003.108.12.1018',
      version: '2024',
      purpose: 'Numerator',
      effectiveDate: new Date('2024-01-01'),
    },
  });

  const mammographyCodes = ['77065', '77066', '77067'];
  for (const code of mammographyCodes) {
    const codeSet = await prisma.codeSet.findFirst({
      where: { code, codeType: 'CPT' },
    });
    
    if (codeSet) {
      await prisma.valueSetCode.create({
        data: {
          valueSetId: mammographyValueSet.id,
          codeSetId: codeSet.id,
          included: true,
          notes: 'Mammography screening code',
        },
      });
    }
  }

  // Measure Logic for BCS
  await prisma.measureLogic.createMany({
    data: [
      {
        measureId: bcs.id,
        logicType: 'DENOMINATOR',
        sequence: 1,
        ageMin: 50,
        ageMax: 74,
        gender: 'F',
        criteriaJson: {
          description: 'Women 50-74 years of age',
          continuous_enrollment: 'One year',
        },
      },
      {
        measureId: bcs.id,
        logicType: 'NUMERATOR',
        sequence: 1,
        valueSetId: mammographyValueSet.id,
        operator: 'AT_LEAST_ONE',
        timeframeValue: 27,
        timeframeUnit: 'MONTHS',
        criteriaJson: {
          description: 'Mammography within 27 months',
        },
      },
      {
        measureId: bcs.id,
        logicType: 'EXCLUSION',
        sequence: 1,
        criteriaJson: {
          description: 'Women with bilateral mastectomy or breast cancer',
          exclusion_codes: ['C50', 'Z90.1'],
        },
      },
    ],
  });

  console.log('✅ BCS created with value sets and logic\n');

  // ============================================================================
  // MEASURE 4: CBP - Controlling High Blood Pressure
  // ============================================================================
  console.log('📊 Creating HEDIS CBP (Controlling High Blood Pressure)...');
  
  const cbp = await prisma.qualityMeasure.create({
    data: {
      measureId: 'CBP',
      name: 'Controlling High Blood Pressure',
      description: 'The percentage of members 18–85 years of age who had a diagnosis of hypertension and whose most recent blood pressure was adequately controlled (<140/90 mm Hg) during the measurement year.',
      program: 'HEDIS',
      domain: 'CHRONIC_CARE',
      version: '2024',
      effectiveDate: new Date('2024-01-01'),
      status: 'ACTIVE',
      nqfNumber: '0018',
      cmsNumber: 'ACO-28',
      steward: 'NCQA',
      reportingMethod: 'Hybrid',
      measureType: 'Intermediate Outcome',
      nationalBenchmark: 63.5,
      targetRate: 70.0,
    },
  });

  // Value Set: Hypertension
  const hypertensionValueSet = await prisma.valueSet.create({
    data: {
      valueSetId: '2.16.840.1.113883.3.464.1003.104.12.1011',
      name: 'Essential Hypertension',
      description: 'ICD-10-CM codes for essential hypertension',
      oid: '2.16.840.1.113883.3.464.1003.104.12.1011',
      version: '2024',
      purpose: 'Denominator',
      effectiveDate: new Date('2024-01-01'),
    },
  });

  const hypertensionCodes = ['I10', 'I11.9', 'I12.9', 'I13.0', 'I13.10'];
  for (const code of hypertensionCodes) {
    const codeSet = await prisma.codeSet.findFirst({
      where: { code, codeType: 'ICD_10_CM' },
    });
    
    if (codeSet) {
      await prisma.valueSetCode.create({
        data: {
          valueSetId: hypertensionValueSet.id,
          codeSetId: codeSet.id,
          included: true,
          notes: 'Hypertension diagnosis code',
        },
      });
    }
  }

  // Measure Logic for CBP
  await prisma.measureLogic.createMany({
    data: [
      {
        measureId: cbp.id,
        logicType: 'DENOMINATOR',
        sequence: 1,
        valueSetId: hypertensionValueSet.id,
        operator: 'AT_LEAST_ONE',
        ageMin: 18,
        ageMax: 85,
        criteriaJson: {
          description: 'Members 18-85 years with hypertension diagnosis',
          continuous_enrollment: 'One year',
        },
      },
      {
        measureId: cbp.id,
        logicType: 'NUMERATOR',
        sequence: 1,
        timeframeValue: 365,
        timeframeUnit: 'DAYS',
        criteriaJson: {
          description: 'Most recent BP reading <140/90 mm Hg',
          systolic_threshold: '<140',
          diastolic_threshold: '<90',
        },
      },
      {
        measureId: cbp.id,
        logicType: 'EXCLUSION',
        sequence: 1,
        criteriaJson: {
          description: 'Members with ESRD, kidney transplant, or pregnancy',
          exclusion_codes: ['N18.6', 'Z94.0', 'O00-O9A'],
        },
      },
    ],
  });

  console.log('✅ CBP created with value sets and logic\n');

  // ============================================================================
  // MEASURE 5: CIS-10 - Childhood Immunization Status (Combo 10)
  // ============================================================================
  console.log('📊 Creating HEDIS CIS-10 (Childhood Immunization Status)...');
  
  const cis = await prisma.qualityMeasure.create({
    data: {
      measureId: 'CIS-10',
      name: 'Childhood Immunization Status - Combination 10',
      description: 'The percentage of children 2 years of age who had four DTaP/DT, three IPV, one MMR, three HiB, three HepB, one VZV, four pneumococcal conjugate, one HepA, two or three rotavirus, and two influenza vaccines by their second birthday.',
      program: 'HEDIS',
      domain: 'PREVENTION',
      version: '2024',
      effectiveDate: new Date('2024-01-01'),
      status: 'ACTIVE',
      nqfNumber: '0038',
      steward: 'NCQA',
      reportingMethod: 'Hybrid',
      measureType: 'Process',
      nationalBenchmark: 42.8,
      targetRate: 50.0,
    },
  });

  // Value Set: Vaccination Codes
  const vaccinationValueSet = await prisma.valueSet.create({
    data: {
      valueSetId: '2.16.840.1.113883.3.464.1003.110.12.1034',
      name: 'Childhood Vaccinations',
      description: 'CPT codes for childhood vaccination procedures',
      oid: '2.16.840.1.113883.3.464.1003.110.12.1034',
      version: '2024',
      purpose: 'Numerator',
      effectiveDate: new Date('2024-01-01'),
    },
  });

  const vaccinationCodes = ['90700', '90707', '90710', '90723', '90744', '90746'];
  for (const code of vaccinationCodes) {
    const codeSet = await prisma.codeSet.findFirst({
      where: { code, codeType: 'CPT' },
    });
    
    if (codeSet) {
      await prisma.valueSetCode.create({
        data: {
          valueSetId: vaccinationValueSet.id,
          codeSetId: codeSet.id,
          included: true,
          notes: 'Childhood vaccination code',
        },
      });
    }
  }

  // Measure Logic for CIS-10
  await prisma.measureLogic.createMany({
    data: [
      {
        measureId: cis.id,
        logicType: 'DENOMINATOR',
        sequence: 1,
        ageMin: 2,
        ageMax: 2,
        criteriaJson: {
          description: 'Children 2 years of age (24-30 months)',
          continuous_enrollment: 'Since birth',
        },
      },
      {
        measureId: cis.id,
        logicType: 'NUMERATOR',
        sequence: 1,
        valueSetId: vaccinationValueSet.id,
        operator: 'ALL',
        timeframeValue: 24,
        timeframeUnit: 'MONTHS',
        criteriaJson: {
          description: 'All required vaccines completed by 2nd birthday',
          required_vaccines: [
            '4 DTaP/DT',
            '3 IPV',
            '1 MMR',
            '3 HiB',
            '3 HepB',
            '1 VZV',
            '4 Pneumococcal',
            '1 HepA',
            '2-3 Rotavirus',
            '2 Influenza',
          ],
        },
      },
    ],
  });

  console.log('✅ CIS-10 created with value sets and logic\n');

  // ============================================================================
  // Summary
  // ============================================================================
  const totalMeasures = await prisma.qualityMeasure.count();
  const totalValueSets = await prisma.valueSet.count();
  const totalValueSetCodes = await prisma.valueSetCode.count();
  const totalMeasureLogic = await prisma.measureLogic.count();

  console.log('\n🎉 Quality Measures Seeding Complete!\n');
  console.log(`✅ Total Quality Measures: ${totalMeasures}`);
  console.log(`✅ Total Value Sets: ${totalValueSets}`);
  console.log(`✅ Total Value Set Codes: ${totalValueSetCodes}`);
  console.log(`✅ Total Measure Logic Rules: ${totalMeasureLogic}\n`);

  console.log('📊 Measures Created:');
  console.log('  1. CDC-H9 - Diabetes HbA1c Control');
  console.log('  2. COL - Colorectal Cancer Screening');
  console.log('  3. BCS - Breast Cancer Screening');
  console.log('  4. CBP - Controlling High Blood Pressure');
  console.log('  5. CIS-10 - Childhood Immunization Status\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding quality measures:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

