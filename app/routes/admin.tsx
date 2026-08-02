export default function Admin() {
  async function importPosts() {
    try {
      const res = await fetch("/api/posts.ts", {
        method: "POST",
      });

      const data = await res.json();

      console.log(data);
      alert("Import complete!");
    } catch (err) {
      console.error(err);
      alert("Import failed");
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-4xl font-bold">Admin</h1>

      <div className="mt-8 rounded-xl border p-6">
        <h2 className="text-2xl font-semibold">Import Astro Blog</h2>

        <p className="mt-3 text-zinc-600">
          Import every Markdown article from the old Astro project into D1.
        </p>

        <button
          onClick={importPosts}
          className="mt-6 rounded-lg bg-black px-6 py-3 text-white hover:bg-zinc-800"
        >
          Import Posts
        </button>
      </div>
    </main>
  );
}