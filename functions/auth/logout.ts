export async function onRequest(context: {
  request: any;
  env: any;
  data: any;
}): Promise<Response> {
  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const response = new Response(
    JSON.stringify({ success: true }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );

  // Cookie を削除
  response.headers.append(
    'Set-Cookie',
    'session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
  );

  return response;
}
