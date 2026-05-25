import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { faqs, pricingPreview } from "@/data/marketing";

export const metadata = {
  title: "Pricing | OneAtlas",
  description: "Studio, Scale, and Enterprise plans for runtime app generation.",
};

export default function PricingPage() {
  return (
    <main>
      <section className="border-b border-border py-14 sm:py-20">
        <Container className="max-w-3xl">
          <Badge variant="outline" className="mb-4">
            Pricing
          </Badge>
          <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">Scale from solo builder to governed platform.</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start with Studio for fast validation, move to Scale for shared templates, and unlock Enterprise for governed runtime programs.
          </p>
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
        <Container>
          <div className="grid gap-4 lg:grid-cols-3">
            {pricingPreview.map((tier) => (
              <Card key={tier.name} className={tier.name === "Scale" ? "border-primary/60 shadow-lg" : undefined}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {tier.name}
                    {tier.name === "Scale" ? (
                      <Badge variant="secondary" className="text-xs">
                        Popular
                      </Badge>
                    ) : null}
                  </CardTitle>
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

      <section className="border-t border-border bg-card/55 py-14 sm:py-16">
        <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-medium text-sky-700 dark:text-sky-300">Questions</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Pricing answers, from builders.</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Need more detail? Post a question in the public Q&A and the community can reply.
            </p>
            <Button variant="outline" className="mt-6" asChild>
              <Link href="/q-and-a">Visit Q&A</Link>
            </Button>
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
    </main>
  );
}
