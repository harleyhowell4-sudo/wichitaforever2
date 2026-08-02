import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { PostCard } from "../components/PostCard";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        <Hero />

        <section>
          <h2>Wichita Fake News</h2>
          <p>Welcome to Wichita Fake News.</p>
        </section>

        <section>
          <h2>Latest Stories</h2>
          <PostCard
            title="Welcome to Wichita Forever"
            description="This is the first article in the new Wichita Forever website."
            slug="welcome"
            date="August 2026"
          />
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
              <CardDescription>
                Track progress and recent activity for your React Router app.
              </CardDescription>
            </CardHeader>
            <CardContent>
              Your design system is ready. Start building your next component.
            </CardContent>
          </Card>
          <PostCard
            title="The Music"
            description="A"
            slug="local-music"
            date="August 2026"
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
