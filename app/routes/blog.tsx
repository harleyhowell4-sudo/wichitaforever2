import PostCard from "app/components/PostCard";
import Header from "../components/Header";
import Footer from "../components/Footer";

type PostSummary = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  hero_image: string | null;
  created_at: string;
};

type BlogLoaderArgs = {
  context: any;
};

type BlogComponentProps = {
  loaderData: {
    posts: PostSummary[];
  };
};

export async function loader({ context }: BlogLoaderArgs) {
  const db = context.cloudflare.env.DB;

  const queryResult = await db
    .prepare(
      `SELECT id, title, slug, description, hero_image, created_at
       FROM posts
       WHERE published = 1
         AND (tags IS NULL OR tags = '' OR tags = 'blog')
       ORDER BY created_at DESC`,
    )
    .all();

  const posts = queryResult.results as PostSummary[];
  return { posts };
}

export default function Blog({ loaderData }: BlogComponentProps) {
  const { posts } = loaderData;

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
        </section>
      </main>
      <Footer />
    </>
  );
}
