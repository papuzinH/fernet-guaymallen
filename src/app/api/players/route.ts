import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const position = searchParams.get('position') || '';
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const whereClause: any = {
      AND: [],
    };

    if (activeOnly) {
      whereClause.AND.push({ isActive: true });
    }

    if (position) {
      whereClause.AND.push({ position: position });
    }

    if (search) {
      whereClause.AND.push({
        OR: [
          { fullName: { contains: search, mode: 'insensitive' as const } },
          { nickname: { contains: search, mode: 'insensitive' as const } },
        ],
      });
    }

    if (whereClause.AND.length === 0) {
      delete whereClause.AND;
    }

    const players = await prisma.player.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            appearances: true,
          },
        },
      },
      orderBy: [
        { isActive: 'desc' },
        { fullName: 'asc' },
      ],
    });

    // Calculate basic stats for each player
    const playersWithStats = await Promise.all(
      players.map(async (player) => {
        const stats = await prisma.appearance.aggregate({
          where: { playerId: player.id },
          _sum: {
            minutes: true,
            goals: true,
            assists: true,
          },
          _count: {
            _all: true,
            motm: true,
          },
        });

        // Count yellow and red cards separately since they're booleans
        const cardStats = await prisma.appearance.aggregate({
          where: { playerId: player.id },
          _count: {
            yellow: true,
            red: true,
          },
        });

        const totalGoals = stats._sum?.goals || 0;
        const totalAssists = stats._sum?.assists || 0;
        const totalMinutes = stats._sum?.minutes || 0;
        const totalYellowCards = cardStats._count?.yellow || 0;
        const totalRedCards = cardStats._count?.red || 0;
        const totalAppearances = stats._count?._all || 0;
        const motmCount = stats._count?.motm || 0;

        return {
          ...player,
          stats: {
            appearances: totalAppearances,
            goals: totalGoals,
            assists: totalAssists,
            yellowCards: totalYellowCards,
            redCards: totalRedCards,
            motm: motmCount,
            goalsPerMatch: totalAppearances > 0 ? (totalGoals / totalAppearances).toFixed(2) : '0.00',
            minutesPlayed: totalMinutes,
          },
        };
      })
    );

    return NextResponse.json(playersWithStats);
  } catch (error) {
    console.error('Players API error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}