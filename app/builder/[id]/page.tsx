import { notFound } from "next/navigation";

import { BuilderShell } from "@/components/builder/builder-shell";
import { prisma } from "@/lib/prisma";
import { fromPrismaJson } from "@/lib/prisma-json";
import type { RuntimeSchema } from "@/types/runtime";

interface BuilderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BuilderPage({
  params,
}: BuilderPageProps) {
  const { id } = await params;

  const app = await prisma.app.findUnique({
    where: { id },
  });

  if (!app) {
    return notFound();
  }

  const schema = fromPrismaJson<RuntimeSchema>(app.currentSchema);

  return (
    <BuilderShell appId={id} initialSchema={schema} currentVersion={app.currentVersion} />
  );
}