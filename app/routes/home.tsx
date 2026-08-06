import Postcard from "app/components/PostCard";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Home() {
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
          <h2>Wichita Fake News</h2>
          <p>Welcome to Wichita Fake News.</p>
        </section>

        <section>
          <h2>Latest Stories</h2>
          <PostCard
            title="Welcome to Wichita Forever"
            description="This is the first article in the new Wichita Forever website."
            slug="welcome"
            date="August 2026"
          />
          <div className="max-w-sm">
            <h3>Project Overview</h3>
            <p>Track progress and recent activity for your React Router app.</p>
            <p>Your design system is ready. Start building your next component.</p>
          </div>
          <Postcard
            title="The Music"
            description="A"
            slug="local-music"
            date="August 2026"
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
