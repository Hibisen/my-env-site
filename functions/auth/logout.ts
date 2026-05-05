import type { PagesFunction } from '../../types/pages';

export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const cookies = request.headers.get('cookie') || '';
    const sessionMatch = cookies.match(/session=([^;]+)/);
    const sessionKey = sessionMatch ? sessionMatch[1] : null;

    if (sessionKey) {
      await env.KV_AUTH.delete(sessionKey);
    }

    const response = new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': 'session=; Path=/; HttpOnly; Max-Age=0',
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
