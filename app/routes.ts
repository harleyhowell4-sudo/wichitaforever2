import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/blog", "routes/blog.tsx"),
  route("/about", "routes/about.tsx"),
  route("/technical", "routes/technical.tsx"),
] satisfies RouteConfig;