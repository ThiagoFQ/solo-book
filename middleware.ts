import { authMiddleware } from "@clerk/nextjs";

// Protects all routes including api/trpc routes
export default authMiddleware({
  publicRoutes: ["/api/webhook", "/"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
