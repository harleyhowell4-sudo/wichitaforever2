import Header from "../components/Header";
import Footer from "../components/Footer";
import PostCard from "app/components/PostCard";

type PostSummary = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  hero_image: string | null;
  created_at: string;
};

export async function loader({ context }: { context: any }) {
  const queryResult = await context.cloudflare.env.DB.prepare(
    `SELECT id, title, slug, description, hero_image, created_at
     FROM posts
    WHERE published = 1 AND draft = 0 AND tags = 'technical'
     ORDER BY created_at DESC`,
  ).all();

  return { posts: queryResult.results as PostSummary[] };
}

export default function Technical({ loaderData }: { loaderData: { posts: PostSummary[] } }) {
  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="latest-section">
          <div className="page-heading">
            <div>
              <p className="eyebrow">Behind the headlines</p>
              <h1>Technical notes</h1>
              <p>Technical writeups and implementation notes.</p>
            </div>
          </div>
          {loaderData.posts.length === 0 ? (
            <p className="empty-state">No technical notes published yet.</p>
          ) : (
            <div className="story-grid">
              {loaderData.posts.map((post, index) => (
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

