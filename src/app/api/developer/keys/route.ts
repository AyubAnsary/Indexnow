import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { getUserApiKeys, createApiKey, revokeApiKey } from '@/lib/job-store';

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const keys = getUserApiKeys(user.id);
  return NextResponse.json({ success: true, keys });
}

export async function POST(req: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name } = await req.json().catch(() => ({ name: 'Developer Key' }));
    const result = createApiKey(user.id, name || 'Developer Key');

    return NextResponse.json({
      success: true,
      message: 'API Key generated successfully! Store your secret key securely; it will not be shown again.',
      apiKey: result.apiKey,
      rawSecretKey: result.rawSecretKey, // Displayed ONLY ONCE to user upon creation
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create API key.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { keyId } = await req.json();
    if (!keyId) {
      return NextResponse.json({ error: 'Key ID is required.' }, { status: 400 });
    }

    const success = revokeApiKey(user.id, keyId);
    if (!success) {
      return NextResponse.json({ error: 'API key not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'API key revoked successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to revoke API key.' }, { status: 500 });
  }
}
