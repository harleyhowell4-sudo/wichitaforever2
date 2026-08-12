import { Form, useActionData, useNavigation } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";

type ActionData = { success?: true; error?: string; title?: string };

function makeSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "untitled";
}

export async function action({ request, context }: { request: Request; context: any }) {
  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const category = String(formData.get("category") ?? "");

  if (!title || !content || !["blog", "technical"].includes(category)) {
    return { error: "Add a title, article content, and select Blog or Technical." } satisfies ActionData;
  }

  const db = context.cloudflare.env.DB;
  const baseSlug = makeSlug(title);
  let slug = baseSlug;
  let suffix = 2;
  while (await db.prepare("SELECT id FROM posts WHERE slug = ?").bind(slug).first()) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const now = new Date().toISOString();
  await db.prepare(
    `INSERT INTO posts (title, slug, description, content, tags, author, created_at, updated_at, draft, published)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 0)`,
  ).bind(title, slug, description, content, category, "Wichita Forever", now, now).run();

  return { success: true, title } satisfies ActionData;
}

export default function Write() {
  const result = useActionData<ActionData>();
  const navigation = useNavigation();
  const sending = navigation.state === "submitting";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm font-bold uppercase tracking-widest text-red-600">Writer's desk</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950">Delegate an article</h1>
        <p className="mt-3 text-zinc-600">Submissions are saved as drafts and tagged for the Blog or Technical queue.</p>

        {result?.success && (
          <p className="mt-6 rounded-md bg-green-50 p-4 text-green-800">“{result.title}” has been sent to the queue.</p>
        )}
        {result?.error && <p className="mt-6 rounded-md bg-red-50 p-4 text-red-800">{result.error}</p>}

        <Form method="post" className="mt-8 space-y-6">
          <label className="block font-semibold text-zinc-900">Title
            <input name="title" required className="mt-2 block w-full rounded-md border border-zinc-300 px-3 py-2" />
          </label>
          <label className="block font-semibold text-zinc-900">Short description
            <input name="description" className="mt-2 block w-full rounded-md border border-zinc-300 px-3 py-2" />
          </label>
          <fieldset>
            <legend className="font-semibold text-zinc-900">Queue</legend>
            <div className="mt-2 flex gap-5">
              <label><input type="radio" name="category" value="blog" defaultChecked /> <span className="ml-1">Blog</span></label>
              <label><input type="radio" name="category" value="technical" /> <span className="ml-1">Technical</span></label>
            </div>
          </fieldset>
          <label className="block font-semibold text-zinc-900">Article
            <textarea name="content" required rows={16} className="mt-2 block w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm" placeholder="Write your article here…" />
          </label>
          <button type="submit" disabled={sending} className="rounded-md bg-zinc-950 px-5 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-60">
            {sending ? "Sending…" : "Send to queue"}
          </button>
        </Form>
      </main>
      <Footer />
    </>
  );
}
