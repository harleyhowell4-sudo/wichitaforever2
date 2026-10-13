import PostCard from "app/components/PostCard";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

type PostSummary = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  hero_image: string | null;
  created_at: string;
};

type HomeLoaderArgs = {
  context: any;
};

type HomeComponentProps = {
  loaderData: {
    posts: PostSummary[];
  };
};

export async function loader({ context }: HomeLoaderArgs) {
  const db = context.cloudflare.env.DB;

  const queryResult = await db
    .prepare(
      `SELECT id, title, slug, description, hero_image, created_at
       FROM posts
       WHERE published = 1
       ORDER BY created_at DESC
       LIMIT 3`,
    )
    .all();

  return { posts: queryResult.results as PostSummary[] };
}

export default function Home({ loaderData }: HomeComponentProps) {
  const { posts } = loaderData;

  return (
    <>
      <Header />
      <main className="page-shell">
        <Hero />

        <section className="latest-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Fresh off the wire</p>
              <h2>Latest stories</h2>
            </div>
            <span className="section-rule" aria-hidden="true" />
          </div>

          {posts.length === 0 ? (
            <p className="empty-state">No stories in the newsroom yet.</p>
          ) : (
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
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
