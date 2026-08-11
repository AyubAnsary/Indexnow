import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: Promise<{ key: string }> }
) {
  const { key } = await context.params;

  // Check if requested route ends with .txt or is a hexadecimal key string
  if (key && (key.endsWith('.txt') || /^[a-f0-9]{16,64}$/i.test(key))) {
    const rawKey = key.replace(/\.txt$/i, '');
    return new Response(rawKey, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
