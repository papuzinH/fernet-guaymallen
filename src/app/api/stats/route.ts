import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Total matches
    const totalMatches = await prisma.match.count();

    // W-D-L
    const results = await prisma.match.groupBy({
      by: ['result'],
      _count: { result: true },
    });

    const wdl = {
      wins: results.find(r => r.result === 'WIN')?._count.result || 0,
      draws: results.find(r => r.result === 'DRAW')?._count.result || 0,
      losses: results.find(r => r.result === 'LOSS')?._count.result || 0,
    };

    // Goals
    const goals = await prisma.match.aggregate({
      _sum: {
        ourScore: true,
        theirScore: true,
      },
    });

    // Top scorer
    const topScorer = await prisma.appearance.groupBy({
      by: ['playerId'],
      _sum: { goals: true },
      orderBy: { _sum: { goals: 'desc' } },
      take: 1,
    });

    let topScorerName = null;
    if (topScorer.length > 0) {
      const player = await prisma.player.findUnique({
        where: { id: topScorer[0].playerId },
        select: { fullName: true },
      });
      topScorerName = `${player?.fullName} (${topScorer[0]._sum.goals})`;
    }

    // Streak (last 5 matches)
    const last5Matches = await prisma.match.findMany({
      orderBy: { date: 'desc' },
      take: 5,
      select: { result: true },
    });

    const streak = last5Matches.map(m => m.result).reverse();

    // Last 5 matches with details
    const last5 = await prisma.match.findMany({
      orderBy: { date: 'desc' },
      take: 5,
      include: {
        tournament: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({
      totalMatches,
      wdl,
      goalsFor: goals._sum.ourScore || 0,
      goalsAgainst: goals._sum.theirScore || 0,
      topScorer: topScorerName,
      streak,
      last5Matches: last5,
    });
  } catch (error) {
    console.error('Stats API error:', error);
    // Return default values if DB fails
    return NextResponse.json({
      totalMatches: 0,
      wdl: { wins: 0, draws: 0, losses: 0 },
      goalsFor: 0,
      goalsAgainst: 0,
      topScorer: null,
      streak: [],
      last5Matches: [],
    });
  }
}