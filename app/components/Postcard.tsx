import { Link } from "react-router";

type PostCardProps = {
  title: string;
  description: string;
  slug: string;
  date?: string;
};

export default function PostCard({
  title,
  description,
  slug,
  date,
}: PostCardProps) {
  return (
    <article
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "1.5rem",
        marginBottom: "1.5rem",
        transition: "0.2s ease",
      }}
    >
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
    </article>
  );
}