import { defineEventHandler, sendRedirect } from "h3";

// Nitro handles "/" before the React Router catch-all. This keeps the public
// demo reachable even when the framework's root index route is shadowed.
export default defineEventHandler((event) => sendRedirect(event, "/demo", 302));
