import { Link } from "react-router";

type PostCardProps = {
  title: string;
  description: string;
  slug: string;
  date?: string;
  heroImage?: string | null;
  featured?: boolean;
};

export default function PostCard({
  title,
  description,
  slug,
  date,
  heroImage,
  featured = false,
}: PostCardProps) {
  return (
    <article
      className={`story-card${featured ? " story-card--featured" : ""}${
        heroImage ? "" : " story-card--no-image"
      }`}
    >
      {heroImage && (
        <Link to={`/post/${slug}`} className="story-image-link" aria-label={`Read ${title}`}>
          <img
            src={heroImage}
            alt={title}
            className="story-image"
          />
        </Link>
      )}

      <div className="story-copy">
        <p className="story-kicker">{featured ? "The lead story" : "From the desk"}</p>
        <h2>
          <Link to={`/post/${slug}`}>{title}</Link>
        </h2>
        {description && <p className="story-description">{description}</p>}
        {date && <time className="story-date">{date}</time>}
      </div>
    </article>
  );
}