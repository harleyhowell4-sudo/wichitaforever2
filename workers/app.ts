import { Hono } from "hono";
import { createRequestHandler } from "react-router";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// API route
app.get("/posts", async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT *
    FROM posts
    ORDER BY created_at DESC
  `).all();

  return c.json(results);
});

// React Router
app.get("*", (c) => {
  const requestHandler = createRequestHandler(
    () => import("virtual:react-router/server-build"),
    import.meta.env.MODE,
  );

  return requestHandler(c.req.raw, {
    cloudflare: {
      env: c.env,
      ctx: c.executionCtx,
    },
  });
});

export default app;