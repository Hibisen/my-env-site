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
    const rest = params.rest as string[];

    switch (request.method) {
      case 'GET': // Read
        const postId = rest[1];
        if (!postId) {
          const posts = await env.DB.prepare(
            'SELECT * FROM posts ORDER BY created_at DESC LIMIT 50'
          ).all();
          return new Response(JSON.stringify(posts), {
            headers: { 'Content-Type': 'application/json' },
          });
        }
        const post = await env.DB.prepare(
          'SELECT * FROM posts WHERE id = ?'
        ).bind(postId).first();
        return new Response(JSON.stringify(post || { error: 'Not found' }), {
          headers: { 'Content-Type': 'application/json' },
        });

      case 'POST': // Create
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

      case 'PUT': // Update
        const updateData = await request.json();
        const updateId = rest[1];
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
          updateId
        ).run();
        return new Response(JSON.stringify({ success: true, ...updateResult }), {
          headers: { 'Content-Type': 'application/json' },
        });

      case 'DELETE': // Delete
        const deleteId = rest[1];
        const deleteResult = await env.DB.prepare(
          'DELETE FROM posts WHERE id = ?'
        ).bind(deleteId).run();
        return new Response(JSON.stringify({ success: true, ...deleteResult }), {
          headers: { 'Content-Type': 'application/json' },
        });

      default:
        return new Response('Method Not Allowed', { status: 405 });
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
