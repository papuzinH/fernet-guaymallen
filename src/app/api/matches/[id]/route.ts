import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const matchId = parseInt(id);

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        tournament: true,
        appearances: {
          include: {
            player: true,
          },
          orderBy: [
            { isStarter: 'desc' },
            { player: { fullName: 'asc' } },
          ],
        },
      },
    });

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    // Calculate match stats
    const stats = {
      totalGoals: match.appearances.reduce((sum, app) => sum + app.goals, 0),
      totalAssists: match.appearances.reduce((sum, app) => sum + (app.assists || 0), 0),
      totalYellowCards: match.appearances.filter(app => app.yellow).length,
      totalRedCards: match.appearances.filter(app => app.red).length,
      averageRating: 0, // Placeholder - no rating system implemented yet
    };

    return NextResponse.json({ match, stats });
  } catch (error) {
    console.error('Match detail API error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const matchId = parseInt(id);
    const data = await request.json();

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        date: data.date ? new Date(data.date) : undefined,
        opponent: data.opponent,
        location: data.location,
        ourScore: data.ourScore ? parseInt(data.ourScore) : undefined,
        theirScore: data.theirScore ? parseInt(data.theirScore) : undefined,
        result: data.result,
        notes: data.notes,
      },
      include: {
        tournament: true,
      },
    });

    return NextResponse.json(updatedMatch);
  } catch (error) {
    console.error('Match update API error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}