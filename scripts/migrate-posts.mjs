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
  conso
