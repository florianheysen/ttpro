import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
    publicRoutes: ["/auth", "/api/order"],
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
