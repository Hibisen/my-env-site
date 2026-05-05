import type { PagesFunction } from '../../types/pages';

export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;

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
    if (request.method === 'GET') {
      // 全記事取得
      const posts = await env.DB.prepare(
        'SELECT * FROM posts ORDER BY created_at DESC LIMIT 50'
      ).all();
      return new Response(JSON.stringify(posts), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (request.method === 'POST') {
      // 記事作成
      const createData = await request.json();
      const createResult = await env.DB.prepare(
        `INSERT INTO posts (id, type, title, content, theme, category, subcategory, country, industry, term, affiliate_url, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        crypto.randomUUID(),
        createData.type,
        createData.title,
        createData.content,
        createData.theme,
        createData.category,
        createData.subcategory,
        createData.country,
        createData.industry,
        createData.term,
        createData.affiliate_url,
        createData.tags
      ).run();
      return new Response(JSON.stringify({ success: true, ...createResult }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method Not Allowed', { status: 405 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
