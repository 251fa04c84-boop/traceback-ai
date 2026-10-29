import { NextResponse } from 'next/server';
import { CultureWeaveAgent } from '@/lib/agent/engine';
import { QlooClient } from '@/lib/qloo/client';
import { CulturalBrief } from '@/lib/qloo/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const brief: CulturalBrief = body.brief;
    const userApiKey: string = body.apiKey || '';
    const refinementPrompt: string = body.refinementPrompt || '';

    if (!brief || !brief.culturalAnchors || brief.culturalAnchors.length === 0) {
      return NextResponse.json(
        { success: false, error: 'A cultural brief with at least one anchor interest is required.' },
        { status: 400 }
      );
    }

    const qlooClient = new QlooClient({ apiKey: userApiKey });
    const agent = new CultureWeaveAgent(qlooClient);

    const blueprint = await agent.executeDesignPipeline(brief, refinementPrompt);

    return NextResponse.json({
      success: true,
      blueprint,
      qlooMetadata: {
        hasLiveKey: qlooClient.hasApiKey(),
        lastRequest: qlooClient.lastRequestDetails
      }
    });
  } catch (error: any) {
    console.error('API Generation Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Agent Pipeline Error' },
      { status: 500 }
    );
  }
}
