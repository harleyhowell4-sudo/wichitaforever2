import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Videos() {
  return (
    <>
      <Header />
      <main className="page-shell">
        <section className="latest-section videos-page">
          <div className="page-heading video-page-heading">
            <div className="video-heading-copy">
              <p className="eyebrow">Jackass the Band</p>
              <h1>Videos</h1>
              <p>All channel uploads.</p>
            </div>
            <div className="video-header-art" aria-hidden="true">
              <svg viewBox="0 0 260 190" role="presentation">
                <path className="video-art-orbit" d="M18 137C45 25 188 11 236 79c39 56-47 104-128 85C48 151 38 93 103 58" />
                <path className="video-art-bolt" d="m162 14-49 76h36l-31 78 78-99h-39l26-55z" />
                <circle className="video-art-sun" cx="75" cy="113" r="27" />
                <path className="video-art-sun-lines" d="M75 74v-9m0 96v-9m39-39h9m-96 0h9m66-28 7-7m-68 68 7-7m0-54-7-7m68 68-7-7" />
                <path className="video-art-squiggle" d="M13 36c10-15 20 15 30 0s20 15 30 0 20 15 30 0" />
                <path className="video-art-star" d="m220 128 5 13 13 5-13 5-5 13-5-13-13-5 13-5z" />
              </svg>
            </div>
          </div>
          <div className="video-playlist-card">
            <div className="video-playlist-ribbon" aria-hidden="true" />
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
            <aside className="video-playlist-details" aria-label="Playlist details">
              <div className="video-side-doodle" aria-hidden="true">
                <span className="video-doodle-orbit" />
                <span className="video-doodle-star">✳</span>
              </div>
              <h2>All uploads</h2>
              <p>
                The complete video archive from Jackass the Band.
              </p>
              <a
                className="video-channel-link"
                href="https://www.youtube.com/@jackass.theband"
                target="_blank"
                rel="noreferrer"
              >
                Visit the YouTube channel <span aria-hidden="true">↗</span>
              </a>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
