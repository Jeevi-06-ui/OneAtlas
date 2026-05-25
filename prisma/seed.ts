import { templates } from "../data/templates";
import { prisma } from "../lib/prisma";
import { toPrismaJson } from "../lib/prisma-json";

async function main() {
  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: template.id },
      update: {
        name: template.name,
        slug: template.slug,
        description: template.description,
        category: template.category,
        complexity: template.complexity,
        tags: template.tags,
        schemaDefaults: toPrismaJson(template.schemaDefaults),
        parentTemplateId: template.parentTemplateId,
      },
      create: {
        id: template.id,
        name: template.name,
        slug: template.slug,
        description: template.description,
        category: template.category,
        complexity: template.complexity,
        tags: template.tags,
        schemaDefaults: toPrismaJson(template.schemaDefaults),
        parentTemplateId: template.parentTemplateId,
        createdAt: new Date(template.createdAt),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
