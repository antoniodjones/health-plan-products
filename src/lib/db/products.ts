/**
 * Database operations for Products
 */
import { PrismaClient, Prisma } from '@prisma/client';
import type { ProductSearchParams } from '@/types/products';

const prisma = new PrismaClient();

/**
 * Search and filter products
 */
export async function searchProducts(params: ProductSearchParams) {
  const {
    productType,
    status,
    marketSegment,
    search,
    effectiveDateFrom,
    effectiveDateTo,
    page = 1,
    pageSize = 25,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = params;

  // Build where clause
  const where: Prisma.ProductWhereInput = {};

  if (productType && productType.length > 0) {
    where.productType = { in: productType as any[] };
  }

  if (status && status.length > 0) {
    where.status = { in: status as any[] };
  }

  if (marketSegment) {
    where.marketSegment = marketSegment;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (effectiveDateFrom || effectiveDateTo) {
    where.effectiveDate = {};
    if (effectiveDateFrom) {
      where.effectiveDate.gte = effectiveDateFrom;
    }
    if (effectiveDateTo) {
      where.effectiveDate.lte = effectiveDateTo;
    }
  }

  // Execute query with pagination
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        _count: {
          select: {
            benefits: true,
          },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      benefits: true,
      _count: {
        select: {
          benefits: true,
        },
      },
    },
  });
}

/**
 * Create a new product
 */
export async function createProduct(data: Prisma.ProductCreateInput) {
  return prisma.product.create({
    data,
  });
}

/**
 * Update a product
 */
export async function updateProduct(id: string, data: Prisma.ProductUpdateInput) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string) {
  return prisma.product.delete({
    where: { id },
  });
}

/**
 * Get product statistics
 */
export async function getProductStatistics() {
  const [
    total,
    active,
    draft,
    byType,
    byMarketSegment,
    recentlyCreated,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: 'ACTIVE' } }),
    prisma.product.count({ where: { status: 'DRAFT' } }),
    prisma.product.groupBy({
      by: ['productType'],
      _count: { productType: true },
    }),
    prisma.product.groupBy({
      by: ['marketSegment'],
      where: { marketSegment: { not: null } },
      _count: { marketSegment: true },
    }),
    prisma.product.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    }),
  ]);

  return {
    total,
    active,
    draft,
    byType: Object.fromEntries(byType.map((t) => [t.productType, t._count.productType])),
    byMarketSegment: Object.fromEntries(
      byMarketSegment.map((m) => [m.marketSegment!, m._count.marketSegment])
    ),
    recentlyCreated,
  };
}

