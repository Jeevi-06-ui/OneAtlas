"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateAppInputSchema } from "@/lib/validators/generate";
import type { ApiFailure, GenerateAppResponse } from "@/types/api";

type GenerateFormValues = z.infer<typeof generateAppInputSchema>;

function isApiFailure(value: unknown): value is ApiFailure {
  return typeof value === "object" && value !== null && "error" in value;
}

export function PromptGenerateForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(generateAppInputSchema),
    defaultValues: {
      prompt: "Build a CRM workspace for enterprise account teams with pipeline analytics, contact intake, and AI follow-up recommendations.",
    },
  });

  async function onSubmit(values: GenerateFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json()) as GenerateAppResponse | ApiFailure;

      if (!response.ok || isApiFailure(payload)) {
        const message = isApiFailure(payload)
          ? payload.error.message
          : "Generation failed.";
        toast.error(message);
        return;
      }

      toast.success(`Generated ${payload.generatedName}`);
      router.push(`/builder/${payload.appId}`);
    } catch {
      toast.error("Could not reach the generation API.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const error = form.formState.errors.prompt?.message;

  return (
    <form id="start-building" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
      <div className="relative">
        <Textarea
          {...form.register("prompt")}
          className={compact ? "min-h-24 pr-12" : "min-h-32 pr-12 text-base"}
          aria-label="Describe the app to build"
        />
        <WandSparkles className="absolute right-4 top-4 size-5 text-muted-foreground" aria-hidden="true" />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" size={compact ? "default" : "lg"} disabled={isSubmitting}>
          {isSubmitting ? "Generating" : "Generate runtime app"}
          <ArrowRight aria-hidden="true" />
        </Button>
        <Button type="button" variant="outline" size={compact ? "default" : "lg"} onClick={() => router.push("/templates")}>
          Browse templates
        </Button>
      </div>
    </form>
  );
}
