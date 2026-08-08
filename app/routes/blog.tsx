import PostCard from "app/components/PostCard";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import type { Route } from "./+types/blog";

type PostSummary = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  hero_image: string | null;
  created_at: string;
};

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;

  const { results } = await db
    .prepare(
      `SELECT id, title, slug, description, hero_image, created_at
       FROM posts
       WHERE published = 1
       ORDER BY created_at DESC`,
    )
    .all<PostSummary>();

  return { posts: results };
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;

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
          <h2>Latest Posts</h2>

          {posts.length === 0 && (
            <p>No posts yet — run the migration to import the old Astro posts.</p>
          )}

          {posts.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              description={post.description ?? ""}
              slug={post.slug}
              date={new Date(post.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
