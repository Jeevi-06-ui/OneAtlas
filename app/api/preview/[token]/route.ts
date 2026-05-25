import { apiError, apiOk } from "@/lib/api-response";
import { getPreviewSnapshot } from "@/services/preview-service";
import type { FrozenPreviewResponse } from "@/types/api";

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  const snapshot = await getPreviewSnapshot(token);

  if (snapshot.status === "invalid") {
    return apiError(
      {
        code: "INVALID_PREVIEW_TOKEN",
        message: "This preview link does not exist.",
      },
      404,
    );
  }

  if (snapshot.status === "expired") {
    return apiError(
      {
        code: "EXPIRED_PREVIEW_TOKEN",
        message: "This preview link has expired.",
        suggestion: "Create a new preview from the live builder.",
      },
      410,
    );
  }

  const response: FrozenPreviewResponse = {
    token: snapshot.token,
    schema: snapshot.schema,
    createdAt: snapshot.createdAt.toISOString(),
    expiresAt: snapshot.expiresAt?.toISOString() ?? "",
  };

  return apiOk(response);
}
