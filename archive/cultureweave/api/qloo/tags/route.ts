import { NextResponse } from 'next/server';
import { QlooClient } from '@/lib/qloo/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const apiKey = searchParams.get('apiKey') || '';
    const client = new QlooClient({ apiKey });
    const result = await client.getTags();

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
