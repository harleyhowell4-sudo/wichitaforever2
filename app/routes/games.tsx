import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Games() {
  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="latest-section">
          <div className="page-heading">
            <div>
              <p className="eyebrow">Behind the headlines</p>
              <h1>Games</h1>
              <p>Hi! We're workin' real hard over here - be back soon!</p>
              <img src="/butters.png" alt="Butters" width="200" height="200" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
