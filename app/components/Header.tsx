import { Link } from "react-router";

export default function Header() {
  return (
    <header className="site-header">
      <div className="masthead-inner">
        <Link to="/" className="brand-lockup" aria-label="Wichita Forever home">
          <span className="brand-name">Wichita Forever</span>
          <span className="brand-note"> · Wichita, Kansas · </span>
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/blog">News</Link>
          <Link to="/technical">Technical</Link>
          <Link to="/write">Write</Link>
          <Link to="/about">About</Link>
        </nav>
      </div>
    </header>
  );
}
