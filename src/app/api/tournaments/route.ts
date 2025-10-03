import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const tournaments = await prisma.tournament.findMany({ orderBy: { id: 'desc' } });
    return NextResponse.json(tournaments);
  } catch (error) {
    console.error('GET /api/tournaments error', error);
    return NextResponse.json({ error: 'Error fetching tournaments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, organizer } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const tournament = await prisma.tournament.create({
      data: { 
        name: name.trim(),
        organizer: organizer?.trim() || null
      },
    });

    return NextResponse.json(tournament, { status: 201 });
  } catch (error) {
    console.error('POST /api/tournaments error', error);
    return NextResponse.json({ 
      error: 'Error creating tournament',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
