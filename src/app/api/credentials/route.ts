import { NextResponse } from 'next/server';
import { saveUserCredentials, getUserCredentials } from '@/lib/job-store';
import { GoogleServiceAccount } from '@/lib/types';

export async function GET() {
  const creds = getUserCredentials();
  return NextResponse.json({
    success: true,
    hasGoogleCreds: !!creds.googleServiceAccount,
    googleClientEmail: creds.googleServiceAccount?.client_email || null,
    googleProjectId: creds.googleServiceAccount?.project_id || null,
    hasBingCreds: !!creds.bingApiKey,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { googleServiceAccountJson, bingApiKey } = body;

    let updatedGoogle: GoogleServiceAccount | null | undefined = undefined;

    if (googleServiceAccountJson) {
      let parsedJson: GoogleServiceAccount;
      if (typeof googleServiceAccountJson === 'string') {
        parsedJson = JSON.parse(googleServiceAccountJson);
      } else {
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

      updatedGoogle = parsedJson;
    }

    const updated = saveUserCredentials({
      ...(updatedGoogle !== undefined ? { googleServiceAccount: updatedGoogle } : {}),
      ...(bingApiKey !== undefined ? { bingApiKey } : {}),
    });

    return NextResponse.json({
      success: true,
      message: 'Credentials updated successfully!',
      hasGoogleCreds: !!updated.googleServiceAccount,
      hasBingCreds: !!updated.bingApiKey,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Invalid JSON file';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
  }
}
