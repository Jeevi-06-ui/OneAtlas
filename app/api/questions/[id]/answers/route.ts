import { apiError, apiOk } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { answerSchema } from "@/lib/validators/questions";

function formatTimestamp(timestamp: Date) {
  return timestamp.toISOString().replace("T", " ").replace("Z", " UTC");
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError({ code: "INVALID_JSON", message: "Request body must be JSON." }, 422);
  }

  const parsed = answerSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(
      {
        code: "INVALID_ANSWER",
        message: "Check the answer details and try again.",
        details: parsed.error.flatten().fieldErrors,
      },
      422,
    );
  }

  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) {
    return apiError({ code: "NOT_FOUND", message: "Question not found." }, 404);
  }

  const authorName = parsed.data.authorName && parsed.data.authorName.trim().length > 0 ? parsed.data.authorName.trim() : null;

  const answer = await prisma.answer.create({
    data: {
      questionId: id,
      answer: parsed.data.answer,
      authorName,
    },
  });

  return apiOk(
    {
      answer: {
        id: answer.id,
        answer: answer.answer,
        authorName: answer.authorName,
        createdAt: answer.createdAt.toISOString(),
        createdAtLabel: formatTimestamp(answer.createdAt),
      },
    },
    201,
  );
}
