#!/usr/bin/env node
import fs from "fs";
import path from "path";

const CONTENT_DIR = process.argv[2] || "./src/content/blog";
const OUTPUT_FILE = "./scripts/migrate.sql";

function parseFrontmatter(fileContent) {
  const fmMatch = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return { frontmatter: {}, body: fileContent };
  const fmText = fmMatch[1];
  const body = fileContent.slice(fmMatch[0].length).trim();
  const frontmatter = {};
  for (const line of fmText.split(/\r?\n/)) {
    const match = line.match(/^(\w+):\s*"?(.*?)"?\s*$/);
    if (match) frontmatter[match[1]] = match[2];
  }
  return { frontmatter, body };
}

function sqlEscape(str) {
  if (str == null) return "NULL";
  return `'${String(str).replace(/'/g, "''")}'`;
}

function toISO(dateStr) {
  if (!dateStr) return new Date().toISOString();
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}

function slugify(filename) {
  return filename.replace(/\.(md|mdx)$/i, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const files = fs.readdirSync(CONTENT_DIR).filter(f => /\.(md|mdx)$/i.test(f));
if (files.length === 0) {
  console.error(`No markdown files found in ${CONTENT_DIR}`);
  process.exit(1);
}

console.log(`Found ${files.length} markdown files in ${CONTENT_DIR}`);
const statements = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
  const { frontmatter, body } = parseFrontmatter(raw);
  const title = frontmatter.title || slugify(file);
  const slug = frontmatter.slug || slugify(file);
  const description = frontmatter.description || "";
  const content = body;
  const heroImage = frontmatter.heroImage || frontmatter.hero_image || "";
  const tags = frontmatter.tags || "";
  const author = frontmatter.author || "Wichita Forever";
  const createdAt = toISO(frontmatter.pubDate || frontmatter.date);
  const draft = frontmatter.draft === "true" ? 1 : 0;
  const published = draft ? 0 : 1;
  const featured = frontmatter.featured === "true" ? 1 : 0;

  statements.push(`INSERT INTO posts (title, slug, description, content, hero_image, tags, author, created_at, updated_at, draft, published, featured, views)
VALUES (${sqlEscape(title)}, ${sqlEscape(slug)}, ${sqlEscape(description)}, ${sqlEscape(content)}, ${sqlEscape(heroImage)}, ${sqlEscape(tags)}, ${sqlEscape(author)}, ${sqlEscape(createdAt)}, ${sqlEscape(createdAt)}, ${draft}, ${published}, ${featured}, 0)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, description=excluded.description, content=excluded.content, hero_image=excluded.hero_image, tags=excluded.tags, author=excluded.author, updated_at=excluded.updated_at, draft=excluded.draft, published=excluded.published, featured=excluded.featured;`);
  console.log(`  ✓ ${file} → slug: ${slug}`);
}

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, statements.join("\n\n") + "\n");
console.log(`\n✅ Generated ${statements.length} INSERT statements → ${OUTPUT_FILE}`);
