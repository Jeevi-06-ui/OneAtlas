import { nanoid } from "nanoid";

import { prisma } from "@/lib/prisma";
import { fromPrismaJson, toPrismaJson } from "@/lib/prisma-json";
import type { RuntimeSchema } from "@/types/runtime";

const PREVIEW_TTL_DAYS = 14;

export async function createPreviewSnapshot(appId: string) {
  const app = await prisma.app.findUnique({
    where: { id: appId },
  });

  if (!app) {
    throw new Error("App not found.");
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + PREVIEW_TTL_DAYS);
  const frozenSchema = fromPrismaJson<RuntimeSchema>(app.currentSchema);

  const snapshot = await prisma.previewSnapshot.create({
    data: {
      appId,
      token: nanoid(18),
      schemaSnapshot: freezeSchema(frozenSchema),
      expiresAt,
    },
  });

  return {
    token: snapshot.token,
    schema: fromPrismaJson<RuntimeSchema>(snapshot.schemaSnapshot),
    createdAt: snapshot.createdAt,
    expiresAt: snapshot.expiresAt,
  };
}

export async function getPreviewSnapshot(token: string) {
  const snapshot = await prisma.previewSnapshot.findUnique({
    where: { token },
  });

  if (!snapshot) {
    return { status: "invalid" as const };
  }

  if (snapshot.expiresAt && snapshot.expiresAt < new Date()) {
    return { status: "expired" as const, expiresAt: snapshot.expiresAt };
  }

  return {
    status: "active" as const,
    token: snapshot.token,
    schema: fromPrismaJson<RuntimeSchema>(snapshot.schemaSnapshot),
    createdAt: snapshot.createdAt,
    expiresAt: snapshot.expiresAt,
  };
}

export function freezeSchema(schema: RuntimeSchema) {
  return toPrismaJson({
    ...schema,
    metadata: {
      ...schema.metadata,
      status: "preview",
    },
  });
}
