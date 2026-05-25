import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { PromptGenerateForm } from "@/components/builder/prompt-generate-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MarketingPageConfig } from "@/data/marketing-pages";

interface MarketingPageProps {
  page: MarketingPageConfig;
}

export function MarketingPage({ page }: MarketingPageProps) {
  return (
    <main>
      <section className="border-b border-border py-14 sm:py-20">
        <Container className="max-w-3xl">
          <Badge variant="outline" className="mb-4">
            {page.eyebrow}
          </Badge>
          <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">{page.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{page.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/#start-building">
                Start Building
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/templates">Browse templates</Link>
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container className="grid gap-5 md:grid-cols-3">
          {page.sections.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </CardContent>
            </Card>
          ))}
        </Container>
      </section>

      {page.slug === "docs" || page.slug === "support" ? (
        <section className="border-t border-border py-14">
          <Container className="max-w-2xl">
            <h2 className="text-2xl font-semibold">Try the runtime workflow</h2>
            <p className="mt-2 text-muted-foreground">Generate an app from a prompt and open it in the builder.</p>
            <div className="mt-6">
              <PromptGenerateForm compact />
            </div>
          </Container>
        </section>
      ) : null}
    </main>
  );
}
