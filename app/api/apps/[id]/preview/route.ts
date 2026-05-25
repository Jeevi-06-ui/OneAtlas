import { apiError, apiOk } from "@/lib/api-response";
import { createPreviewSnapshot } from "@/services/preview-service";
import type { PreviewSnapshotResponse } from "@/types/api";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const snapshot = await createPreviewSnapshot(id);
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
    const response: PreviewSnapshotResponse = {
      previewUrl: `${origin}/preview/${snapshot.token}`,
      token: snapshot.token,
      expiresAt: snapshot.expiresAt?.toISOString() ?? "",
    };

    return apiOk(response, 201);
  } catch (error) {
    return apiError(
      {
        code: "PREVIEW_CREATION_FAILED",
        message: error instanceof Error ? error.message : "OneAtlas could not create a preview snapshot.",
      },
      422,
    );
  }
}
