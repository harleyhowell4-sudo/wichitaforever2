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