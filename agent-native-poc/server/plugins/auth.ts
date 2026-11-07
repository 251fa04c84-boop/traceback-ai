import { createToolkitAuthPlugin } from "@agent-native/toolkit/app/auth/server";

export default createToolkitAuthPlugin({
  workspaceAppPublicPaths: ["/", "/demo"],
  rootAuth: false, // The root redirects to the public synthetic showcase; sign-in remains on /sign-in.
  marketing: false,
});
