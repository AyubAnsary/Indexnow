import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { inspectLiveUrlStatus } from '@/lib/index-inspector';

export async function POST(req: Request) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Valid URL is required for live inspection.' }, { status: 400 });
    }

    const inspection = await inspectLiveUrlStatus(url.trim());
    return NextResponse.json({ success: true, inspection });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Inspection failed.' }, { status: 500 });
  }
}
