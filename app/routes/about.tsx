import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="latest-section about-copy">
          <div className="page-heading">
            <div>
              <p className="eyebrow">A brief explanation</p>
              <h1>About Wichita Forever</h1>
            </div>
          </div>
          <p>Wichita Fake News</p>
          <ul className="about-acronym">
            <li>F-ounders</li>
            <li>O-f</li>
            <li>R-egional</li>
            <li>E-nterprises</li>
            <li>V-ery</li>
            <li>E-xponential</li>
            <li>R-oofus</li>
          </ul>
          <p>We're fore, but we're also ver.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}

