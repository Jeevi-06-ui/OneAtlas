import { templates } from "@/data/templates";
import { normalizeText } from "@/lib/utils";
import type { TemplateConfig } from "@/types/template";

export interface TemplateMatchSuccess {
  template: TemplateConfig;
  confidence: number;
  matchedKeywords: string[];
}

export interface TemplateMatchFailure {
  error: {
    code: "NO_TEMPLATE_MATCH" | "EMPTY_PROMPT";
    message: string;
    suggestion: string;
  };
}

export type TemplateMatchResult = TemplateMatchSuccess | TemplateMatchFailure;

const MIN_CONFIDENCE = 0.18;

function tokenize(value: string) {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 2);
}

function scoreTemplate(prompt: string, template: TemplateConfig) {
  const normalizedPrompt = normalizeText(prompt);
  const promptTokens = new Set(tokenize(prompt));
  const candidates = [
    template.name,
    template.category,
    template.description,
    ...template.tags,
    ...template.keywords,
  ];

  let score = 0;
  const matchedKeywords = new Set<string>();

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeText(candidate);
    const candidateTokens = tokenize(candidate);

    if (normalizedCandidate.length > 2 && normalizedPrompt.includes(normalizedCandidate)) {
      score += 6;
      matchedKeywords.add(candidate);
      continue;
    }

    const tokenHits = candidateTokens.filter((token) => promptTokens.has(token));
    if (tokenHits.length > 0) {
      score += tokenHits.length * (template.keywords.includes(candidate) ? 3 : 1.5);
      tokenHits.forEach((token) => matchedKeywords.add(token));
    }
  }

  const maxScore = Math.max(16, template.keywords.length * 3 + template.tags.length * 2);
  return {
    score,
    confidence: Math.min(0.98, score / maxScore),
    matchedKeywords: Array.from(matchedKeywords).slice(0, 8),
  };
}

export function matchTemplate(prompt: string, availableTemplates = templates): TemplateMatchResult {
  if (normalizeText(prompt).length === 0) {
    return {
      error: {
        code: "EMPTY_PROMPT",
        message: "Prompt is required before OneAtlas can match a template.",
        suggestion: "Describe the app workflow, target users, data objects, and core dashboard needs.",
      },
    };
  }

  const ranked = availableTemplates
    .map((template) => ({
      template,
      ...scoreTemplate(prompt, template),
    }))
    .sort((left, right) => right.confidence - left.confidence);

  const best = ranked[0];
  if (!best || best.confidence < MIN_CONFIDENCE) {
    return {
      error: {
        code: "NO_TEMPLATE_MATCH",
        message: "No template crossed the confidence threshold for this prompt.",
        suggestion:
          "Try mentioning a domain such as CRM, HR, admin panel, analytics, inventory, or support.",
      },
    };
  }

  return {
    template: best.template,
    confidence: Number(best.confidence.toFixed(2)),
    matchedKeywords: best.matchedKeywords,
  };
}
