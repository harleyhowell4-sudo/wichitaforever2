import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

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
          <p> Coming Soon</p>
          </section>
          </main>
          <Footer />
    </>
     );