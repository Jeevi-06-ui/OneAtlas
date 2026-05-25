import { apiError, apiOk } from "@/lib/api-response";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { createSessionToken, sessionCookieOptions } from "@/lib/auth/session";
import { registerSchema } from "@/lib/validators/auth";
import { registerUser } from "@/services/auth-service";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError({ code: "INVALID_JSON", message: "Request body must be JSON." }, 422);
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      {
        code: "INVALID_REGISTER",
        message: "Fix the highlighted fields and try again.",
        details: parsed.error.flatten().fieldErrors,
      },
      422,
    );
  }

  try {
    const user = await registerUser({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
    });
    const token = await createSessionToken(user);
    const response = apiOk({ user });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_IN_USE") {
      return apiError(
        { code: "EMAIL_IN_USE", message: "An account with this email already exists." },
        409,
      );
    }
    return apiError(
      { code: "REGISTER_FAILED", message: "Could not create your account. Try again." },
      500,
    );
  }
}
