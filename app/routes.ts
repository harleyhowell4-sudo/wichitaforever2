import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/blog", "routes/blog.tsx"),
  route("/post/:slug", "routes/post.tsx"),
  route("/about", "routes/about.tsx"),
  route("/technical", "routes/technical.tsx"),
  route("/write", "routes/write.tsx"),
] satisfies RouteConfig;
