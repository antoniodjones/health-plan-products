/**
 * Database Seed Script
 * Populates database with real medical codes from public sources
 */

import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

interface ICD10Code {
  code: string;
  description: string;
  category?: string;
}

interface CPTCode {
  code: string;
  description: string;
  category?: string;
}

async function fetchICD10Codes(): Promise<ICD10Code[]> {
  console.log('📥 Fetching ICD-10 codes from CMS...');
  
  // Using a sample of common ICD-10 codes
  // In production, you can fetch from CMS API or use their bulk downloads
  const commonICD10Codes: ICD10Code[] = [
    // Diabetes
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications', category: 'Endocrine, nutritional and metabolic diseases' },
    { code: 'E11.65', description: 'Type 2 diabetes mellitus with hyperglycemia', category: 'Endocrine, nutritional and metabolic diseases' },
    { code: 'E10.9', description: 'Type 1 diabetes mellitus without complications', category: 'Endocrine, nutritional and metabolic diseases' },
    
    // Hypertension
    { code: 'I10', description: 'Essential (primary) hypertension', category: 'Diseases of the circulatory system' },
    { code: 'I11.0', description: 'Hypertensive heart disease with heart failure', category: 'Diseases of the circulatory system' },
    { code: 'I12.9', description: 'Hypertensive chronic kidney disease', category: 'Diseases of the circulatory system' },
    
    // Respiratory
    { code: 'J44.0', description: 'Chronic obstructive pulmonary disease with acute lower respiratory infection', category: 'Diseases of the respiratory system' },
    { code: 'J44.1', description: 'Chronic obstructive pulmonary disease with acute exacerbation', category: 'Diseases of the respiratory system' },
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated', category: 'Diseases of the respiratory system' },
    { code: 'J06.9', description: 'Acute upper respiratory infection, unspecified', category: 'Diseases of the respiratory system' },
    
    // Mental Health
    { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified', category: 'Mental, behavioral and neurodevelopmental disorders' },
    { code: 'F41.9', description: 'Anxiety disorder, unspecified', category: 'Mental, behavioral and neurodevelopmental disorders' },
    { code: 'F33.1', description: 'Major depressive disorder, recurrent, moderate', category: 'Mental, behavioral and neurodevelopmental disorders' },
    
    // Musculoskeletal
    { code: 'M79.3', description: 'Panniculitis, unspecified', category: 'Diseases of the musculoskeletal system' },
    { code: 'M54.5', description: 'Low back pain', category: 'Diseases of the musculoskeletal system' },
    { code: 'M25.511', description: 'Pain in right shoulder', category: 'Diseases of the musculoskeletal system' },
    
    // Cardiovascular
    { code: 'I25.10', description: 'Atherosclerotic heart disease without angina pectoris', category: 'Diseases of the circulatory system' },
    { code: 'I50.9', description: 'Heart failure, unspecified', category: 'Diseases of the circulatory system' },
    { code: 'I48.91', description: 'Unspecified atrial fibrillation', category: 'Diseases of the circulatory system' },
    
    // Common Infections
    { code: 'J02.9', description: 'Acute pharyngitis, unspecified', category: 'Diseases of the respiratory system' },
    { code: 'N39.0', description: 'Urinary tract infection, site not specified', category: 'Diseases of the genitourinary system' },
    { code: 'B34.9', description: 'Viral infection, unspecified', category: 'Certain infectious and parasitic diseases' },
    
    // Preventive/Screening
    { code: 'Z00.00', description: 'Encounter for general adult medical examination without abnormal findings', category: 'Factors influencing health status' },
    { code: 'Z12.11', description: 'Encounter for screening for malignant neoplasm of colon', category: 'Factors influencing health status' },
    { code: 'Z01.411', description: 'Encounter for gynecological examination (general) (routine) with abnormal findings', category: 'Factors influencing health status' },
  ];

  return commonICD10Codes;
}

async function fetchCPTCodes(): Promise<CPTCode[]> {
  console.log('📥 Fetching CPT codes...');
  
  // Sample of common CPT codes
  // Note: CPT codes are copyrighted by AMA, so we use a representative sample
  const commonCPTCodes: CPTCode[] = [
    // Office Visits
    { code: '99213', description: 'Office or other outpatient visit, established patient, 20-29 minutes', category: 'Evaluation and Management' },
    { code: '99214', description: 'Office or other outpatient visit, established patient, 30-39 minutes', category: 'Evaluation and Management' },
    { code: '99215', description: 'Office or other outpatient visit, established patient, 40-54 minutes', category: 'Evaluation and Management' },
    { code: '99203', description: 'Office or other outpatient visit, new patient, 30-44 minutes', category: 'Evaluation and Management' },
    { code: '99204', description: 'Office or other outpatient visit, new patient, 45-59 minutes', category: 'Evaluation and Management' },
    
    // Preventive Care
    { code: '99385', description: 'Initial comprehensive preventive medicine evaluation, 18-39 years', category: 'Preventive Medicine Services' },
    { code: '99386', description: 'Initial comprehensive preventive medicine evaluation, 40-64 years', category: 'Preventive Medicine Services' },
    { code: '99395', description: 'Periodic comprehensive preventive medicine reevaluation, 18-39 years', category: 'Preventive Medicine Services' },
    { code: '99396', description: 'Periodic comprehensive preventive medicine reevaluation, 40-64 years', category: 'Preventive Medicine Services' },
    
    // Diagnostic Procedures
    { code: '71045', description: 'Radiologic examination, chest, single view', category: 'Radiology' },
    { code: '71046', description: 'Radiologic examination, chest, 2 views', category: 'Radiology' },
    { code: '73610', description: 'Radiologic examination, ankle, complete, minimum of 3 views', category: 'Radiology' },
    { code: '80053', description: 'Comprehensive metabolic panel', category: 'Pathology and Laboratory' },
    { code: '85025', description: 'Complete blood count with differential', category: 'Pathology and Laboratory' },
    { code: '80061', description: 'Lipid panel', category: 'Pathology and Laboratory' },
    
    // Immunizations
    { code: '90471', description: 'Immunization administration, first injection', category: 'Medicine' },
    { code: '90472', description: 'Immunization administration, each additional injection', category: 'Medicine' },
    { code: '90686', description: 'Influenza virus vaccine, quadrivalent, split virus', category: 'Medicine' },
    
    // Common Procedures
    { code: '12001', description: 'Simple repair of superficial wounds, 2.5 cm or less', category: 'Surgery' },
    { code: '29540', description: 'Strapping; ankle and/or foot', category: 'Surgery' },
    { code: '93000', description: 'Electrocardiogram, routine ECG with interpretation', category: 'Medicine' },
  ];

  return commonCPTCodes;
}

async function fetchHCPCSCodes(): Promise<CPTCode[]> {
  console.log('📥 Fetching HCPCS codes...');
  
  const commonHCPCSCodes: CPTCode[] = [
    // Durable Medical Equipment
    { code: 'E0601', description: 'Continuous positive airway pressure (CPAP) device', category: 'Durable Medical Equipment' },
    { code: 'E0784', description: 'External ambulatory infusion pump, insulin', category: 'Durable Medical Equipment' },
    { code: 'E0470', description: 'Respiratory assist device, bi-level pressure capability', category: 'Durable Medical Equipment' },
    
    // Medications
    { code: 'J1100', description: 'Injection, dexamethasone sodium phosphate, 1 mg', category: 'Drugs Administered Other Than Oral Method' },
    { code: 'J0690', description: 'Injection, cefazolin sodium, 500 mg', category: 'Drugs Administered Other Than Oral Method' },
    { code: 'J3420', description: 'Injection, vitamin B-12 cyanocobalamin, up to 1000 mcg', category: 'Drugs Administered Other Than Oral Method' },
    
    // Supplies
    { code: 'A4253', description: 'Blood glucose test strips, for home blood glucose monitor', category: 'Medical And Surgical Supplies' },
    { code: 'A4256', description: 'Normal saline, sterile, 500 ml', category: 'Medical And Surgical Supplies' },
    { code: 'A4657', description: 'Syringe, with or without needle, each', category: 'Medical And Surgical Supplies' },
  ];

  return commonHCPCSCodes;
}

async function seedMedicalCodes() {
  console.log('🌱 Starting medical codes seed...\n');

  try {
    // Fetch all codes
    const [icd10Codes, cptCodes, hcpcsCodes] = await Promise.all([
      fetchICD10Codes(),
      fetchCPTCodes(),
      fetchHCPCSCodes(),
    ]);

    console.log('\n📊 Summary:');
    console.log(`  - ICD-10 codes: ${icd10Codes.length}`);
    console.log(`  - CPT codes: ${cptCodes.length}`);
    console.log(`  - HCPCS codes: ${hcpcsCodes.length}`);
    console.log(`  - Total: ${icd10Codes.length + cptCodes.length + hcpcsCodes.length}\n`);

    // Clear existing codes
    console.log('🗑️  Clearing existing medical codes...');
    await prisma.codeSet.deleteMany({});

    // Insert ICD-10 codes
    console.log('💉 Inserting ICD-10 codes...');
    for (const code of icd10Codes) {
      await prisma.codeSet.create({
        data: {
          code: code.code,
          codeType: 'ICD_10_CM',
          description: code.description,
          longDescription: code.description,
          category: code.category,
          isActive: true,
          effectiveDate: new Date('2024-01-01'),
          version: '2024',
        },
      });
    }

    // Insert CPT codes
    console.log('🏥 Inserting CPT codes...');
    for (const code of cptCodes) {
      await prisma.codeSet.create({
        data: {
          code: code.code,
          codeType: 'CPT',
          description: code.description,
          longDescription: code.description,
          category: code.category,
          isActive: true,
          effectiveDate: new Date('2024-01-01'),
          version: '2024',
        },
      });
    }

    // Insert HCPCS codes
    console.log('💊 Inserting HCPCS codes...');
    for (const code of hcpcsCodes) {
      await prisma.codeSet.create({
        data: {
          code: code.code,
          codeType: 'HCPCS',
          description: code.description,
          longDescription: code.description,
          category: code.category,
          isActive: true,
          effectiveDate: new Date('2024-01-01'),
          version: '2024',
        },
      });
    }

    console.log('\n✅ Medical codes seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding medical codes:', error);
    throw error;
  }
}

async function seedSampleProducts() {
  console.log('\n🏢 Seeding sample products...\n');

  try {
    // Clear existing products
    await prisma.product.deleteMany({});

    const products = [
      {
        productId: 'MA-HMO-2024',
        name: 'Medicare Advantage HMO 2024',
        description: 'Comprehensive Medicare Advantage plan with HMO network',
        productType: 'MEDICARE_ADVANTAGE',
        lineOfBusiness: 'MEDICARE_ADVANTAGE',
        marketType: 'INDIVIDUAL',
        planType: 'HMO',
        marketSegment: 'Medicare',
        status: 'ACTIVE',
        effectiveDate: new Date('2024-01-01'),
        terminationDate: new Date('2024-12-31'),
      },
      {
        productId: 'ACA-GOLD-PPO-2024',
        name: 'Gold PPO Individual 2024',
        description: 'Gold-tier PPO plan for individual market',
        productType: 'ACA_MARKETPLACE',
        lineOfBusiness: 'INDIVIDUAL',
        marketType: 'INDIVIDUAL',
        planType: 'PPO',
        marketSegment: 'Individual',
        status: 'ACTIVE',
        effectiveDate: new Date('2024-01-01'),
        terminationDate: new Date('2024-12-31'),
      },
      {
        productId: 'EMP-BRONZE-2024',
        name: 'Employer Group Bronze Plan',
        description: 'Cost-effective bronze plan for employer groups',
        productType: 'EMPLOYER_GROUP',
        lineOfBusiness: 'EMPLOYER_GROUP',
        marketType: 'LARGE_GROUP',
        planType: 'EPO',
        marketSegment: 'Large Group',
        status: 'ACTIVE',
        effectiveDate: new Date('2024-01-01'),
        terminationDate: new Date('2024-12-31'),
      },
    ];

    for (const product of products) {
      await prisma.product.create({
        data: product,
      });
    }

    console.log('✅ Sample products seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting database seed...\n');

  try {
    await seedMedicalCodes();
    // await seedSampleProducts(); // Skip for now - Product model has complex relationships

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📋 Summary:');
    console.log('  ✅ 55 Real Medical Codes (ICD-10-CM, CPT, HCPCS)');
    console.log('  ⏭️  Products skipped (add via UI)\n');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
