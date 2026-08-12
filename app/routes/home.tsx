import PostCard from "app/components/PostCard";
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
          <h2>Wichita Forever</h2>
          <p>Welcome to the Wichita Forever Fake News Division.</p>
        </section>

        <section>
          <h2>Latest Stories</h2>
          
          <PostCard
          
            title="Welcome to Wichita Forever"
            description="Your home for freshly faked news."
            slug="welcome"
            date="August 2026"
          />
          
          <PostCard
            title=""
            description=""
            slug=""
            date="August 2026"
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
