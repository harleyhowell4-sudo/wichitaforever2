import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";

import Header from "../components/Header";
import Footer from "../components/Footer";

type Post = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  content: string;
  hero_image: string | null;
  tags: string | null;
  author: string | null;
  draft: number;
  published: number;
  featured: number;
};

type ActionData = {
  success?: boolean;
  error?: string;
};

type LoaderArgs = {
  params: {
    id?: string;
  };
  context: any;
};

type ActionArgs = {
  request: Request;
  params: {
    id?: string;
  };
  context: any;
};

export async function loader({
  params,
  context,
}: LoaderArgs) {
  const id = params.id;

  if (!id) {
    throw new Response("Post ID is required", {
      status: 400,
    });
  }

  const db = context.cloudflare.env.DB;

  const post = await db
    .prepare(`
      SELECT
        id,
        title,
        slug,
        description,
        content,
        hero_image,
        tags,
        author,
        draft,
        published,
        featured
      FROM posts
      WHERE id = ?
    `)
    .bind(id)
    .first() as Post | null;

  if (!post) {
    throw new Response("Post not found", {
      status: 404,
    });
  }

  return post;
}

export async function action({
  request,
  params,
  context,
}: ActionArgs) {
  const id = params.id;

  if (!id) {
    return {
      error: "Post ID is missing.",
    } satisfies ActionData;
  }

  const formData = await request.formData();

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const heroImage = String(formData.get("hero_image") ?? "").trim();
  const tags = String(formData.get("tags") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();

  const draft = formData.get("draft") === "on" ? 1 : 0;
  const published = formData.get("published") === "on" ? 1 : 0;
  const featured = formData.get("featured") === "on" ? 1 : 0;

  if (!title || !slug || !content) {
    return {
      error: "Title, slug, and content are required.",
    } satisfies ActionData;
  }

  try {
    const db = context.cloudflare.env.DB;

    const existing = await db
      .prepare(`
        SELECT id
        FROM posts
        WHERE id = ?
      `)
      .bind(id)
      .first();

    if (!existing) {
      return {
        error: "Post not found.",
      } satisfies ActionData;
    }

    const duplicateSlug = await db
      .prepare(`
        SELECT id
        FROM posts
        WHERE slug = ?
        AND id != ?
      `)
      .bind(slug, id)
      .first();

    if (duplicateSlug) {
      return {
        error: "A different post already uses that slug.",
      } satisfies ActionData;
    }

    const now = new Date().toISOString();

    await db
      .prepare(`
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
        heroImage || null,
        tags,
        author || "Wichita Forever",
        now,
        draft,
        published,
        featured,
        id,
      )
      .run();

    return {
      success: true,
    } satisfies ActionData;
  } catch (error) {
    console.error("EDIT POST ERROR:", error);

    return {
      error: "Failed to save post.",
    } satisfies ActionData;
  }
}

export default function AdminEdit() {
  const post = useLoaderData<Post>();
  const result = useActionData<ActionData>();
  const navigation = useNavigation();

  const saving = navigation.state === "submitting";

  return (
    <>
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-red-600">
            Wichita Forever
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950">
            Edit Article
          </h1>

          <p className="mt-3 text-zinc-600">
            Editing post #{post.id}
          </p>
        </div>

        {result?.success && (
          <div className="mb-6 rounded-md bg-green-50 p-4 text-green-800">
            Post saved successfully.
          </div>
        )}

        {result?.error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-red-800">
            {result.error}
          </div>
        )}

        <Form method="post" className="space-y-6">
          <label className="block font-semibold text-zinc-900">
            Title
            <input
              name="title"
              required
              defaultValue={post.title}
              className="mt-2 block w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </label>

          <label className="block font-semibold text-zinc-900">
            Slug
            <input
              name="slug"
              required
              defaultValue={post.slug}
              className="mt-2 block w-full rounded-md border border-zinc-300 px-3 py-2 font-mono"
            />
          </label>

          <label className="block font-semibold text-zinc-900">
            Short description
            <input
              name="description"
              defaultValue={post.description ?? ""}
              className="mt-2 block w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </label>

          <label className="block font-semibold text-zinc-900">
            Hero image
            <input
              name="hero_image"
              defaultValue={post.hero_image === "NULL" ? "" : post.hero_image ?? ""}
              placeholder="/image.png"
              className="mt-2 block w-full rounded-md border border-zinc-300 px-3 py-2 font-mono"
            />
          </label>

          <label className="block font-semibold text-zinc-900">
            Tags
            <input
              name="tags"
              defaultValue={post.tags ?? ""}
              className="mt-2 block w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </label>

          <label className="block font-semibold text-zinc-900">
            Author
            <input
              name="author"
              defaultValue={post.author ?? "Wichita Forever"}
              className="mt-2 block w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </label>

          <label className="block font-semibold text-zinc-900">
            Article
            <textarea
              name="content"
              required
              rows={24}
              defaultValue={post.content}
              className="mt-2 block w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm"
            />
          </label>

          <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
            <h2 className="text-lg font-bold text-zinc-950">
              Publication Settings
            </h2>

            <div className="mt-4 space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="draft"
                  defaultChecked={post.draft === 1}
                  className="h-4 w-4"
                />
                <span>Draft</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={post.published === 1}
                  className="h-4 w-4"
                />
                <span>Published</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={post.featured === 1}
                  className="h-4 w-4"
                />
                <span>Featured Post</span>
              </label>
            </div>
          </section>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-zinc-950 px-4 py-2 font-semibold text-white hover:bg-zinc-800 disabled:bg-zinc-400"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </Form>
      </main>

      <Footer />
    </>
  );
}
