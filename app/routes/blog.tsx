import PostCard from "app/components/PostCard";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Blog() {
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
          <p>Import and publish posts from the old Astro project here.</p>

          <PostCard
            title="Welcome to Wichita Forever"
            description="A fresh start for Wichita stories, history, and local culture."
            slug="welcome"
            date="August 2026"
          />
          <PostCard
            title="The Music"
            description="A look at the local music scene and the people keeping it alive."
            slug="local-music"
            date="August 2026"
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
