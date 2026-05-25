"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface QaAnswer {
  id: string;
  answer: string;
  authorName: string | null;
  createdAt: string;
  createdAtLabel: string;
}

interface QaQuestion {
  id: string;
  question: string;
  authorName: string | null;
  createdAt: string;
  createdAtLabel: string;
  answers: QaAnswer[];
}

interface QaBoardProps {
  initialQuestions: QaQuestion[];
}

export function QaBoard({ initialQuestions }: QaBoardProps) {
  const [questions, setQuestions] = useState<QaQuestion[]>(initialQuestions);
  const [questionText, setQuestionText] = useState("");
  const [questionAuthor, setQuestionAuthor] = useState("");
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [questionSubmitting, setQuestionSubmitting] = useState(false);
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, { answer: string; author: string }>>({});
  const [answerSubmittingId, setAnswerSubmittingId] = useState<string | null>(null);
  const [answerErrors, setAnswerErrors] = useState<Record<string, string | null>>({});

  const hasQuestions = questions.length > 0;
  const questionCountLabel = useMemo(() => `${questions.length} question${questions.length === 1 ? "" : "s"}`, [questions.length]);

  async function submitQuestion() {
    setQuestionError(null);
    if (questionText.trim().length < 8) {
      setQuestionError("Please add a question with at least 8 characters.");
      return;
    }

    setQuestionSubmitting(true);
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questionText.trim(),
          authorName: questionAuthor.trim().length > 0 ? questionAuthor.trim() : null,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error?.message ?? "Could not submit question.");
      }
      setQuestions((prev) => [payload.question, ...prev]);
      setQuestionText("");
      setQuestionAuthor("");
    } catch (error) {
      setQuestionError(error instanceof Error ? error.message : "Could not submit question.");
    } finally {
      setQuestionSubmitting(false);
    }
  }

  async function submitAnswer(questionId: string) {
    const draft = answerDrafts[questionId];
    setAnswerErrors((prev) => ({ ...prev, [questionId]: null }));

    if (!draft || draft.answer.trim().length < 4) {
      setAnswerErrors((prev) => ({ ...prev, [questionId]: "Please add an answer with at least 4 characters." }));
      return;
    }

    setAnswerSubmittingId(questionId);
    try {
      const response = await fetch(`/api/questions/${questionId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: draft.answer.trim(),
          authorName: draft.author.trim().length > 0 ? draft.author.trim() : null,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error?.message ?? "Could not submit answer.");
      }

      setQuestions((prev) =>
        prev.map((question) =>
          question.id === questionId
            ? { ...question, answers: [...question.answers, payload.answer] }
            : question,
        ),
      );
      setAnswerDrafts((prev) => ({ ...prev, [questionId]: { answer: "", author: "" } }));
    } catch (error) {
      setAnswerErrors((prev) => ({
        ...prev,
        [questionId]: error instanceof Error ? error.message : "Could not submit answer.",
      }));
    } finally {
      setAnswerSubmittingId(null);
    }
  }

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="qa-name">Name (optional)</Label>
            <Input
              id="qa-name"
              value={questionAuthor}
              onChange={(event) => setQuestionAuthor(event.target.value)}
              placeholder="Jane Doe"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="qa-question">Question</Label>
            <Textarea
              id="qa-question"
              value={questionText}
              onChange={(event) => setQuestionText(event.target.value)}
              placeholder="What does a governed runtime program include?"
              rows={4}
            />
            {questionError ? <p className="text-sm text-destructive">{questionError}</p> : null}
          </div>
          <Button type="button" onClick={() => void submitQuestion()} disabled={questionSubmitting}>
            {questionSubmitting ? "Submitting" : "Submit question"}
          </Button>
        </CardContent>
      </Card>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Latest questions</h2>
          <span className="text-sm text-muted-foreground">{questionCountLabel}</span>
        </div>

        {!hasQuestions ? (
          <Card>
            <CardContent className="py-6 text-sm text-muted-foreground">
              No questions yet. Ask the first one and it will show up here for everyone.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {questions.map((question) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-base">{question.question}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {question.authorName ? question.authorName : "Anonymous"} · {question.createdAtLabel}
                  </p>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-3">
                    {question.answers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No answers yet.</p>
                    ) : (
                      question.answers.map((answer) => (
                        <div key={answer.id} className="rounded-md border border-border bg-muted/40 p-3">
                          <p className="text-sm text-foreground">{answer.answer}</p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {answer.authorName ? answer.authorName : "Anonymous"} · {answer.createdAtLabel}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="grid gap-3 rounded-md border border-border bg-background p-3">
                    <div className="grid gap-2">
                      <Label htmlFor={`answer-name-${question.id}`}>Your name (optional)</Label>
                      <Input
                        id={`answer-name-${question.id}`}
                        value={answerDrafts[question.id]?.author ?? ""}
                        onChange={(event) =>
                          setAnswerDrafts((prev) => ({
                            ...prev,
                            [question.id]: { answer: prev[question.id]?.answer ?? "", author: event.target.value },
                          }))
                        }
                        placeholder="Alex"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`answer-text-${question.id}`}>Your answer</Label>
                      <Textarea
                        id={`answer-text-${question.id}`}
                        value={answerDrafts[question.id]?.answer ?? ""}
                        onChange={(event) =>
                          setAnswerDrafts((prev) => ({
                            ...prev,
                            [question.id]: { answer: event.target.value, author: prev[question.id]?.author ?? "" },
                          }))
                        }
                        rows={3}
                        placeholder="Share your experience with this question."
                      />
                      {answerErrors[question.id] ? (
                        <p className="text-sm text-destructive">{answerErrors[question.id]}</p>
                      ) : null}
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => void submitAnswer(question.id)}
                      disabled={answerSubmittingId === question.id}
                    >
                      {answerSubmittingId === question.id ? "Submitting" : "Post answer"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
