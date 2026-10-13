import { data, Link } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

type PostLoaderArgs = {
  params: { slug: string };
  context: any;
};

type PostComponentProps = {
  loaderData: {
    post: Post;
  };
};

export async function loader({ params, context }: PostLoaderArgs) {
  const db = context.cloudflare.env.DB;

  const post = (await db
    .prepare(`SELECT * FROM posts WHERE slug = ?`)
    .bind(params.slug)
    .first()) as Post | null;
    
  if (!post) {
    throw data("Post not found", { status: 404 });
  }

  return { post };
}

export function meta({ data }: { data: { post: Post } | undefined }) {
  if (!data) return [{ title: "Post not found — Wichita Forever" }];
  return [
    { title: `${data.post.title} — Wichita Forever` },
    { name: "description", content: data.post.description ?? "" },
  ];
}

export default function Post({ loaderData }: PostComponentProps) {
  const { post } = loaderData;
  const date = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Header />
      <main className="page-shell article-shell">
        <article className="article-page">
          <Link to="/blog" className="article-back">Back to news</Link>
          <header className="article-header">
            <p className="eyebrow">The Wichita Forever file</p>
            <h1>{post.title}</h1>
            <div className="article-meta">
              <time dateTime={post.created_at}>{date}</time>
              {post.author && <span>By {post.author}</span>}
            </div>
          </header>

          {post.hero_image && (
            <img
              src={post.hero_image}
              alt={post.title}
              className="article-image"
            />
          )}

          {post.content && (
            <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} />
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
      <main className="page-shell article-shell">
        <section className="article-error">
          <p className="eyebrow">404 · The missing edition</p>
          <h1>Post not found</h1>
          <p>That story doesn't exist (or got taken down).</p>
          <Link to="/blog" className="article-back">Back to news</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}