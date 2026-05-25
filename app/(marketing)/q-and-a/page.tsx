import { Container } from "@/components/layout/container";
import { QaBoard } from "@/components/marketing/q-and-a-board";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Q&A | OneAtlas",
  description: "Ask questions and share answers about OneAtlas Runtime Builder.",
};

function formatTimestamp(timestamp: Date) {
  return timestamp.toISOString().replace("T", " ").replace("Z", " UTC");
}

function serializeQuestions(questions: Array<{ id: string; question: string; authorName: string | null; createdAt: Date; answers: Array<{ id: string; answer: string; authorName: string | null; createdAt: Date }> }>) {
  return questions.map((question) => ({
    id: question.id,
    question: question.question,
    authorName: question.authorName,
    createdAt: question.createdAt.toISOString(),
    createdAtLabel: formatTimestamp(question.createdAt),
    answers: question.answers.map((answer) => ({
      id: answer.id,
      answer: answer.answer,
      authorName: answer.authorName,
      createdAt: answer.createdAt.toISOString(),
      createdAtLabel: formatTimestamp(answer.createdAt),
    })),
  }));
}

export default async function QaPage() {
  let questions: Array<{ id: string; question: string; authorName: string | null; createdAt: Date; answers: Array<{ id: string; answer: string; authorName: string | null; createdAt: Date }> }> = [];
  let dbError: string | null = null;

  try {
    questions = await prisma.question.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        answers: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  } catch (error) {
    dbError = error instanceof Error ? error.message : "Database unavailable.";
  }

  return (
    <main>
      <section className="border-b border-border py-14 sm:py-20">
        <Container className="max-w-3xl">
          <p className="text-sm font-medium text-sky-700 dark:text-sky-300">Community Q&A</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">Ask and answer in public.</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Share questions about templates, pricing, workflows, and runtime schemas. Anyone can read and contribute.
          </p>
          {dbError ? (
            <p className="mt-4 text-sm text-destructive">
              Q&A data is temporarily unavailable. Check your database connection and refresh.
            </p>
          ) : null}
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container className="max-w-4xl">
          <QaBoard initialQuestions={serializeQuestions(questions)} />
        </Container>
      </section>
    </main>
  );
}
