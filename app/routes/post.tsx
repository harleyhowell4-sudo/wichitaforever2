import { data, Link } from "react-router";
import xss from "xss";
import { hasValidAdminSession } from "../../workers/auth";
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
  featured: number;
  views: number;
  draft: number;
  published: number;
};

type PostLoaderArgs = {
  request: Request;
  params: { slug: string };
  context: any;
};

type PostComponentProps = {
  loaderData: {
    post: Post;
  };
};

export async function loader({ request, params, context }: PostLoaderArgs) {
  const db = context.cloudflare.env.DB;

  let post = (await db
    .prepare(`
      SELECT
        id, title, slug, description, content, hero_image, tags, author,
        created_at, updated_at, featured, views, draft, published
      FROM posts
      WHERE slug = ? AND published = 1 AND draft = 0
    `)
    .bind(params.slug)
    .first()) as Post | null;

  let privatePreview = false;

  if (
    !post &&
    (await hasValidAdminSession(request, context.cloudflare.env.ADMIN_TOKEN))
  ) {
    post = (await db
      .prepare(`
        SELECT
          id, title, slug, description, content, hero_image, tags, author,
          created_at, updated_at, featured, views, draft, published
        FROM posts
        WHERE slug = ?
      `)
      .bind(params.slug)
      .first()) as Post | null;
    privatePreview = post !== null;
  }
    
  if (!post) {
    throw data("Post not found", { status: 404 });
  }

  return data(
    {
      post: {
        ...post,
        content: xss(post.content ?? "", {
          whiteList: {
            a: ["href", "title"],
            blockquote: [],
            br: [],
            code: [],
            em: [],
            h1: [],
            h2: [],
            h3: [],
            h4: [],
            hr: [],
            i: [],
            img: ["src", "alt", "title", "width", "height"],
            li: [],
            ol: [],
            p: [],
            pre: [],
            strong: [],
            u: [],
            ul: [],
          },
          stripIgnoreTag: true,
          stripIgnoreTagBody: ["script", "style"],
        }),
      },
    },
    {
      headers: {
        "Cache-Control": privatePreview
          ? "no-store"
          : "public, max-age=60, stale-while-revalidate=300",
      },
    },
  );
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