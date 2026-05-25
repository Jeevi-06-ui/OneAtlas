import { apiError, apiOk } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { toPrismaJson } from "@/lib/prisma-json";
import { runtimeSchemaValidator } from "@/lib/validators/runtime";
import type { EditAppResponse } from "@/types/api";
import type { RuntimeSchema } from "@/types/runtime";

async function parseJson(request: Request) {
  try {
    return (await request.json()) as unknown;
  } catch {
    return undefined;
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const payload = await parseJson(request);
  const parsed = runtimeSchemaValidator.safeParse(payload);

  if (!parsed.success) {
    return apiError(
      {
        code: "INVALID_RUNTIME_SCHEMA",
        message: "The runtime schema payload is invalid.",
        details: parsed.error.flatten().fieldErrors,
      },
      422,
    );
  }

  try {
    const saved = await prisma.$transaction(async (tx) => {
      const app = await tx.app.findUnique({ where: { id } });
      if (!app) {
        throw new Error("APP_NOT_FOUND");
      }

      const nextVersion = app.currentVersion + 1;
      const nextSchema: RuntimeSchema = {
        ...parsed.data,
        version: nextVersion,
        metadata: {
          ...parsed.data.metadata,
          lastEditedAt: new Date().toISOString(),
        },
      };

      await tx.app.update({
        where: { id },
        data: {
          currentSchema: toPrismaJson(nextSchema),
          currentVersion: nextVersion,
        },
      });

      await tx.schemaVersion.create({
        data: {
          appId: id,
          version: nextVersion,
          schemaSnapshot: toPrismaJson(nextSchema),
        },
      });

      await tx.mutationLog.create({
        data: {
          appId: id,
          instruction: "Manual save",
          mutationType: "manual_save",
          mutationPayload: toPrismaJson({ version: nextVersion }),
          resultSummary: "Saved runtime changes.",
        },
      });

      return nextSchema;
    });

    const response: EditAppResponse = {
      schema: saved,
      newVersion: saved.version,
      mutationSummary: "Saved runtime changes.",
    };

    return apiOk(response, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "APP_NOT_FOUND") {
      return apiError(
        {
          code: "APP_NOT_FOUND",
          message: "No runtime app exists for this id.",
        },
        404,
      );
    }

    return apiError(
      {
        code: "SAVE_FAILED",
        message: error instanceof Error ? error.message : "OneAtlas could not persist schema changes.",
      },
      422,
    );
  }
}
