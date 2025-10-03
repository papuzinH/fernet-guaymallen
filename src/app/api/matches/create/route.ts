import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { matchData, playerStats } = data;

    // Validate data
    if (!matchData.date || !matchData.opponent || !matchData.ourScore || !matchData.theirScore) {
      return NextResponse.json({ error: 'Missing required match data' }, { status: 400 });
    }

    // Validate goals consistency
    const totalGoals = playerStats.reduce((sum: number, player: any) => sum + (player.goals || 0), 0);
    if (totalGoals !== matchData.ourScore) {
      return NextResponse.json({
        error: `Inconsistent goals: players scored ${totalGoals} goals but match result shows ${matchData.ourScore}`
      }, { status: 400 });
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Determine tournament: prefer explicit tournamentId, otherwise accept tournament name+season
      let tournament = null;
      if (matchData.tournamentId && Number.isInteger(Number(matchData.tournamentId))) {
        const tid = Number(matchData.tournamentId);
        tournament = await tx.tournament.findUnique({ where: { id: tid } });
        if (!tournament) {
          throw new Error(`Tournament with id ${tid} not found`);
        }
      } else if (matchData.tournament && Number.isInteger(Number(matchData.tournament))) {
        // Backwards compat: if tournament was passed as id string
        const tid = Number(matchData.tournament);
        tournament = await tx.tournament.findUnique({ where: { id: tid } });
        if (!tournament) {
          throw new Error(`Tournament with id ${tid} not found`);
        }
      } else if (matchData.tournament) {
        tournament = await tx.tournament.findFirst({
          where: {
            name: matchData.tournament,
          },
        });

        if (!tournament) {
          tournament = await tx.tournament.create({
            data: {
              name: matchData.tournament,
            },
          });
        }
      } else {
        // no tournament info provided
        tournament = null;
      }

      // Create match
      const matchCreateData: any = {
        date: new Date(matchData.date),
        opponent: matchData.opponent,
        ourScore: matchData.ourScore,
        theirScore: matchData.theirScore,
        result: matchData.result,
        location: matchData.location || null,
        notes: matchData.notes || null,
      };

      if (tournament) {
        matchCreateData.tournamentId = tournament.id;
      }

      const match = await tx.match.create({ data: matchCreateData });

      // Create appearances
      const appearances = await Promise.all(
        playerStats.map(async (playerStat: any) => {
          return await tx.appearance.create({
            data: {
              matchId: match.id,
              playerId: playerStat.playerId,
              isStarter: playerStat.played || false,
              goals: playerStat.goals || 0,
              assists: playerStat.assists || 0,
              yellow: playerStat.yellow || false,
              red: playerStat.red || false,
            },
          });
        })
      );

      return { match, appearances };
    });

    return NextResponse.json({
      success: true,
      matchId: result.match.id,
      message: 'Match created successfully'
    });

  } catch (error) {
    console.error('Create match API error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}