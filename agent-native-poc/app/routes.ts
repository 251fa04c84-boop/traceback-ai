import { type RouteConfig, index } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

// Register the public root explicitly. The preview runtime returned a 404 for
// "/" despite the filesystem _index route being present, so keep this route
// deterministic and let flatRoutes discover the remaining workspace routes.
export default [
  index("./routes/_index.tsx"),
  ...(await flatRoutes({
    ignoredRouteFiles: [
      "**/*.test.{ts,tsx}",
      "**/*.spec.{ts,tsx}",
      "**/_index.tsx",
    ],
  })),
] satisfies RouteConfig;
