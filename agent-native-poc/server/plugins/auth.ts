import { createToolkitAuthPlugin } from "@agent-native/toolkit/app/auth/server";

export default createToolkitAuthPlugin({
  workspaceAppPublicPaths: ["/"],
  rootAuth: false, // The public synthetic showcase owns /; sign-in remains on /sign-in.
  marketing: false,
});
