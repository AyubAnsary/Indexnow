import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { discoverAndAuditDomain } from '@/lib/domain-discovery';

export async function POST(req: Request) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { domain } = await req.json();
    if (!domain || typeof domain !== 'string') {
      return NextResponse.json({ error: 'Valid domain is required.' }, { status: 400 });
    }

    const report = await discoverAndAuditDomain(domain.trim());
    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Domain discovery failed.' }, { status: 500 });
  }
}
