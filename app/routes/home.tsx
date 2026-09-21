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
      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        <Hero />

        <section>
          <h2>Welcome to the Wichita Forever Fake News Division.</h2>
        </section>

        <section>
          <h2>Latest Stories</h2>

          {posts.length === 0 && <p>No posts yet.</p>}

          {posts.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              description={post.description ?? ""}
              slug={post.slug}
              heroImage={post.hero_image}
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
