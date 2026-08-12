import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import PostCard from "app/components/PostCard";
export default function Technical() {
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
          <p>This area will hold the technical writeups and implementation notes.</p>
        </section>
        <PostCard
                    title="Envelope Follower"
                    description="Logs and detailed descriptions of my envelope follower build."
                    slug=""
                    date="August 2026"
                  />
        
      </main>
      <Footer />
    </>
  );
}

