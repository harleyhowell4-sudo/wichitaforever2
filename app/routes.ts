import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  index("routes/blog.tsx"),
  index("routes/about.tsx"),
  index("routes/technical.tsx"),
] satisfies RouteConfig;