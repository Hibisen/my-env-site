import type { PagesFunction } from '../../types/pages';

export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { password } = await request.json();
    const SITE_PASSWORD = env.SITE_PASSWORD as string;

    if (!password || password !== SITE_PASSWORD) {
      return new Response(
        JSON.stringify({ error: 'Invalid password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const sessionKey = crypto.randomUUID();
    const sessionData = JSON.stringify({
      authenticated: true,
      createdAt: new Date().toISOString(),
    });

    // KV にセッション保存（TTL: 7日）
    await env.KV_AUTH.put(sessionKey, sessionData, {
      expirationTtl: 7 * 24 * 60 * 60,
    });

    // Cookie にセッションキーを設定
    const response = new Response(
      JSON.stringify({ success: true, sessionKey }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `session=${sessionKey}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`,
        },
      }
    );

    return response;
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
