import { NextResponse } from 'next/server';
import { auditUrlIndexability } from '@/lib/indexability-auditor';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Valid URL is required for Caffeine audit.' }, { status: 400 });
    }

    const audit = await auditUrlIndexability(url.trim());
    return NextResponse.json({ success: true, audit });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Audit failed.' }, { status: 500 });
  }
}
