import type { PagesFunction } from '../../types/pages';

export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // 認証チェック
  const cookies = request.headers.get('cookie') || '';
  const sessionMatch = cookies.match(/session=([^;]+)/);
  const sessionKey = sessionMatch ? sessionMatch[1] : null;

  if (!sessionKey) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const sessionData = await env.KV_AUTH.get(sessionKey);
  if (!sessionData) {
    return new Response(
      JSON.stringify({ error: 'Session expired' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const fileName = `${Date.now()}-${file.name}`;
    const arrayBuffer = await file.arrayBuffer();

    // R2 にアップロード
    await env.R2_BUCKET.put(fileName, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    const publicUrl = `https://r2.example.com/${fileName}`; // R2 public URL に置き換え

    return new Response(
      JSON.stringify({ success: true, fileName, url: publicUrl }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
