import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const playerId = parseInt(id);

    const player = await prisma.player.findUnique({
      where: { id: playerId },
    });

    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    // Get all appearances with match details
    const appearances = await prisma.appearance.findMany({
      where: { playerId },
      include: {
        match: {
          include: {
            tournament: true,
          },
        },
      },
      orderBy: {
        match: {
          date: 'desc',
        },
      },
    });

    // Calculate comprehensive stats
    const stats = await prisma.appearance.aggregate({
      where: { playerId },
      _sum: {
        minutes: true,
        goals: true,
        assists: true,
      },
      _count: {
        _all: true,
        motm: true,
        isStarter: true,
      },
    });

    // Count yellow and red cards
    const cardStats = await prisma.appearance.aggregate({
      where: { playerId },
      _count: {
        yellow: true,
        red: true,
      },
    });

    // Get last 10 matches for timeline
    const last10Appearances = appearances.slice(0, 10);

    const totalGoals = stats._sum?.goals || 0;
    const totalAssists = stats._sum?.assists || 0;
    const totalMinutes = stats._sum?.minutes || 0;
    const totalYellowCards = cardStats._count?.yellow || 0;
    const totalRedCards = cardStats._count?.red || 0;
    const totalAppearances = stats._count?._all || 0;
    const motmCount = stats._count?.motm || 0;
    const starterCount = stats._count?.isStarter || 0;

    const playerWithStats = {
      ...player,
      stats: {
        appearances: totalAppearances,
        goals: totalGoals,
        assists: totalAssists,
        yellowCards: totalYellowCards,
        redCards: totalRedCards,
        motm: motmCount,
        starters: starterCount,
        substitutes: totalAppearances - starterCount,
        goalsPerMatch: totalAppearances > 0 ? (totalGoals / totalAppearances).toFixed(2) : '0.00',
        assistsPerMatch: totalAppearances > 0 ? (totalAssists / totalAppearances).toFixed(2) : '0.00',
        minutesPlayed: totalMinutes,
        averageMinutes: totalAppearances > 0 ? Math.round(totalMinutes / totalAppearances) : 0,
      },
      appearances,
      last10Matches: last10Appearances.map(app => ({
        id: app.id,
        matchId: app.matchId,
        date: app.match.date,
        opponent: app.match.opponent,
        result: app.match.result,
        ourScore: app.match.ourScore,
        theirScore: app.match.theirScore,
        tournament: app.match.tournament?.name,
        season: app.match.tournament?.season,
        isStarter: app.isStarter,
        minutes: app.minutes,
        goals: app.goals,
        assists: app.assists,
        yellow: app.yellow,
        red: app.red,
        motm: app.motm,
      })),
    };

    return NextResponse.json(playerWithStats);
  } catch (error) {
    console.error('Player detail API error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}