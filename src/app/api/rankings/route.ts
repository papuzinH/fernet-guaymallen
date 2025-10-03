import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Rankings API - returns different types of rankings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'goals';
    const limit = parseInt(searchParams.get('limit') || '10');

    let rankings;

    switch (type) {
      case 'goals':
        rankings = await getTopScorers(limit);
        break;
      case 'appearances':
        rankings = await getMostAppearances(limit);
        break;
      case 'assists':
        rankings = await getTopAssists(limit);
        break;
      case 'fairplay':
        rankings = await getFairPlayRanking(limit);
        break;
      case 'performance':
        rankings = await getPerformanceRanking(limit);
        break;
      default:
        rankings = await getTopScorers(limit);
    }

    return NextResponse.json(rankings);
  } catch (error) {
    console.error('Rankings API error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// Top scorers ranking
async function getTopScorers(limit: number) {
  const players = await prisma.player.findMany({
    include: {
      appearances: {
        select: {
          goals: true,
          match: {
            select: {
              date: true,
            },
          },
        },
      },
    },
  });

  const rankings = players
    .map(player => {
      const totalGoals = player.appearances.reduce((sum, app) => sum + app.goals, 0);
      const appearances = player.appearances.length;

      // Calculate recent performance (last 5 matches)
      const recentMatches = player.appearances
        .sort((a, b) => new Date(b.match.date).getTime() - new Date(a.match.date).getTime())
        .slice(0, 5);
      const recentGoals = recentMatches.reduce((sum, app) => sum + app.goals, 0);
      const trend = recentGoals > 2 ? 'up' : recentGoals < 1 ? 'down' : 'stable';

      return {
        id: player.id,
        name: player.fullName,
        nickname: player.nickname,
        position: player.position,
        dorsal: player.dorsal,
        value: totalGoals,
        appearances,
        average: appearances > 0 ? (totalGoals / appearances).toFixed(2) : '0.00',
        trend,
        isActive: player.isActive,
      };
    })
    .filter(player => player.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);

  return rankings;
}

// Most appearances ranking
async function getMostAppearances(limit: number) {
  const players = await prisma.player.findMany({
    include: {
      _count: {
        select: {
          appearances: true,
        },
      },
      appearances: {
        select: {
          match: {
            select: {
              date: true,
            },
          },
        },
        orderBy: {
          match: {
            date: 'desc',
          },
        },
        take: 5,
      },
    },
  });

  const rankings = players
    .map(player => {
      const appearances = player._count.appearances;
      const recentAppearances = player.appearances.length;
      const trend = recentAppearances >= 3 ? 'up' : recentAppearances <= 1 ? 'down' : 'stable';

      return {
        id: player.id,
        name: player.fullName,
        nickname: player.nickname,
        position: player.position,
        dorsal: player.dorsal,
        value: appearances,
        trend,
        isActive: player.isActive,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);

  return rankings;
}

// Top assists ranking
async function getTopAssists(limit: number) {
  const players = await prisma.player.findMany({
    include: {
      appearances: {
        select: {
          assists: true,
          match: {
            select: {
              date: true,
            },
          },
        },
      },
    },
  });

  const rankings = players
    .map(player => {
      const totalAssists = player.appearances.reduce((sum, app) => sum + (app.assists || 0), 0);
      const appearances = player.appearances.length;

      // Calculate recent performance (last 5 matches)
      const recentMatches = player.appearances
        .sort((a, b) => new Date(b.match.date).getTime() - new Date(a.match.date).getTime())
        .slice(0, 5);
      const recentAssists = recentMatches.reduce((sum, app) => sum + (app.assists || 0), 0);
      const trend = recentAssists > 1 ? 'up' : recentAssists === 0 ? 'down' : 'stable';

      return {
        id: player.id,
        name: player.fullName,
        nickname: player.nickname,
        position: player.position,
        dorsal: player.dorsal,
        value: totalAssists,
        appearances,
        average: appearances > 0 ? (totalAssists / appearances).toFixed(2) : '0.00',
        trend,
        isActive: player.isActive,
      };
    })
    .filter(player => player.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);

  return rankings;
}

// Fair play ranking (least cards per match)
async function getFairPlayRanking(limit: number) {
  const players = await prisma.player.findMany({
    include: {
      appearances: {
        select: {
          yellow: true,
          red: true,
          match: {
            select: {
              date: true,
            },
          },
        },
      },
    },
  });

  const rankings = players
    .map(player => {
      const appearances = player.appearances.length;
      const totalCards = player.appearances.reduce((sum, app) => sum + (app.yellow ? 1 : 0) + (app.red ? 1 : 0), 0);

      if (appearances === 0) return null;

      const cardsPerMatch = totalCards / appearances;

      // Calculate recent performance (last 5 matches)
      const recentMatches = player.appearances
        .sort((a, b) => new Date(b.match.date).getTime() - new Date(a.match.date).getTime())
        .slice(0, 5);
      const recentCards = recentMatches.reduce((sum, app) => sum + (app.yellow ? 1 : 0) + (app.red ? 1 : 0), 0);
      const trend = recentCards === 0 ? 'up' : recentCards > 1 ? 'down' : 'stable';

      return {
        id: player.id,
        name: player.fullName,
        nickname: player.nickname,
        position: player.position,
        dorsal: player.dorsal,
        value: cardsPerMatch,
        displayValue: cardsPerMatch.toFixed(2),
        appearances,
        totalCards,
        trend,
        isActive: player.isActive,
      };
    })
    .filter(player => player !== null)
    .sort((a, b) => (a?.value || 0) - (b?.value || 0)) // Lower is better
    .slice(0, limit);

  return rankings;
}

// Performance ranking (points per match based on goals, assists)
async function getPerformanceRanking(limit: number) {
  const players = await prisma.player.findMany({
    include: {
      appearances: {
        select: {
          goals: true,
          assists: true,
          match: {
            select: {
              date: true,
            },
          },
        },
      },
    },
  });

  const rankings = players
    .map(player => {
      const appearances = player.appearances.length;

      if (appearances === 0) return null;

      // Calculate performance points: goals (3pts), assists (2pts)
      const totalPoints = player.appearances.reduce((sum, app) => {
        return sum + (app.goals * 3) + ((app.assists || 0) * 2);
      }, 0);

      const pointsPerMatch = totalPoints / appearances;

      // Calculate recent performance (last 5 matches)
      const recentMatches = player.appearances
        .sort((a, b) => new Date(b.match.date).getTime() - new Date(a.match.date).getTime())
        .slice(0, 5);
      const recentPoints = recentMatches.reduce((sum, app) => {
        return sum + (app.goals * 3) + ((app.assists || 0) * 2);
      }, 0);
      const trend = recentPoints > 8 ? 'up' : recentPoints < 3 ? 'down' : 'stable';

      return {
        id: player.id,
        name: player.fullName,
        nickname: player.nickname,
        position: player.position,
        dorsal: player.dorsal,
        value: pointsPerMatch,
        displayValue: pointsPerMatch.toFixed(2),
        appearances,
        totalPoints,
        trend,
        isActive: player.isActive,
      };
    })
    .filter(player => player !== null)
    .sort((a, b) => (b?.value || 0) - (a?.value || 0)) // Higher is better
    .slice(0, limit);

  return rankings;
}