import {
  Form,
  useLoaderData,
  useActionData,
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

export async function loader({
  params,
}: {
  params: { id?: string };
}) {
  const id = params.id;

  if (!id) {
    throw new Response("Post ID is required", { status: 400 });
  }

  const response = await fetch(
    `${process.env.PUBLIC_URL ?? ""}/api/posts/id/${id}`,
  );

  if (!response.ok) {
    throw new Response("Post not found", { status: 404 });
  }

  return response.json();
}

export async function action({
  request,
  params,
}: {
  request: Request;
  params: { id?: string };
}) {
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
  const tags = String(formData.get("tags") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();

  const draft = formData.get("draft") === "on";
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";

  if (!title || !slug || !content) {
    return {
      error: "Title, slug, and content are required.",
    } satisfies ActionData;
  }

  try {
    const response = await fetch(
      new URL(`/api/posts/${id}`, request.url),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          description,
          content,
          tags,
          author,
          draft,
          published,
          featured,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || "Failed to update post.",
      } satisfies ActionData;
    }

    return {
      success: true,
    } satisfies ActionData;
  } catch (error) {
    console.error(error);

    return {
      error: "Unable to connect to the post API.",
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
            Admin
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950">
            Edit Article
          </h1>
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
          <label className="block font-semibold">
            Title

            <input
              name="title"
              defaultValue={post.title}
              required
              className="mt-2 block w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </label>

          <label className="block font-semibold">
            Slug

            <input
              name="slug"
              defaultValue={post.slug}
              required
              className="mt-2 block w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm"
            />
          </label>

          <label className="block font-semibold">
            Description

            <input
              name="description"
              defaultValue={post.description ?? ""}
              className="mt-2 block w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </label>

          <label className="block font-semibold">
            Tags

            <input
              name="tags"
              defaultValue={post.tags ?? ""}
              className="mt-2 block w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </label>

          <label className="block font-semibold">
            Author

            <input
              name="author"
              defaultValue={post.author ?? "Wichita Forever"}
              className="mt-2 block w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </label>

          <label className="block font-semibold">
            Article

            <textarea
              name="content"
              defaultValue={post.content}
              required
              rows={24}
              className="mt-2 block w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm"
            />
          </label>

          <div className="rounded-xl border border-zinc-200 p-5">
            <h2 className="font-bold">Publication</h2>

            <div className="mt-4 space-y-3">
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  name="draft"
                  defaultChecked={post.draft === 1}
                />
                Draft
              </label>

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={post.published === 1}
                />
                Published
              </label>

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={post.featured === 1}
                />
                Featured
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-zinc-950 px-5 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <a
              href="/admin"
              className="rounded-md border border-zinc-300 px-5 py-3 font-bold text-zinc-700"
            >
              Cancel
            </a>
          </div>
        </Form>
      </main>

      <Footer />
    </>
  );
}