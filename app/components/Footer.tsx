export default function Footer() {
    return (
        <footer className="site-footer">
            <p>Wichita Forever <span>·</span> Wichita, Kansas</p>
            <small>{new Date().getFullYear()} · Independent news from an alternate reality.</small>
        </footer>
    );
}