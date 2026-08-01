import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import PostCard from "../components/PostCard";

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
      <h2>Wichita Fake News </h2>
      <p>
        Welcome to Wichita Fake News. </p>
        </section>
        <section> 
          <h2>Latest Stroies</h2>
        <PostCard
  title="Welcome to Wichita Forever"
  description="This is the first article in the new Wichita Forever website."
  slug="welcome"
  date="August 2026"
/>

<PostCard
  title="The Return of Local Music"
  description="A look at Wichita's growing independent music scene."
  slug="local-music"
  date="August 2026"
/>
          </section>
          </main>
          <Footer />
    </>
     );