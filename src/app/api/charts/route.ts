import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Goals by month chart data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'goals-by-month';

    let data;

    switch (type) {
      case 'goals-by-month':
        data = await getGoalsByMonth();
        break;
      case 'results-by-season':
        data = await getResultsBySeason();
        break;
      default:
        data = await getGoalsByMonth();
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Charts API error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// Goals by month data
async function getGoalsByMonth() {
  const appearances = await prisma.appearance.findMany({
    select: {
      goals: true,
      match: {
        select: {
          date: true,
        },
      },
    },
  });

  const monthlyGoals: { [key: string]: number } = {};

  appearances.forEach(appearance => {
    const date = new Date(appearance.match.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyGoals[monthKey]) {
      monthlyGoals[monthKey] = 0;
    }
    monthlyGoals[monthKey] += appearance.goals;
  });

  // Convert to array and sort by date
  const chartData = Object.entries(monthlyGoals)
    .map(([month, goals]) => ({
      month: new Date(month + '-01').toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short'
      }),
      goals,
      sortKey: month,
    }))
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ month, goals }) => ({ month, goals }));

  return chartData;
}

// Results by tournament data
async function getResultsBySeason() {
  const matches = await prisma.match.findMany({
    select: {
      result: true,
      tournament: {
        select: {
          name: true,
        },
      },
    },
  });

  const tournamentResults: { [key: string]: { WIN: number; DRAW: number; LOSS: number } } = {};

  matches.forEach(match => {
    const tournament = match.tournament?.name || 'Sin Torneo';

    if (!tournamentResults[tournament]) {
      tournamentResults[tournament] = { WIN: 0, DRAW: 0, LOSS: 0 };
    }

    tournamentResults[tournament][match.result as keyof typeof tournamentResults[string]]++;
  });

  // Convert to array format suitable for stacked bar chart
  const chartData = Object.entries(tournamentResults)
    .map(([tournament, results]) => ({
      season: tournament, // Keep the same key name for frontend compatibility
      wins: results.WIN,
      draws: results.DRAW,
      losses: results.LOSS,
    }))
    .sort((a, b) => a.season.localeCompare(b.season));

  return chartData;
}