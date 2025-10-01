import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    const { name, season, organizer } = body;
    if (!name || !season) {
      return NextResponse.json({ error: 'name and season are required' }, { status: 400 });
    }

    const tournament = await prisma.tournament.create({
      data: { name, season, organizer },
    });

    return NextResponse.json(tournament, { status: 201 });
  } catch (error) {
    console.error('POST /api/tournaments error', error);
    return NextResponse.json({ error: 'Error creating tournament' }, { status: 500 });
  }
}
