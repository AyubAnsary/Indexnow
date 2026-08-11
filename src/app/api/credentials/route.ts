import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { saveUserGoogleCredentials, getUserGoogleCredentials } from '@/lib/job-store';
import { GoogleServiceAccount } from '@/lib/types';

export async function GET(req: Request) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }

  const creds = getUserGoogleCredentials(user.id);
  return NextResponse.json({
    success: true,
    hasGoogleCreds: !!creds,
    googleClientEmail: creds?.client_email || null,
    googleProjectId: creds?.project_id || null,
  });
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const body = await req.json();
    const { googleServiceAccountJson } = body;

    if (!googleServiceAccountJson) {
      return NextResponse.json({ success: false, error: 'Please provide Google Service Account JSON.' }, { status: 400 });
    }

    let rawJsonStr: string;
    let parsedJson: GoogleServiceAccount;

    if (typeof googleServiceAccountJson === 'string') {
      rawJsonStr = googleServiceAccountJson;
      parsedJson = JSON.parse(googleServiceAccountJson);
    } else {
      rawJsonStr = JSON.stringify(googleServiceAccountJson);
      parsedJson = googleServiceAccountJson;
    }

    if (!parsedJson.client_email || !parsedJson.private_key) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Google Service Account JSON. Missing client_email or private_key.',
        },
        { status: 400 }
      );
    }

    // Encrypt and save to user's secure account vault
    saveUserGoogleCredentials(user.id, rawJsonStr);

    return NextResponse.json({
      success: true,
      message: 'Google Service Account credentials saved & encrypted successfully in your private vault!',
      hasGoogleCreds: true,
      googleClientEmail: parsedJson.client_email,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Invalid JSON file';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
  }
}
