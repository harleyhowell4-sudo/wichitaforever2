import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const posts = new Hono<{ Bindings: Bindings }>();

// GET all posts
posts.get("/api/posts", async (c) => {
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

// GET single post
posts.get("/api/posts/:slug", async (c) => {
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

// IMPORT POSTS
posts.post("/api/import-posts", async (c) => {
  return c.json({
    success: true,
    message: "Import route works"
  });
});

export default posts;