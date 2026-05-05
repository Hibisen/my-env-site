import type { PagesFunction } from '../../../types/pages';

export const onRequest: PagesFunction = async (context) => {
  const { request, env, params } = context;

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
    const id = params.id as string;

    if (request.method === 'GET') {
      // 特定の記事取得
      const post = await env.DB.prepare(
        'SELECT * FROM posts WHERE id = ?'
      ).bind(id).first();
      return new Response(JSON.stringify(post || { error: 'Not found' }), {
        status: post ? 200 : 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (request.method === 'PUT') {
      // 記事更新
      const updateData = await request.json();
      const updateResult = await env.DB.prepare(
        `UPDATE posts SET title = ?, content = ?, theme = ?, category = ?, subcategory = ?,
         country = ?, industry = ?, term = ?, affiliate_url = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      ).bind(
        updateData.title,
        updateData.content,
        updateData.theme,
        updateData.category,
        updateData.subcategory,
        updateData.country,
        updateData.industry,
        updateData.term,
        updateData.affiliate_url,
        updateData.tags,
        id
      ).run();
      return new Response(JSON.stringify({ success: true, ...updateResult }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (request.method === 'DELETE') {
      // 記事削除
      const deleteResult = await env.DB.prepare(
        'DELETE FROM posts WHERE id = ?'
      ).bind(id).run();
      return new Response(JSON.stringify({ success: true, ...deleteResult }), {
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
