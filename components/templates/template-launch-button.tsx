"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { ApiFailure, GenerateAppResponse } from "@/types/api";
import type { TemplateConfig } from "@/types/template";

interface TemplateLaunchButtonProps {
  template: Pick<TemplateConfig, "name" | "description" | "category" | "slug">;
  label: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

function isApiFailure(value: unknown): value is ApiFailure {
  return typeof value === "object" && value !== null && "error" in value;
}

export function TemplateLaunchButton({
  template,
  label,
  className,
  variant = "default",
  size = "default",
}: TemplateLaunchButtonProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleLaunch() {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Build ${template.name} for ${template.description}.`,
          templateSlug: template.slug,
        }),
      });

      const payload = (await response.json()) as GenerateAppResponse | ApiFailure;

      if (!response.ok || isApiFailure(payload)) {
        toast.error(isApiFailure(payload) ? payload.error.message : "Template generation failed.");
        return;
      }

      toast.success(`Generated ${payload.generatedName}`);
      router.push(`/builder/${payload.appId}`);
    } catch {
      toast.error("Could not reach the generation API.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleLaunch}
      disabled={isGenerating}
      className={className}
    >
      {isGenerating ? (
        label
      ) : (
        <>
          <Sparkles aria-hidden="true" />
          {label}
          <ArrowRight aria-hidden="true" />
        </>
      )}
    </Button>
  );
}