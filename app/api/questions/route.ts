import { apiError, apiOk } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { questionSchema } from "@/lib/validators/questions";

function formatTimestamp(timestamp: Date) {
  return timestamp.toISOString().replace("T", " ").replace("Z", " UTC");
}

function serializeQuestion(question: {
  id: string;
  question: string;
  authorName: string | null;
  createdAt: Date;
  answers: Array<{ id: string; answer: string; authorName: string | null; createdAt: Date }>;
}) {
  return {
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
  };
}

export async function GET() {
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      answers: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return apiOk({ questions: questions.map((question) => serializeQuestion(question)) });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError({ code: "INVALID_JSON", message: "Request body must be JSON." }, 422);
  }

  const parsed = questionSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      {
        code: "INVALID_QUESTION",
        message: "Check the question details and try again.",
        details: parsed.error.flatten().fieldErrors,
      },
      422,
    );
  }

  const authorName = parsed.data.authorName && parsed.data.authorName.trim().length > 0 ? parsed.data.authorName.trim() : null;

  const question = await prisma.question.create({
    data: {
      question: parsed.data.question,
      authorName,
    },
    include: { answers: true },
  });

  return apiOk({ question: serializeQuestion(question) }, 201);
}
