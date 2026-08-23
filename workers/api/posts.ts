import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const posts = new Hono<{ Bindings: Bindings }>();

// GET all published posts
posts.get("/api/posts", async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT
      id,
      title,
      slug,
      description,
      content,
      hero_image,
      tags,
      author,
      created_at,
      updated_at,
      draft,
      published,
      featured,
      views
    FROM posts
    WHERE published = 1
    ORDER BY created_at DESC
  `).all();

  return c.json(results);
});

// GET all posts for admin
posts.get("/api/admin/posts", async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT
      id,
      title,
      slug,
      description,
      tags,
      author,
      created_at,
      updated_at,
      draft,
      published,
      featured,
      views
    FROM posts
    ORDER BY created_at DESC
  `).all();

  return c.json(results);
});

// GET single post by ID
posts.get("/api/posts/id/:id", async (c) => {
  const id = c.req.param("id");

  const post = await c.env.DB.prepare(`
    SELECT *
    FROM posts
    WHERE id = ?
  `)
    .bind(id)
    .first();

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json(post);
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

// CREATE post
posts.post("/api/posts", async (c) => {
  try {
    const body = await c.req.json();

    const {
      title,
      slug,
      description = "",
      content,
      hero_image = null,
      tags = "",
      author = "",
      draft = 0,
      published = 1,
      featured = 0,
    } = body;

    if (!title || !slug || !content) {
      return c.json(
        {
          error: "title, slug, and content are required",
        },
        400,
      );
    }

    const existing = await c.env.DB.prepare(`
      SELECT id
      FROM posts
      WHERE slug = ?
    `)
      .bind(slug)
      .first();

    if (existing) {
      return c.json(
        {
          error: "A post with that slug already exists",
        },
        409,
      );
    }

    const now = new Date().toISOString();

    const result = await c.env.DB.prepare(`
      INSERT INTO posts (
        title,
        slug,
        description,
        content,
        hero_image,
        tags,
        author,
        created_at,
        updated_at,
        draft,
        published,
        featured,
        views
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `)
      .bind(
        title,
        slug,
        description,
        content,
        hero_image,
        tags,
        author,
        now,
        now,
        draft ? 1 : 0,
        published ? 1 : 0,
        featured ? 1 : 0,
      )
      .run();

    return c.json(
      {
        success: true,
        id: result.meta.last_row_id,
        message: "Post created successfully",
      },
      201,
    );
  } catch (error) {
    console.error(error);

    return c.json(
      {
        error: "Failed to create post",
      },
      500,
    );
  }
});

// UPDATE post
posts.put("/api/posts/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    const existing = await c.env.DB.prepare(`
      SELECT *
      FROM posts
      WHERE id = ?
    `)
      .bind(id)
      .first();

    if (!existing) {
      return c.json(
        {
          error: "Post not found",
        },
        404,
      );
    }

    const title = body.title ?? existing.title;
    const slug = body.slug ?? existing.slug;
    const description = body.description ?? existing.description ?? "";
    const content = body.content ?? existing.content;
    const hero_image = body.hero_image ?? existing.hero_image;
    const tags = body.tags ?? existing.tags ?? "";
    const author = body.author ?? existing.author ?? "Wichita Forever";

    const draft =
      body.draft === undefined
        ? existing.draft
        : body.draft
          ? 1
          : 0;

    const published =
      body.published === undefined
        ? existing.published
        : body.published
          ? 1
          : 0;

    const featured =
      body.featured === undefined
        ? existing.featured
        : body.featured
          ? 1
          : 0;

    if (!title || !slug || !content) {
      return c.json(
        {
          error: "title, slug, and content are required",
        },
        400,
      );
    }

    const duplicateSlug = await c.env.DB.prepare(`
      SELECT id
      FROM posts
      WHERE slug = ?
      AND id != ?
    `)
      .bind(slug, id)
      .first();

    if (duplicateSlug) {
      return c.json(
        {
          error: "A different post already uses that slug",
        },
        409,
      );
    }

    const now = new Date().toISOString();

    await c.env.DB.prepare(`
      UPDATE posts
      SET
        title = ?,
        slug = ?,
        description = ?,
        content = ?,
        hero_image = ?,
        tags = ?,
        author = ?,
        updated_at = ?,
        draft = ?,
        published = ?,
        featured = ?
      WHERE id = ?
    `)
      .bind(
        title,
        slug,
        description,
        content,
        hero_image,
        tags,
        author,
        now,
        draft,
        published,
        featured,
        id,
      )
      .run();

    return c.json({
      success: true,
      message: "Post updated successfully",
    });
  } catch (error) {
    console.error(error);

    return c.json(
      {
        error: "Failed to update post",
      },
      500,
    );
  }
});

// DELETE post
posts.delete("/api/posts/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const existing = await c.env.DB.prepare(`
      SELECT id
      FROM posts
      WHERE id = ?
    `)
      .bind(id)
      .first();

    if (!existing) {
      return c.json(
        {
          error: "Post not found",
        },
        404,
      );
    }

    await c.env.DB.prepare(`
      DELETE FROM posts
      WHERE id = ?
    `)
      .bind(id)
      .run();

    return c.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return c.json(
      {
        error: "Failed to delete post",
      },
      500,
    );
  }
});

// IMPORT POSTS
posts.post("/api/import-posts", async (c) => {
  return c.json({
    success: true,
    message: "Import route works",
  });
});

export default posts;