import NextAuth from "next-auth";
import { authConfig } from "./lib/auth";
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoute, publicRoute } from "./routes";
const { auth } = NextAuth(authConfig);

export default auth((req) => {
	// req.auth

	const isLoggedIn = !!req.auth;
	const { nextUrl } = req;
	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
	const isPublicRoute = publicRoute.includes(nextUrl.pathname);
	const isAuthRoute = authRoute.includes(nextUrl.pathname);
	if (isApiAuthRoute) return null;
	if (isAuthRoute) {
		if (isLoggedIn) {
			return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
		}
		return null;
	}
	if (!isLoggedIn && !isPublicRoute) {
		return Response.redirect(new URL("/login", nextUrl));
	}
	return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
