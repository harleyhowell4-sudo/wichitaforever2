import { useEffect, useState } from "react";
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
  created_at: string | null;
  updated_at: string | null;
  draft: number;
  published: number;
  featured: number;
  views: number;
};

export default function Admin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPosts() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/posts");

      if (!response.ok) {
        throw new Error("Failed to load posts.");
      }

      const data = await response.json();

      setPosts(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load posts.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

 async function publishPost(id: number) {
  try {
    const response = await fetch(
      `/api/posts/${id}/publish`,
      {
        method: "POST",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to publish.");
    }

    await loadPosts();
  } catch (err) {
    console.error(err);
    setError("Unable to publish post.");
  }
}
  async function deletePost(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this post?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete.");
      }

      await loadPosts();
    } catch (err) {
      console.error(err);
      setError("Unable to delete post.");
    }
  }

  const drafts = posts.filter((post) => post.draft === 1);
  const published = posts.filter((post) => post.published === 1);

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-red-600">
              Wichita Forever
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950">
              Admin Dashboard
            </h1>

            <p className="mt-3 text-zinc-600">
              Manage drafts and published articles.
            </p>
          </div>

          <a
            href="/write"
            className="inline-flex rounded-md bg-zinc-950 px-5 py-3 font-bold text-white hover:bg-red-700"
          >
            New Article
          </a>
        </div>

        {error && (
          <div className="mt-6 rounded-md bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-10 rounded-xl border border-zinc-200 p-8 text-zinc-600">
            Loading posts...
          </div>
        ) : (
          <>
            {/* DRAFTS */}
            <section className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-black text-zinc-950">
                  Drafts
                </h2>

                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-800">
                  {drafts.length}
                </span>
              </div>

              {drafts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-zinc-500">
                  No drafts waiting for review.
                </div>
              ) : (
                <div className="space-y-4">
                  {drafts.map((post) => (
                    <article
                      key={post.id}
                      className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex flex-col justify-between gap-4 md:flex-row">
                        <div>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-bold text-yellow-800">
                              DRAFT
                            </span>

                            {post.tags && (
                              <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-bold text-zinc-600">
                                {post.tags}
                              </span>
                            )}
                          </div>

                          <h3 className="mt-3 text-xl font-bold text-zinc-950">
                            {post.title}
                          </h3>

                          {post.description && (
                            <p className="mt-2 text-zinc-600">
                              {post.description}
                            </p>
                          )}

                          <p className="mt-3 text-sm text-zinc-500">
                            {post.author || "Unknown author"}
                          </p>

                          <p className="mt-1 text-xs text-zinc-400">
                            ID: {post.id} · /post/{post.slug}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2">
                          <a
                            href={`/admin/edit/${post.id}`}
                            className="rounded-md border border-zinc-300 px-4 py-2 font-bold text-zinc-700 hover:bg-zinc-50"
                          >
                            Edit
                          </a>

                          <button
                            type="button"
                            onClick={() => publishPost(post.id)}
                            className="rounded-md bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700"
                          >
                            Publish
                          </button>

                          <a
                            href={`/post/${post.slug}`}
                            className="rounded-md border border-zinc-300 px-4 py-2 font-bold text-zinc-700 hover:bg-zinc-50"
                          >
                            Preview
                          </a>

                          <button
                            type="button"
                            onClick={() => deletePost(post.id)}
                            className="rounded-md border border-red-300 px-4 py-2 font-bold text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* PUBLISHED */}
            <section className="mt-12">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-black text-zinc-950">
                  Published
                </h2>

                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-800">
                  {published.length}
                </span>
              </div>

              {published.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-zinc-500">
                  No published posts.
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                  {published.map((post) => (
                    <article
                      key={post.id}
                      className="flex flex-col justify-between gap-4 border-b border-zinc-200 p-5 last:border-b-0 md:flex-row md:items-center"
                    >
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-800">
                            PUBLISHED
                          </span>

                          {post.featured === 1 && (
                            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700">
                              FEATURED
                            </span>
                          )}
                        </div>

                        <h3 className="mt-2 font-bold text-zinc-950">
                          {post.title}
                        </h3>

                        <p className="mt-1 text-sm text-zinc-500">
                          {post.views} views · /post/{post.slug}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`/admin/edit/${post.id}`}
                          className="rounded-md border border-zinc-300 px-4 py-2 font-bold text-zinc-700 hover:bg-zinc-50"
                        >
                          Edit
                        </a>

                        <a
                          href={`/post/${post.slug}`}
                          className="rounded-md border border-zinc-300 px-4 py-2 font-bold text-zinc-700 hover:bg-zinc-50"
                        >
                          View
                        </a>

                        <button
                          type="button"
                          onClick={() => deletePost(post.id)}
                          className="rounded-md border border-red-300 px-4 py-2 font-bold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}