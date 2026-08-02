INSERT INTO posts (title, slug, description, content, hero_image, tags, author, created_at, updated_at, draft, published, featured, views)
VALUES ('They need **`YOUR`** help! Click now!', 'ad', '', '', '/putin.png', '', 'Wichita Forever', '2024-06-01T05:00:00.000Z', '2024-06-01T05:00:00.000Z', 0, 1, 0, 0)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, description=excluded.description, content=excluded.content, hero_image=excluded.hero_image, tags=excluded.tags, author=excluded.author, updated_at=excluded.updated_at, draft=excluded.draft, published=excluded.published, featured=excluded.featured;

INSERT INTO posts (title, slug, description, content, hero_image, tags, author, created_at, updated_at, draft, published, featured, views)
VALUES ('Fair Use', 'fairuse', '', '<p>
	<img
  src="/fairusescreenshot.png"
  width="1600"
  height="900"
  decoding="async"
  loading="lazy"
  alt="A description of my image."
/>
</p>', '/fairusescreenshot.png', '', 'Wichita Forever', '2024-06-19T05:00:00.000Z', '2024-06-19T05:00:00.000Z', 0, 1, 0, 0)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, description=excluded.description, content=excluded.content, hero_image=excluded.hero_image, tags=excluded.tags, author=excluded.author, updated_at=excluded.updated_at, draft=excluded.draft, published=excluded.published, featured=excluded.featured;

INSERT INTO posts (title, slug, description, content, hero_image, tags, author, created_at, updated_at, draft, published, featured, views)
VALUES ('Mr. Beast Hidden Treasure Hiding under the Hidden Troll!', 'mrbeast', '', '<p>
#####	Go get after it kids!
</p>', '/mrbeast.png', '', 'Wichita Forever', '2026-07-26T05:00:00.000Z', '2026-07-26T05:00:00.000Z', 0, 1, 0, 0)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, description=excluded.description, content=excluded.content, hero_image=excluded.hero_image, tags=excluded.tags, author=excluded.author, updated_at=excluded.updated_at, draft=excluded.draft, published=excluded.published, featured=excluded.featured;

INSERT INTO posts (title, slug, description, content, hero_image, tags, author, created_at, updated_at, draft, published, featured, views)
VALUES ('Local Teenagers Addicted to Narcan', 'narcan', 'I felt like I almost felt something...', '"...I feel like I almost felt something - I think"', '/sad boy.png', '', 'Wichita Forever', '2022-07-08T05:00:00.000Z', '2022-07-08T05:00:00.000Z', 0, 1, 0, 0)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, description=excluded.description, content=excluded.content, hero_image=excluded.hero_image, tags=excluded.tags, author=excluded.author, updated_at=excluded.updated_at, draft=excluded.draft, published=excluded.published, featured=excluded.featured;

INSERT INTO posts (title, slug, description, content, hero_image, tags, author, created_at, updated_at, draft, published, featured, views)
VALUES ('Senator Roger Marshall Shits Himself On Stage...', 'rogermarshall', 'Attendees wary of an ''Unfriended 2''.', '<p>
#####	Attendees wary of an "Unfriended 2".
</p>', '/rogermarshall.png', '', 'Wichita Forever', '2024-06-19T05:00:00.000Z', '2024-06-19T05:00:00.000Z', 0, 1, 0, 0)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, description=excluded.description, content=excluded.content, hero_image=excluded.hero_image, tags=excluded.tags, author=excluded.author, updated_at=excluded.updated_at, draft=excluded.draft, published=excluded.published, featured=excluded.featured;
