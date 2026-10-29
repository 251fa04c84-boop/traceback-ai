import { NextResponse } from 'next/server';
import { QlooClient } from '@/lib/qloo/client';
import { QlooEntityType } from '@/lib/qloo/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const signalEntityIds = (searchParams.get('signals') || '').split(',').filter(Boolean);
    const filterType = (searchParams.get('filterType') as QlooEntityType) || 'urn:entity:artist';
    const location = searchParams.get('location') || undefined;
    const apiKey = searchParams.get('apiKey') || '';

    const client = new QlooClient({ apiKey });
    const result = await client.getInsights({
      signalEntityIds,
      filterType,
      location
    });

    return NextResponse.json({
      ...result,
      usedLiveApi: client.hasApiKey(),
      lastRequest: client.lastRequestDetails
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
