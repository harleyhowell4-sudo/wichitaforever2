import { Hono, type Context, type MiddlewareHandler } from "hono";
import { hasValidAdminSession } from "../auth";

type Bindings = {
  DB: D1Database;
  ADMIN_TOKEN?: string;
};

const posts = new Hono<{ Bindings: Bindings }>();
const MAX_REQUEST_BODY_BYTES = 512 * 1024;

class RequestBodyError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 413 | 415,
  ) {
    super(message);
  }
}

const requireAdmin: MiddlewareHandler<{ Bindings: Bindings }> = async (c, next) => {
  c.header("Cache-Control", "no-store");

  if (!(await hasValidAdminSession(c.req.raw, c.env.ADMIN_TOKEN))) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
};

async function readJsonObject(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers
    .get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();

  if (contentType !== "application/json") {
    throw new RequestBodyError("Content-Type must be application/json", 415);
  }

  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BODY_BYTES) {
    throw new RequestBodyError("Request body is too large", 413);
  }

  const reader = request.body?.getReader();

  if (!reader) {
    throw new RequestBodyError("A JSON request body is required", 400);
  }

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    totalBytes += value.byteLength;

    if (totalBytes > MAX_REQUEST_BODY_BYTES) {
      await reader.cancel();
      throw new RequestBodyError("Request body is too large", 413);
    }

    chunks.push(value);
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;

  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  let value: unknown;

  try {
    value = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new RequestBodyError("Request body must contain valid JSON", 400);
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new RequestBodyError("Request body must be a JSON object", 400);
  }

  return value as Record<string, unknown>;
}

function bodyErrorResponse(
  c: Context<{ Bindings: Bindings }>,
  error: unknown,
) {
  if (error instanceof RequestBodyError) {
    return c.json({ error: error.message }, error.status);
  }

  return null;
}

posts.use("/api/admin/*", requireAdmin);
posts.use("/api/posts/:id/*", requireAdmin);
posts.use("/api/posts/:id", async (c, next) => {
  if (c.req.method === "GET") {
    return next();
  }

  return requireAdmin(c, next);
});

// GET all published posts
posts.get("/api/posts", async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT
      id,
      title,
      slug,
      description,
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
    WHERE published = 1 AND draft = 0
    ORDER BY created_at DESC
  `).all();

  c.header("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
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
      AND published = 1
      AND draft = 0
  `)
    .bind(id)
    .first();

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  c.header("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  return c.json(post);
});
// GET single post
posts.get("/api/posts/:slug", async (c) => {
  const slug = c.req.param("slug");

  const post = await c.env.DB.prepare(`
    SELECT *
    FROM posts
    WHERE slug = ?
      AND published = 1
      AND draft = 0
  `)
    .bind(slug)
    .first();

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  c.header("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  return c.json(post);
});

// CREATE post
posts.post("/api/posts", async (c) => {
  try {
    const body = await readJsonObject(c.req.raw);
    const { title, slug, content } = body;

    if (
      typeof title !== "string" ||
      typeof slug !== "string" ||
      typeof content !== "string" ||
      !title.trim() ||
      !slug.trim() ||
      !content.trim()
    ) {
      return c.json(
        {
          error: "title, slug, and content are required",
        },
        400,
      );
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || title.length > 240) {
      return c.json({ error: "title or slug is invalid" }, 400);
    }

    const description = typeof body.description === "string" ? body.description : "";
    const heroImage =
      typeof body.hero_image === "string" || body.hero_image === null
        ? body.hero_image
        : null;
    const tags = typeof body.tags === "string" ? body.tags : "";
    const author = typeof body.author === "string" ? body.author : "";

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
        heroImage,
        tags,
        author,
        now,
        now,
        1,
        0,
        0,
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
    const bodyError = bodyErrorResponse(c, error);

    if (bodyError) {
      return bodyError;
    }

    console.error(error);

    return c.json(
      {
        error: "Failed to create post",
      },
      500,
    );
  }
});
// UNPUBLISH POST
posts.post("/api/posts/:id/unpublish", async (c) => {
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

    const now = new Date().toISOString();

    await c.env.DB.prepare(`
      UPDATE posts
      SET
        draft = 1,
        published = 0,
        updated_at = ?
      WHERE id = ?
    `)
      .bind(now, id)
      .run();

    return c.json({
      success: true,
      message: "Post unpublished successfully",
    });
  } catch (error) {
    console.error(error);

    return c.json(
      {
        error: "Failed to unpublish post",
      },
      500,
    );
  }
});
// PUBLISH POST
posts.post("/api/posts/:id/publish", async (c) => {
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

    const now = new Date().toISOString();

    await c.env.DB.prepare(`
      UPDATE posts
      SET
        draft = 0,
        published = 1,
        updated_at = ?
      WHERE id = ?
    `)
      .bind(now, id)
      .run();

    return c.json({
      success: true,
      message: "Post published successfully",
    });
  } catch (error) {
    console.error(error);

    return c.json(
      {
        error: "Failed to publish post",
      },
      500,
    );
  }
});
// UPDATE post
posts.put("/api/posts/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await readJsonObject(c.req.raw);

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

    if (
      typeof title !== "string" ||
      typeof slug !== "string" ||
      typeof description !== "string" ||
      typeof content !== "string" ||
      (hero_image !== null && typeof hero_image !== "string") ||
      typeof tags !== "string" ||
      typeof author !== "string"
    ) {
      return c.json({ error: "Post fields must be strings" }, 400);
    }

    const draft =
      body.draft === undefined
        ? existing.draft
        : body.draft
          ? 1
          : 0;

    const requestedPublished =
      body.published === undefined ? existing.published : body.published ? 1 : 0;
    const published = draft === 1 ? 0 : requestedPublished;

    const featured =
      body.featured === undefined
        ? existing.featured
        : body.featured
          ? 1
          : 0;

    if (!title.trim() || !slug.trim() || !content.trim()) {
      return c.json(
        {
          error: "title, slug, and content are required",
        },
        400,
      );
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || title.length > 240) {
      return c.json({ error: "title or slug is invalid" }, 400);
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
    const bodyError = bodyErrorResponse(c, error);

    if (bodyError) {
      return bodyError;
    }

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