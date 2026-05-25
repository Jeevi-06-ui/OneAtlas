import { SESSION_COOKIE } from "@/lib/auth/constants";
import { createSessionToken, sessionCookieOptions } from "@/lib/auth/session";
import { apiError, apiOk } from "@/lib/api-response";
import { loginSchema } from "@/lib/validators/auth";
import { authenticateUser } from "@/services/auth-service";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError({ code: "INVALID_JSON", message: "Request body must be JSON." }, 422);
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      {
        code: "INVALID_LOGIN",
        message: "Check your email and password.",
        details: parsed.error.flatten().fieldErrors,
      },
      422,
    );
  }

  try {
    const user = await authenticateUser(parsed.data);
    const token = await createSessionToken(user);
    const response = apiOk({ user });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return apiError(
        { code: "INVALID_CREDENTIALS", message: "Invalid email or password." },
        401,
      );
    }
    return apiError(
      { code: "LOGIN_FAILED", message: "Could not sign you in. Try again." },
      500,
    );
  }
}
