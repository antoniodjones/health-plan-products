/**
 * API Route: Equivalency Mappings
 * Handle CRUD operations for equivalency mappings
 */
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Prisma client singleton
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * POST - Create new equivalency mapping
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { equivalencyId, sourceCodeId, targetCodeId, relationship, bidirectional } = body;

    // Validate required fields
    if (!equivalencyId || !sourceCodeId || !targetCodeId || !relationship) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the mapping
    const mapping = await prisma.equivalencyMapping.create({
      data: {
        equivalencyId,
        sourceCodeId,
        targetCodeId,
        relationship,
        bidirectional: bidirectional ?? true,
      },
      include: {
        equivalency: true,
        sourceCode: true,
        targetCode: true,
      },
    });

    return NextResponse.json(mapping, { status: 201 });
  } catch (error) {
    console.error('Error creating equivalency mapping:', error);
    return NextResponse.json(
      { error: 'Failed to create equivalency mapping' },
      { status: 500 }
    );
  }
}

/**
 * GET - List all equivalency mappings
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const equivalencyId = searchParams.get('equivalencyId');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '25');
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: any = {};
    if (equivalencyId) {
      where.equivalencyId = equivalencyId;
    }

    // Fetch mappings
    const [mappings, total] = await Promise.all([
      prisma.equivalencyMapping.findMany({
        where,
        include: {
          equivalency: true,
          sourceCode: {
            select: {
              id: true,
              code: true,
              codeType: true,
              description: true,
              category: true,
            },
          },
          targetCode: {
            select: {
              id: true,
              code: true,
              codeType: true,
              description: true,
              category: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.equivalencyMapping.count({ where }),
    ]);

    return NextResponse.json({
      mappings,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Error fetching equivalency mappings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch equivalency mappings' },
      { status: 500 }
    );
  }
}

