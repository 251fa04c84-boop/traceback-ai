import { type RouteConfig, route } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

// Register the public showcase as an explicit "/" path. Keep all other
// workspace routes file-based and exclude the showcase file from discovery.
export default [
  route("/", "./routes/_index.tsx"),
  ...(await flatRoutes({
    ignoredRouteFiles: [
      "**/*.test.{ts,tsx}",
      "**/*.spec.{ts,tsx}",
      "**/_index.tsx",
    ],
  })),
] satisfies RouteConfig;
