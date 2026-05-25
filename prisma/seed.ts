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

  const existingQuestion = await prisma.question.findFirst();
  if (!existingQuestion) {
    const questionOne = await prisma.question.create({
      data: {
        question: "Does the Scale plan include team template sharing?",
        authorName: "Rina Patel",
      },
    });

    await prisma.answer.createMany({
      data: [
        {
          questionId: questionOne.id,
          answer: "Yes, Scale includes shared template libraries plus audit logs.",
          authorName: "OneAtlas Team",
        },
        {
          questionId: questionOne.id,
          answer: "We use it for cross-team templates and it works well.",
          authorName: "Marco",
        },
      ],
    });

    const questionTwo = await prisma.question.create({
      data: {
        question: "How long do preview links stay active?",
        authorName: "Ava Kim",
      },
    });

    await prisma.answer.create({
      data: {
        questionId: questionTwo.id,
        answer: "Previews are immutable snapshots. You can set expiration per preview, otherwise they stay active.",
        authorName: "OneAtlas Team",
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
