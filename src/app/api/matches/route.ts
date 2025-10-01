import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tournament = searchParams.get('tournament');
    const season = searchParams.get('season');
    const result = searchParams.get('result');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {};
    if (tournament) where.tournament = { name: tournament };
    if (season) where.tournament = { ...where.tournament, season };
    if (result) where.result = result;

    const total = await prisma.match.count({ where });

    const matches = await prisma.match.findMany({
      where,
      include: {
        tournament: {
          select: { name: true, season: true }
        }
      },
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      matches,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Matches API error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}