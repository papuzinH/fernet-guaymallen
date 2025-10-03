import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
            goals: true,
            assists: true,
          },
          _count: {
            _all: true,
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
        const totalYellowCards = cardStats._count?.yellow || 0;
        const totalRedCards = cardStats._count?.red || 0;
        const totalAppearances = stats._count?._all || 0;

        return {
          ...player,
          stats: {
            appearances: totalAppearances,
            goals: totalGoals,
            assists: totalAssists,
            yellowCards: totalYellowCards,
            redCards: totalRedCards,
            goalsPerMatch: totalAppearances > 0 ? (totalGoals / totalAppearances).toFixed(2) : '0.00',
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, nickname, position, birthDate, bio, dorsal } = body;

    // Validaciones básicas
    if (!fullName?.trim()) {
      return NextResponse.json({ error: 'El nombre completo es requerido' }, { status: 400 });
    }

    if (!position) {
      return NextResponse.json({ error: 'La posición es requerida' }, { status: 400 });
    }

    // Crear el jugador paso a paso
    const playerData: any = {
      fullName: fullName.trim(),
      position: position,
    };

    // Agregar campos opcionales solo si existen
    if (nickname?.trim()) {
      playerData.nickname = nickname.trim();
    }

    if (bio?.trim()) {
      playerData.bio = bio.trim();
    }

    if (birthDate) {
      playerData.birthDate = new Date(birthDate);
    }

    if (dorsal) {
      playerData.dorsal = parseInt(dorsal);
    }

    const player = await prisma.player.create({
      data: playerData,
    });

    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    console.error('Error creating player:', error);
    return NextResponse.json({ 
      error: 'Error al crear el jugador',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}