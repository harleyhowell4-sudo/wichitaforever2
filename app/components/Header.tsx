import { Link, NavLink } from "react-router";

export default function Header() {
  return (
    <header className="site-header">
      <div className="masthead-inner">
        <Link to="/" className="brand-lockup" aria-label="Wichita Forever home">
          <span className="brand-name">Wichita Forever</span>
          <span className="brand-note"> · Fake News Division · </span>
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/blog">News</NavLink>
          <NavLink to="/videos">Videos</NavLink>
          <NavLink to="/games">Games</NavLink>
          <NavLink to="/technical">Technical</NavLink>
          <NavLink to="/write">Write</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </div>
    </header>
  );
}
