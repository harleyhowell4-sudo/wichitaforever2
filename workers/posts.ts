import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const db = c.env.DB;

  const { results } = await db
    .prepare(
      `SELECT *
       FROM posts
       WHERE published = 1
       ORDER BY created_at DESC`
    )
    .all();

  return c.json(results);
});

export default app;

import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const posts = new Hono<{ Bindings: Bindings }>();

// GET /api/posts
posts.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT
      id,
      title,
      slug,
      description,
      hero_image,
      created_at
    FROM posts
    WHERE published = 1
    ORDER BY created_at DESC
  `).all();

  return c.json(results);
});

// GET /api/posts/:slug
posts.get("/:slug", async (c) => {
  const slug = c.req.param("slug");

  const post = await c.env.DB.prepare(`
    SELECT *
    FROM posts
    WHERE slug = ?
  `)
    .bind(slug)
    .first();

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json(post);
});

export default posts;