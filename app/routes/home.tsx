import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  slug: string;
  description: string;
  created_at: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then(setPosts)
      .catch(console.error);
  }, []);

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <h1>Wichita Forever</h1>

      <p>Music • History • Art • Culture</p>

      <hr />

      <h2>Latest Stories</h2>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <article
            key={post.id}
            style={{
              marginBottom: "2rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid #ddd",
            }}
          >
            <h3>{post.title}</h3>

            <p>{post.description}</p>

            <small>{post.created_at}</small>
          </article>
        ))
      )}
    </main>
  );
}