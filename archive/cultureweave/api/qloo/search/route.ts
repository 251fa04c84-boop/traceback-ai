import { NextResponse } from 'next/server';
import { QlooClient } from '@/lib/qloo/client';
import { QlooEntityType } from '@/lib/qloo/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const type = (searchParams.get('type') as QlooEntityType) || undefined;
    const apiKey = searchParams.get('apiKey') || '';

    if (!query) {
      return NextResponse.json({ success: false, error: 'Query parameter is required' }, { status: 400 });
    }

    const client = new QlooClient({ apiKey });
    const result = await client.searchEntities(query, type);

    return NextResponse.json({
      ...result,
      usedLiveApi: client.hasApiKey(),
      lastRequest: client.lastRequestDetails
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
