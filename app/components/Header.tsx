import { Link } from "react-router";

export default function Header() {
  return (
    <header className="border-b bg-zinc-950 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          to="/"
          className="text-3xl font-black tracking-tight hover:text-red-400 transition-colors"
        >
          Wichita Forever
        </Link>

        <nav className="flex gap-6 text-sm uppercase font-semibold tracking-wide">
          <Link to="/">Home</Link>
          <Link to="/music">Music</Link>
          <Link to="/history">History</Link>
          <Link to="/events">Events</Link>
          <Link to="/about">About</Link>
        </nav>
      </div>
    </header>
  );
}