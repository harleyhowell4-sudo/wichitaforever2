import { Link } from "react-router";

type PostCardProps = {
  title: string;
  description: string;
  slug: string;
  date?: string;
  heroImage?: string | null;
};

export default function PostCard({
  title,
  description,
  slug,
  date,
  heroImage,
}: PostCardProps) {
  return (
    <article
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        overflow: "hidden",
        marginBottom: "1.5rem",
        transition: "0.2s ease",
      }}
    >
      <Link to={`/post/${slug}`} style={{ textDecoration: "none", color: "inherit" }}>
        {heroImage && (
          <img
            src={heroImage}
            alt={title}
            style={{
              width: "100%",
              height: "800px",
              objectFit: "cover",
              display: "block",
            }}
          />
        )}
      </Link>

      <div style={{ padding: "1.5rem" }}>
        <h2 style={{ marginTop: 0 }}>
          <Link
            to={`/post/${slug}`}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {title}
          </Link>
        </h2>

        <p>{description}</p>

        {date && (
          <small
            style={{
              color: "#777",
            }}
          >
            {date}
          </small>
        )}
      </div>
    </article>
  );
}