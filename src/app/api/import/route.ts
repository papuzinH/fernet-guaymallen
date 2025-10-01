import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Check admin secret
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.substring(7);
    if (token !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Invalid admin secret' }, { status: 401 });
    }

    const { players, matches, appearances } = await request.json();

    console.log('Received data:', { playersCount: players.length, matchesCount: matches.length, appearancesCount: appearances.length });
    console.log('Sample player:', players[0]);
    console.log('Sample match:', matches[0]);
    console.log('Sample appearance:', appearances[0]);

    // Process in transaction
    const result = await prisma.$transaction(async (tx) => {
      let playersCreated = 0;
      let playersUpdated = 0;
      let matchesCreated = 0;
      let tournamentsCreated = 0;
      let appearancesCreated = 0;

      // Process players
      for (const playerData of players) {
        const existingPlayer = await tx.player.findFirst({
          where: { nickname: playerData.nickname }
        });

        if (existingPlayer) {
          await tx.player.update({
            where: { id: existingPlayer.id },
            data: {
              fullName: playerData.fullName || existingPlayer.fullName,
              dorsal: playerData.dorsal ? parseInt(playerData.dorsal) : existingPlayer.dorsal,
              position: playerData.position,
              joinedAt: playerData.joinedAt ? new Date(playerData.joinedAt) : existingPlayer.joinedAt,
              isActive: playerData.isActive === 'true' || playerData.isActive === true,
              photoUrl: playerData.photoUrl || existingPlayer.photoUrl,
            }
          });
          playersUpdated++;
        } else {
          await tx.player.create({
            data: {
              fullName: playerData.fullName,
              nickname: playerData.nickname,
              dorsal: playerData.dorsal ? parseInt(playerData.dorsal) : null,
              position: playerData.position,
              joinedAt: playerData.joinedAt ? new Date(playerData.joinedAt) : new Date(),
              isActive: playerData.isActive === 'true' || playerData.isActive === true,
              photoUrl: playerData.photoUrl,
            }
          });
          playersCreated++;
        }
      }

      // Process matches
      for (const matchData of matches) {
        console.log('Processing match:', matchData);
        const matchDate = new Date(matchData.date);
        if (isNaN(matchDate.getTime())) {
          throw new Error(`Invalid date in matches CSV: ${matchData.date}`);
        }

        // Find or create tournament
        let tournament = await tx.tournament.findFirst({
          where: {
            name: matchData.tournament,
            season: matchData.season
          }
        });

        if (!tournament) {
          tournament = await tx.tournament.create({
            data: {
              name: matchData.tournament,
              season: matchData.season,
              organizer: matchData.organizer,
            }
          });
          tournamentsCreated++;
        }

        // Find or create match
        const existingMatch = await tx.match.findFirst({
          where: {
            date: matchDate,
            opponent: matchData.opponent
          }
        });

        if (!existingMatch) {
          await tx.match.create({
            data: {
              date: matchDate,
              opponent: matchData.opponent,
              tournamentId: tournament.id,
              location: matchData.location,
              ourScore: parseInt(matchData.ourScore),
              theirScore: parseInt(matchData.theirScore),
              result: matchData.result,
              notes: matchData.notes,
            }
          });
          matchesCreated++;
        }
      }

      // Process appearances
      for (const appearanceData of appearances) {
        console.log('Processing appearance:', appearanceData);
        const matchDate = new Date(appearanceData.matchDate);
        if (isNaN(matchDate.getTime())) {
          throw new Error(`Invalid date in appearances CSV: ${appearanceData.matchDate}`);
        }

        // Find match
        const match = await tx.match.findFirst({
          where: {
            date: matchDate,
            opponent: appearanceData.opponent
          }
        });

        if (!match) {
          throw new Error(`Match not found: ${appearanceData.matchDate} vs ${appearanceData.opponent}`);
        }

        // Find player
        const player = await tx.player.findFirst({
          where: { nickname: appearanceData.playerNickname }
        });

        if (!player) {
          throw new Error(`Player not found: ${appearanceData.playerNickname}`);
        }

        // Create appearance
        await tx.appearance.create({
          data: {
            matchId: match.id,
            playerId: player.id,
            isStarter: appearanceData.isStarter === 'true' || appearanceData.isStarter === true,
            minutes: appearanceData.minutes ? parseInt(appearanceData.minutes) : null,
            goals: parseInt(appearanceData.goals) || 0,
            assists: appearanceData.assists ? parseInt(appearanceData.assists) : 0,
            yellow: appearanceData.yellow === 'true' || appearanceData.yellow === true,
            red: appearanceData.red === 'true' || appearanceData.red === true,
            motm: appearanceData.motm === 'true' || appearanceData.motm === true,
          }
        });
        appearancesCreated++;
      }

      return {
        playersCreated,
        playersUpdated,
        matchesCreated,
        tournamentsCreated,
        appearancesCreated
      };
    });

    return NextResponse.json({
      message: `Import completed. Players: ${result.playersCreated} created, ${result.playersUpdated} updated. Matches: ${result.matchesCreated} created. Tournaments: ${result.tournamentsCreated} created. Appearances: ${result.appearancesCreated} created.`
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}