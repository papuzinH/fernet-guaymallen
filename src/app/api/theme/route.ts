import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { supabase } from '@/lib/supabase';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const theme = await prisma.theme.findFirst();
    return NextResponse.json(theme || { primaryColor: '#3b82f6', secondaryColor: '#1e40af', logoUrl: null });
  } catch (error) {
    console.error('Theme API error:', error);
    return NextResponse.json({ primaryColor: '#3b82f6', secondaryColor: '#1e40af', logoUrl: null });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const primaryColor = formData.get('primaryColor') as string;
    const secondaryColor = formData.get('secondaryColor') as string;
    const logoFile = formData.get('logo') as File | null;

    let logoUrl = null;
    if (logoFile) {
      const fileName = `logo-${Date.now()}.${logoFile.name.split('.').pop()}`;
      const { data, error } = await supabase.storage
        .from('logos')
        .upload(fileName, logoFile);

      if (error) throw error;
      logoUrl = supabase.storage.from('logos').getPublicUrl(fileName).data.publicUrl;
    }

    const theme = await prisma.theme.upsert({
      where: { id: 1 },
      update: {
        primaryColor: primaryColor || undefined,
        secondaryColor: secondaryColor || undefined,
        logoUrl: logoUrl || undefined,
      },
      create: {
        primaryColor: primaryColor || '#3b82f6',
        secondaryColor: secondaryColor || '#1e40af',
        logoUrl,
      },
    });

    return NextResponse.json(theme);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}