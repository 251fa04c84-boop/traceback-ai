import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

// The public landing page is served at /demo. Nitro redirects / to that
// route before the React Router catch-all; keep the framework index unused.
export default flatRoutes({
  ignoredRouteFiles: [
    "**/*.test.{ts,tsx}",
    "**/*.spec.{ts,tsx}",
    "**/_index.tsx",
  ],
}) satisfies RouteConfig;
