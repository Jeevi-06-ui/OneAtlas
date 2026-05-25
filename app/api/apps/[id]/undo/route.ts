import { apiError, apiOk } from "@/lib/api-response";
import { restorePreviousVersion } from "@/services/app-history";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const restored = await restorePreviousVersion(id);
    return apiOk({
      schema: restored.schema,
      newVersion: restored.version,
      mutationSummary: `Restored version ${restored.version}.`,
    });
  } catch (error) {
    return apiError(
      {
        code: "UNDO_FAILED",
        message: error instanceof Error ? error.message : "OneAtlas could not restore the previous snapshot.",
      },
      422,
    );
  }
}
