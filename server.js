import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';
import commentsRouter from './routes/comments.js';

const app = express();
const db = new Database('users.db');
// create table if not exists
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT,
    avatar TEXT,
    content TEXT,
    parent_id INTEGER DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
  )
`,
).run();
// middlewares
app.use(
  cors({
    origin: [
      'http://localhost:5173', // Vue dev server
      'https://comment-section-pi.vercel.app',
    ],
  }),
);
app.use(express.json());
app.use('/comments', commentsRouter(db));
// start server
app.listen(4000, () => {
  console.log('Backend running on http://localhost:4000');
});
