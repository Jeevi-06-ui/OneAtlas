import { prisma } from "@/lib/prisma";
import { fromPrismaJson, toPrismaJson } from "@/lib/prisma-json";
import type { MutationHistoryItem } from "@/types/mutation";
import type { RuntimeSchema } from "@/types/runtime";

export async function getAppHistory(appId: string): Promise<MutationHistoryItem[]> {
  const logs = await prisma.mutationLog.findMany({
    where: { appId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return logs.map((log) => ({
    id: log.id,
    version: Number(log.mutationPayload && typeof log.mutationPayload === "object" && "version" in log.mutationPayload ? log.mutationPayload.version : 0),
    instruction: log.instruction,
    mutationType: log.mutationType as MutationHistoryItem["mutationType"],
    resultSummary: log.resultSummary,
    createdAt: log.createdAt.toISOString(),
  }));
}

export async function restorePreviousVersion(appId: string) {
  return prisma.$transaction(async (tx) => {
    const app = await tx.app.findUnique({
      where: { id: appId },
      include: {
        versions: {
          orderBy: { version: "desc" },
          take: 2,
        },
      },
    });

    if (!app) {
      throw new Error("App not found.");
    }

    const previousVersion = app.versions.find((version) => version.version < app.currentVersion);
    if (!previousVersion) {
      throw new Error("No previous version is available to restore.");
    }

    const restoredSchema = fromPrismaJson<RuntimeSchema>(previousVersion.schemaSnapshot);
    const restored = await tx.app.update({
      where: { id: appId },
      data: {
        currentSchema: toPrismaJson(restoredSchema),
        currentVersion: previousVersion.version,
      },
    });

    await tx.mutationLog.create({
      data: {
        appId,
        instruction: "Undo to previous schema snapshot",
        mutationType: "undo",
        mutationPayload: toPrismaJson({ restoredVersion: previousVersion.version }),
        resultSummary: `Restored version ${previousVersion.version}.`,
      },
    });

    return {
      schema: fromPrismaJson<RuntimeSchema>(restored.currentSchema),
      version: restored.currentVersion,
    };
  });
}
