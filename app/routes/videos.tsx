import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Videos() {
  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="latest-section videos-page">
          <div className="page-heading">
            <div>
              <p className="eyebrow">The complete uploads playlist</p>
              
              <p>
                Watch the videos from the{" "}
                <a
                  href="https://www.youtube.com/@jackass.theband"
                  target="_blank"
                  rel="noreferrer"
                >
                  Jackass the Band YouTube channel
                </a>
                .
              </p>
            </div>
          </div>
          <div className="video-playlist">
            <iframe
              src="https://www.youtube.com/embed/videoseries?list=UU1ZBbjXBTnyWH_bIcLW82Mg"
              title="All videos from the Jackass the Band YouTube channel"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>
        
      </main>
      <Footer />
    </>
  );
}
