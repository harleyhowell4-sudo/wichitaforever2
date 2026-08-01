export default function Footer() {
    return (
        <footer
            style={{
                marginTop: 
                "4rem",
                padding: "2rem",
                borderTop: "1px solid #ddd",
                textAlign: "center",
            }}
        > {new Date().getFullYear()} &copy; Wichita Forever Fake News D1. All rights reserved.
        </footer>
    );
}