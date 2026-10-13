import PostCard from "app/components/PostCard";
import { Link } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PAGE_SIZE = 24;

type PostSummary = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  hero_image: string | null;
  created_at: string;
};

type BlogLoaderArgs = {
  request: Request;
  context: any;
};

type BlogComponentProps = {
  loaderData: {
    posts: PostSummary[];
    page: number;
    hasNext: boolean;
  };
};

export async function loader({ request, context }: BlogLoaderArgs) {
  const db = context.cloudflare.env.DB;
  const requestedPage = Number(new URL(request.url).searchParams.get("page") ?? 1);
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, 10_000)
      : 1;

  const queryResult = await db
    .prepare(
      `SELECT id, title, slug, description, hero_image, created_at
       FROM posts
      WHERE published = 1 AND draft = 0
         AND (tags IS NULL OR tags = '' OR tags = 'blog')
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(PAGE_SIZE + 1, (page - 1) * PAGE_SIZE)
    .all();

  const rows = queryResult.results as PostSummary[];
  return {
    posts: rows.slice(0, PAGE_SIZE),
    page,
    hasNext: rows.length > PAGE_SIZE,
  };
}

export function headers() {
  return { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" };
}

export default function Blog({ loaderData }: BlogComponentProps) {
  const { posts, page, hasNext } = loaderData;

  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="latest-section">
          <div className="page-heading">
            <div>
              <p className="eyebrow">The newsroom</p>
              <h1>Latest posts</h1>
            </div>
          </div>

          {posts.length === 0 && (
            <p className="empty-state">No posts yet. The newsroom is quiet for now.</p>
          )}

          <div className="story-grid">
            {posts.map((post, index) => (
              <PostCard
                key={post.id}
                title={post.title}
                description={post.description ?? ""}
                slug={post.slug}
                heroImage={post.hero_image}
                featured={index === 0}
                date={new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
            ))}
          </div>

          {(page > 1 || hasNext) && (
            <nav
              aria-label="Blog pages"
              className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-5"
            >
              {page > 1 ? (
                <Link to={page === 2 ? "/blog" : `/blog?page=${page - 1}`}>
                  Newer stories
                </Link>
              ) : (
                <span />
              )}
              {hasNext && <Link to={`/blog?page=${page + 1}`}>Older stories</Link>}
            </nav>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
