import  {Link} from "react-router";
export default function Header() {
  return (
    <Header
        style={{
                background: "#333",
                color: "white",
                padding: "1rem 2rem",
            }}
            <h1 style={{ margin: 0 }}>My Blog</h1>
            <nav style={{ display: "flex", gap: "1rem" }}>
                <Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>
                <Link to="/about" style={{ color: "white", textDecoration: "none" }}>About</Link>   
                </nav>
                </header>
    }