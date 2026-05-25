import type { Prisma } from "@prisma/client";

import { apiError, apiOk } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { toPrismaJson } from "@/lib/prisma-json";
import { generateAppInputSchema } from "@/lib/validators/generate";
import { getTemplateBySlug } from "@/data/templates";
import { instantiateSchema } from "@/services/schema-factory";
import { matchTemplate } from "@/services/template-matcher";
import type { GenerateAppResponse } from "@/types/api";

async function parseJson(request: Request) {
  try {
    return (await request.json()) as unknown;
  } catch {
    return undefined;
  }
}

export async function POST(request: Request) {
  const payload = await parseJson(request);
  const parsed = generateAppInputSchema.safeParse(payload);

  if (!parsed.success) {
    return apiError(
      {
        code: "INVALID_GENERATE_INPUT",
        message: "The generation request is invalid.",
        details: parsed.error.flatten().fieldErrors,
      },
      422,
    );
  }

  const forcedTemplate = parsed.data.templateSlug
    ? getTemplateBySlug(parsed.data.templateSlug)
    : undefined;

  const match = forcedTemplate
    ? {
        template: forcedTemplate,
        confidence: 1,
        matchedKeywords: [forcedTemplate.slug],
      }
    : matchTemplate(parsed.data.prompt);

  if ("error" in match) {
    return apiError(match.error, 422);
  }

  const { generatedName, schema } = instantiateSchema(match.template, parsed.data.prompt);

  try {
    const app = await prisma.$transaction(async (tx) => {
      await tx.template.upsert({
        where: { id: match.template.id },
        update: {
          name: match.template.name,
          slug: match.template.slug,
          description: match.template.description,
          category: match.template.category,
          complexity: match.template.complexity,
          tags: match.template.tags,
          schemaDefaults: toPrismaJson(match.template.schemaDefaults),
          parentTemplateId: match.template.parentTemplateId,
        },
        create: {
          id: match.template.id,
          name: match.template.name,
          slug: match.template.slug,
          description: match.template.description,
          category: match.template.category,
          complexity: match.template.complexity,
          tags: match.template.tags,
          schemaDefaults: toPrismaJson(match.template.schemaDefaults),
          parentTemplateId: match.template.parentTemplateId,
          createdAt: new Date(match.template.createdAt),
        },
      });

      const created = await tx.app.create({
        data: {
          name: generatedName,
          prompt: parsed.data.prompt,
          templateId: match.template.id,
          currentSchema: toPrismaJson(schema),
          currentVersion: 1,
        },
      });

      await tx.schemaVersion.create({
        data: {
          appId: created.id,
          version: 1,
          schemaSnapshot: toPrismaJson(schema),
        },
      });

      return created;
    });

    const response: GenerateAppResponse = {
      appId: app.id,
      generatedName,
      templateUsed: {
        id: match.template.id,
        name: match.template.name,
        slug: match.template.slug,
        category: match.template.category,
      },
      schema,
      confidence: match.confidence,
    };

    return apiOk(response, 201);
  } catch (error) {
    const prismaError = error as Prisma.PrismaClientKnownRequestError;
    return apiError(
      {
        code: prismaError.code ?? "APP_GENERATION_FAILED",
        message: "OneAtlas could not persist the generated runtime app.",
        suggestion: "Verify DATABASE_URL points to a reachable Neon PostgreSQL database.",
      },
      500,
    );
  }
}
