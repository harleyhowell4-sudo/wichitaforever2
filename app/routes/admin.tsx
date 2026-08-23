import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Admin() {
  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-sm font-bold uppercase tracking-widest text-red-600">
          Wichita Forever
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-950">
          Admin Dashboard
        </h1>

        <p className="mt-3 text-zinc-600">
          Manage drafts and published articles.
        </p>

        <section className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-950">
            Dashboard
          </h2>

          <p className="mt-2 text-zinc-600">
            Your post management tools will appear here next.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}