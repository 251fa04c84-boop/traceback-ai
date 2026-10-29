import { NextResponse } from 'next/server';
import { CURATED_ARCHETYPES } from '@/lib/qloo/taste-benchmark';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    archetypes: CURATED_ARCHETYPES
  });
}
