import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

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
      </main>
      <Footer />
    </>
  );
}

