import express from 'express';
export default function commentsRouter(db) {
  const router = express.Router();

  //=> "3 days ago"
  // ✅ GET all comments
  router.get('/', (req, res) => {
    const comments = db
      .prepare('SELECT * FROM comments ORDER BY created_at ASC')
      .all();
    res.json(comments);
  });

  // ✅ CREATE comment / reply
  router.post('/', (req, res) => {
    const { user_name, avatar, content, parent_id } = req.body;
    if (!user_name || !content) {
      return res.status(400).json({
        error: 'User name and content are required',
      });
    }

    const result = db
      .prepare(
        `
        INSERT INTO comments (user_name, avatar, content, parent_id, created_at)
        VALUES (?, ?, ?, ?, ?)
      `,
      )
      .run(
        user_name,
        avatar || null,
        content,
        parent_id || null,
        new Date().toISOString(),
      );
    const newComment = db
      .prepare('SELECT * FROM comments WHERE id = ?')
      .get(result.lastInsertRowid);
    res.json(newComment);
  });

  // ✅ UPDATE comment (edit text)
  router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    db.prepare(
      `
      UPDATE comments
      SET content = ?
      WHERE id = ?
    `,
    ).run(content, id);
    const updated = db.prepare('SELECT * FROM comments WHERE id = ?').get(id);
    res.json(updated);
  });

  // ✅ DELETE comment (and optionally its replies)
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    // delete replies too (important)
    db.prepare('DELETE FROM comments WHERE parent_id = ?').run(id);
    db.prepare('DELETE FROM comments WHERE id = ?').run(id);
    res.json({ success: true });
  });
  return router;
}
