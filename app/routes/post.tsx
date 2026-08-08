import { data } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { Route } from "./+types/post";

type Post = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  hero_image: string | null;
  tags: string | null;
  author: string | null;
  created_at: string;
  updated_at: string;
  draft: number;
  published: number;
  featured: number;
  views: number;
};

export async function loader({ params, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;

  const post = await db
    .prepare(`SELECT * FROM posts WHERE slug = ?`)
    .bind(params.slug)
    .first<Post>();

  if (!post) {
    throw data("Post not found", { status: 404 });
  }

  return { post };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) return [{ title: "Post not found — Wichita Forever" }];
  return [
    { title: `${data.post.title} — Wichita Forever` },
    { name: "description", content: data.post.description ?? "" },
  ];
}

export default function Post({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;
  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Header />
      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        <article>
          <h1 style={{ marginBottom: "0.25rem" }}>{post.title}</h1>
          <p style={{ color: "#777", marginTop: 0 }}>
            {date}
            {post.author ? ` · ${post.author}` : ""}
          </p>

          {post.hero_image && (
            <img
              src={post.hero_image}
              alt={post.title}
              style={{ width: "100%", height: "auto", borderRadius: "8px", margin: "1.5rem 0" }}
            />
          )}

          {post.content && (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}

export function ErrorBoundary() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
        <h1>Post not found</h1>
        <p>That story doesn't exist (or got taken down).</p>
      </main>
      <Footer />
    </>
  );
}
