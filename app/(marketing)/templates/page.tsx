import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { TemplateBrowser } from "@/components/templates/template-browser";
import { templates } from "@/data/templates";

export const metadata: Metadata = {
  title: "Templates",
  description: "Browse OneAtlas runtime app templates for CRM, HR, admin, analytics, inventory, and support workflows.",
};

export default function TemplatesPage() {
  return (
    <main className="py-12 sm:py-16">
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-sky-700 dark:text-sky-300">Templates</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-5xl">
            Start from an operational runtime schema.
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Each template ships with sidebar navigation, metrics, charts, tables, forms, sections, and typed metadata.
          </p>
        </div>
        <div className="mt-10">
          <TemplateBrowser templates={templates} />
        </div>
      </Container>
    </main>
  );
}
