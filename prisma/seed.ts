import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create test organization
  const org = await prisma.organization.upsert({
    where: { id: 'org-1' },
    update: {},
    create: {
      id: 'org-1',
      name: 'Sample Health Plan',
      type: 'HEALTH_PLAN',
      domain: 'samplehealthplan.com',
    },
  })
  console.log('✅ Created organization:', org.name)

  // Create test users
  const adminPassword = await bcrypt.hash('password123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@samplehealthplan.com' },
    update: {},
    create: {
      id: 'user-admin',
      email: 'admin@samplehealthplan.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      organizationId: org.id,
    },
  })

  const productManager = await prisma.user.upsert({
    where: { email: 'pm@samplehealthplan.com' },
    update: {},
    create: {
      id: 'user-pm',
      email: 'pm@samplehealthplan.com',
      passwordHash: adminPassword,
      firstName: 'Product',
      lastName: 'Manager',
      role: 'PRODUCT_MANAGER',
      organizationId: org.id,
    },
  })
  console.log('✅ Created users:', admin.email, productManager.email)

  // Create sample benefit segments
  const benefitSegments = [
    {
      name: 'Primary Care Visit',
      category: 'OFFICE_VISITS',
      displayOrder: 1,
      description: 'Visits to primary care physician',
      isEssentialBenefit: true,
    },
    {
      name: 'Specialist Visit',
      category: 'SPECIALIST_VISITS',
      displayOrder: 2,
      description: 'Visits to specialist physicians',
      isEssentialBenefit: true,
    },
    {
      name: 'Emergency Room',
      category: 'EMERGENCY_CARE',
      displayOrder: 3,
      description: 'Emergency room services',
      isEssentialBenefit: true,
    },
    {
      name: 'Hospital Inpatient',
      category: 'HOSPITAL_INPATIENT',
      displayOrder: 4,
      description: 'Inpatient hospital care',
      isEssentialBenefit: true,
    },
    {
      name: 'Preventive Care',
      category: 'PREVENTIVE_CARE',
      displayOrder: 5,
      description: 'Annual physicals, screenings, immunizations',
      isEssentialBenefit: true,
    },
  ]

  for (const segment of benefitSegments) {
    await prisma.benefitSegment.upsert({
      where: { name_category: { name: segment.name, category: segment.category } },
      update: {},
      create: segment,
    })
  }
  console.log('✅ Created', benefitSegments.length, 'benefit segments')

  // Create sample code sets (a few examples)
  const codeSets = [
    {
      code: '99213',
      codeType: 'CPT',
      description: 'Office visit, established patient',
      longDescription: 'Office or other outpatient visit for evaluation and management',
      category: 'Office Visits',
      effectiveDate: new Date('2020-01-01'),
      sourceSystem: 'AMA',
    },
    {
      code: '99214',
      codeType: 'CPT',
      description: 'Office visit, established patient, moderate complexity',
      longDescription: 'Office visit for established patient, typically 30 minutes',
      category: 'Office Visits',
      effectiveDate: new Date('2020-01-01'),
      sourceSystem: 'AMA',
    },
    {
      code: '99281',
      codeType: 'CPT',
      description: 'Emergency department visit, minor',
      longDescription: 'Emergency room visit for minor problem',
      category: 'Emergency Services',
      effectiveDate: new Date('2020-01-01'),
      sourceSystem: 'CMS',
    },
  ]

  for (const codeSet of codeSets) {
    await prisma.codeSet.upsert({
      where: {
        code_codeType_version: {
          code: codeSet.code,
          codeType: codeSet.codeType as any,
          version: '1.0',
        },
      },
      update: {},
      create: codeSet,
    })
  }
  console.log('✅ Created', codeSets.length, 'code sets')

  // Create sample product
  const product = await prisma.product.upsert({
    where: { productId: 'GOLD-PPO-2026-CA' },
    update: {},
    create: {
      productId: 'GOLD-PPO-2026-CA',
      name: 'Gold PPO 2026 - California',
      description: 'Comprehensive Gold-tier PPO plan for California',
      lineOfBusiness: 'COMMERCIAL',
      marketType: 'INDIVIDUAL',
      planType: 'PPO',
      metalTier: 'GOLD',
      states: ['CA'],
      effectiveDate: new Date('2026-01-01'),
      status: 'DRAFT',
      actuarialValue: 0.80,
      organizationId: org.id,
      createdById: productManager.id,
    },
  })
  console.log('✅ Created sample product:', product.name)

  // Create sample plan under product
  const plan = await prisma.plan.upsert({
    where: { planId: 'GOLD-PPO-2026-CA-001' },
    update: {},
    create: {
      planId: 'GOLD-PPO-2026-CA-001',
      name: 'Gold PPO - Los Angeles',
      productId: product.id,
      state: 'CA',
      counties: ['Los Angeles', 'Orange', 'San Diego'],
      networkType: 'BROAD',
      requiresPCP: false,
      requiresReferral: false,
    },
  })
  console.log('✅ Created sample plan:', plan.name)

  // Create benefit package
  const benefitPackage = await prisma.benefitPackage.create({
    data: {
      name: 'Gold PPO Medical Benefits',
      planId: plan.id,
      packageType: 'MEDICAL',
      deductibleIndividual: 1500,
      deductibleFamily: 3000,
      oopMaxIndividual: 6000,
      oopMaxFamily: 12000,
    },
  })
  console.log('✅ Created benefit package:', benefitPackage.name)

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

