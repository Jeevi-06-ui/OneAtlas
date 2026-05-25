import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";

import { PromptGenerateForm } from "@/components/builder/prompt-generate-form";
import { Container } from "@/components/layout/container";
import { DashboardPreview } from "@/components/marketing/dashboard-preview";
import { TemplateLaunchButton } from "@/components/templates/template-launch-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { faqs, modelHighlights, pricingPreview, roleCards, workSteps } from "@/data/marketing";
import { templates } from "@/data/templates";

export default function HomePage() {
  return (
    <main>
      <section className="border-b border-border py-16 sm:py-20 lg:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge variant="outline" className="mb-5">
              AI-native runtime application platform
            </Badge>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-normal sm:text-6xl">
              OneAtlas Runtime Builder
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Generate schema-driven operational apps from a prompt, edit them conversationally, version every change, and share frozen previews.
            </p>
            <div className="mt-8 max-w-2xl">
              <PromptGenerateForm />
            </div>
          </div>
          <DashboardPreview />
        </Container>
      </section>

      <section id="how-it-works" className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium text-sky-700 dark:text-sky-300">How OneAtlas Works</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold sm:text-4xl">
                Runtime generation that keeps the schema in the center.
              </h2>
            </div>
            <Button variant="outline" asChild>
              <Link href="/templates">
                Explore templates
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {workSteps.map((step, index) => (
              <Card key={step.title}>
                <CardHeader>
                  <div className="mb-4 grid size-9 place-items-center rounded-md bg-foreground text-background text-sm font-semibold">
                    {index + 1}
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="models" className="border-y border-border bg-card/55 py-16 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Build With Latest Models</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Model-ready runtime contracts for AI-native app building.
            </h2>
            <p className="mt-4 text-muted-foreground">
              OneAtlas separates generation, schema mutation, rendering, and preview snapshots so teams can plug in model routers without coupling UI state to prompts.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {modelHighlights.map((highlight) => (
              <div key={highlight} className="flex items-center gap-3 rounded-lg border border-border bg-background p-4">
                <CheckCircle2 className="size-5 text-emerald-600" aria-hidden="true" />
                <span className="text-sm font-medium">{highlight}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="templates" className="py-16 sm:py-20">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-violet-700 dark:text-violet-300">Templates Showcase</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Operational templates, not blank canvases.</h2>
            </div>
            <Button variant="outline" className="hidden sm:inline-flex" asChild>
              <Link href="/templates">View all</Link>
            </Button>
          </div>
          <div className="scrollbar-thin mt-8 flex gap-4 overflow-x-auto pb-4">
            {templates.map((template) => (
              <Card key={template.id} className="w-80 shrink-0">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle>{template.name}</CardTitle>
                    <Badge variant="secondary">{template.complexity}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  <TemplateLaunchButton template={template} label="Use template" className="mt-5 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="roles" className="border-y border-border bg-card/55 py-16 sm:py-20">
        <Container>
          <p className="text-sm font-medium text-rose-700 dark:text-rose-300">Atlas for Roles</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold sm:text-4xl">A runtime builder for teams that ship internal systems.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {roleCards.map((role) => (
              <Card key={role.role}>
                <CardHeader>
                  <CardTitle>{role.role}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{role.value}</p>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link href="/templates">Explore templates</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="enterprise" className="py-16 sm:py-20">
        <Container className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Building2 className="mb-4 size-8 text-sky-600" aria-hidden="true" />
              <CardTitle>Enterprise runtime governance</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Template lineage, audit-ready mutation logs, preview isolation, and environment-based Neon deployment paths for production teams.
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link href="/enterprise">View enterprise</Link>
              </Button>
            </CardContent>
          </Card>
          <Card id="security">
            <CardHeader>
              <ShieldCheck className="mb-4 size-8 text-emerald-600" aria-hidden="true" />
              <CardTitle>Security-first preview sharing</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Immutable preview snapshots are tokenized, expirable, and isolated from live schema updates by storing complete frozen JSON copies.
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link href="/security">Security overview</Link>
              </Button>
            </CardContent>
          </Card>
        </Container>
      </section>

      <section id="pricing" className="border-y border-border bg-card/55 py-16 sm:py-20">
        <Container>
          <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Pricing Preview</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Scale from solo builder to governed platform.</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {pricingPreview.map((tier) => (
              <Card key={tier.name}>
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <p className="text-3xl font-semibold">{tier.price}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                  <div className="mt-5 grid gap-2">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <LockKeyhole className="size-4 text-muted-foreground" aria-hidden="true" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button className="mt-6 w-full" asChild>
                    <Link href={tier.name === "Enterprise" ? "/enterprise" : "/#start-building"}>
                      {tier.name === "Enterprise" ? "Contact sales" : "Start building"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="resources" className="py-16 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-medium text-sky-700 dark:text-sky-300">FAQ</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">The practical bits, answered.</h2>
          </div>
          <div className="grid gap-3">
            {faqs.map((faq) => (
              <Card key={faq.question}>
                <CardHeader>
                  <CardTitle className="text-base">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="community" className="border-t border-border py-14">
        <Container className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <Sparkles className="mb-3 size-6 text-violet-600" aria-hidden="true" />
            <h2 className="text-2xl font-semibold">Ready to build the first runtime?</h2>
            <p className="mt-2 text-sm text-muted-foreground">Start with a prompt or inspect the template system.</p>
          </div>
          <Button asChild>
            <Link href="/#start-building">
              Start Building
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </Container>
      </section>
    </main>
  );
}
