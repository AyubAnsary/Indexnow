import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import {
  getSitemapMonitors,
  addSitemapMonitor,
  deleteSitemapMonitor,
  updateSitemapMonitorStatus,
} from '@/lib/job-store';
import { isSsrfSafeUrl } from '@/lib/security';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const monitors = getSitemapMonitors(user.id);
  return NextResponse.json({ success: true, monitors });
}

export async function POST(req: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sitemapUrl, checkIntervalMinutes } = await req.json();

    if (!sitemapUrl || typeof sitemapUrl !== 'string') {
      return NextResponse.json({ error: 'Valid sitemap XML URL is required.' }, { status: 400 });
    }

    const ssrfCheck = isSsrfSafeUrl(sitemapUrl);
    if (!ssrfCheck.safe) {
      return NextResponse.json({ error: ssrfCheck.reason }, { status: 400 });
    }

    const monitor = addSitemapMonitor(user.id, sitemapUrl.trim(), checkIntervalMinutes || 360);
    return NextResponse.json({ success: true, monitor });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to add sitemap monitor.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { monitorId } = await req.json();
    if (!monitorId) {
      return NextResponse.json({ error: 'Monitor ID is required.' }, { status: 400 });
    }

    const success = deleteSitemapMonitor(user.id, monitorId);
    if (!success) {
      return NextResponse.json({ error: 'Monitor not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Monitor deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete monitor.' }, { status: 500 });
  }
}
