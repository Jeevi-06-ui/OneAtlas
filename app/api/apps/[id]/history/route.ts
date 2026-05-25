import { apiError, apiOk } from "@/lib/api-response";
import { getAppHistory } from "@/services/app-history";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const history = await getAppHistory(id);
    return apiOk({ history });
  } catch {
    return apiError(
      {
        code: "HISTORY_LOOKUP_FAILED",
        message: "OneAtlas could not load mutation history for this app.",
      },
      500,
    );
  }
}
