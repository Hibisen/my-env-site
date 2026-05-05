import { FunctionRequest, FunctionResponse } from '@cloudflare/workers-types';

export async function onRequest(context: {
  request: FunctionRequest;
  env: any;
  data: any;
}): Promise<FunctionResponse> {
  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await context.request.json();
    const { password } = body;

    if (!password) {
      return new Response(
        JSON.stringify({ error: 'Password is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const adminPassword = context.env.ADMIN_PASSWORD || 'hibisen';

    if (password !== adminPassword) {
      return new Response(
        JSON.stringify({ error: 'Invalid password' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // セッショントークンを生成
    const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // KV にセッション情報を保存（24時間）
    if (context.env.KV_AUTH) {
      await context.env.KV_AUTH.put(
        `session:${sessionToken}`,
        JSON.stringify({ created_at: new Date().toISOString() }),
        { expirationTtl: 24 * 60 * 60 }
      );
    }

    const response = new Response(
      JSON.stringify({ success: true, token: sessionToken }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

    // Cookie を設定
    response.headers.append(
      'Set-Cookie',
      `session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${24 * 60 * 60}`
    );

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
