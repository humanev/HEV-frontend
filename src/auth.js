import {ApiError} from "./api";

let demoMember = null;

export function clearAuthToken() {
  demoMember = null;
}

export async function authRequest(path, options = {}) {
  const body = typeof options.body === "string" ? JSON.parse(options.body) : options.body || {};
  if (path === "/api/auth/me") {
    if (!demoMember) throw new ApiError("No demo account is signed in.", 401);
    return { user: demoMember };
  }
  if (path === "/api/auth/member/register" || path === "/api/auth/member/login") {
    if (!body.email) throw new ApiError("Enter an email address.");
    if (path.endsWith("/register") && !body.fullName) throw new ApiError("Enter your full name.");
    demoMember = {
      id: 1,
      fullName: body.fullName || body.email.split("@")[0],
      email: body.email,
      membershipPlan: "Free Member"
    };
    return { user: demoMember, token: "frontend-demo" };
  }
  throw new ApiError(`No frontend demo handler is defined for ${path}.`, 404);
}
