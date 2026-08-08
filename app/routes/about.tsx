import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function About() {
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
          <h2>About Wichita Forever</h2>
          <p>
            This project keeps local Wichita stories, history, music, and culture
            in one place.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
