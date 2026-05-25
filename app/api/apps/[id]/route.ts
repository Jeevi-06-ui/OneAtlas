import { z } from "zod";

import { apiError, apiOk } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

const patchAppSchema = z.object({
  name: z.string().trim().min(1).max(120),
});

async function parseJson(request: Request) {
  try {
    return (await request.json()) as unknown;
  } catch {
    return undefined;
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const payload = await parseJson(request);
  const parsed = patchAppSchema.safeParse(payload);

  if (!parsed.success) {
    return apiError(
      {
        code: "INVALID_APP_PATCH",
        message: "App name must be between 1 and 120 characters.",
        details: parsed.error.flatten().fieldErrors,
      },
      422,
    );
  }

  try {
    const app = await prisma.app.update({
      where: { id },
      data: { name: parsed.data.name },
      select: { id: true, name: true },
    });
    return apiOk(app);
  } catch {
    return apiError(
      {
        code: "APP_NOT_FOUND",
        message: "No runtime app exists for this id.",
      },
      404,
    );
  }
}
