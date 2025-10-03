import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const confirm = body.confirm;
    if (confirm !== true) {
      return NextResponse.json({ error: 'Confirmation required' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      const deletedAppearances = await tx.appearance.deleteMany();
      const deletedMatches = await tx.match.deleteMany();
      const deletedPlayers = await tx.player.deleteMany();
      const deletedTournaments = await tx.tournament.deleteMany();

      return {
        appearances: deletedAppearances.count,
        matches: deletedMatches.count,
        players: deletedPlayers.count,
        tournaments: deletedTournaments.count,
      };
    });

    return NextResponse.json({ success: true, deleted: result });
  } catch (error) {
    console.error('Reset API error', error);
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}
