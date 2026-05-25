import { apiError, apiOk } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { fromPrismaJson, toPrismaJson } from "@/lib/prisma-json";
import { editAppInputSchema } from "@/lib/validators/mutation";
import { applyRuntimeMutation } from "@/services/mutation-engine";
import { parseMutationInstruction } from "@/services/mutation-parser";
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
  const parsed = editAppInputSchema.safeParse(payload);

  if (!parsed.success) {
    return apiError(
      {
        code: "INVALID_EDIT_INPUT",
        message: "The edit instruction is invalid.",
        details: parsed.error.flatten().fieldErrors,
      },
      422,
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const app = await tx.app.findUnique({ where: { id } });
      if (!app) {
        throw new Error("APP_NOT_FOUND");
      }

      const currentSchema = fromPrismaJson<RuntimeSchema>(app.currentSchema);
      const parsedMutation = parseMutationInstruction(parsed.data.instruction, currentSchema);
      const applied = applyRuntimeMutation(currentSchema, parsedMutation.mutation);

      if (!applied.result.schemaChanged) {
        await tx.mutationLog.create({
          data: {
            appId: id,
            instruction: parsed.data.instruction,
            mutationType: parsedMutation.mutation.type,
            mutationPayload: toPrismaJson({ ...parsedMutation.mutation, version: app.currentVersion }),
            resultSummary: applied.result.schemaSummary,
          },
        });

        return {
          schema: currentSchema,
          newVersion: app.currentVersion,
          mutationSummary: applied.result.schemaSummary,
        };
      }

      const nextVersion = app.currentVersion + 1;
      const nextSchema: RuntimeSchema = {
        ...applied.schema,
        version: nextVersion,
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
          instruction: parsed.data.instruction,
          mutationType: parsedMutation.mutation.type,
          mutationPayload: toPrismaJson({ ...parsedMutation.mutation, version: nextVersion }),
          resultSummary: applied.result.schemaSummary,
        },
      });

      return {
        schema: nextSchema,
        newVersion: nextVersion,
        mutationSummary: applied.result.schemaSummary,
      };
    });

    const response: EditAppResponse = result;
    return apiOk(response);
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
        code: "APP_EDIT_FAILED",
        message: error instanceof Error ? error.message : "OneAtlas could not apply the schema mutation.",
      },
      422,
    );
  }
}
