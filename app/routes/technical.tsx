import Header from "../components/Header";
import Hero from "../components/Hero";
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
     WHERE published = 1 AND tags = 'technical'
     ORDER BY created_at DESC`,
  ).all();

  return { posts: queryResult.results as PostSummary[] };
}

export default function Technical({ loaderData }: { loaderData: { posts: PostSummary[] } }) {
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
        <Hero />

        <section style={{ marginTop: "2rem" }}>
          <h2>Technical Notes</h2>
          <p>Technical writeups and implementation notes.</p>
        </section>
        {loaderData.posts.length === 0 && <p>No technical notes published yet.</p>}
        {loaderData.posts.map((post) => (
          <PostCard
            key={post.id}
            title={post.title}
            description={post.description ?? ""}
            slug={post.slug}
            heroImage={post.hero_image}
            date={new Date(post.created_at).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })}
          />
        ))}
      </main>
      <Footer />
    </>
  );
}

