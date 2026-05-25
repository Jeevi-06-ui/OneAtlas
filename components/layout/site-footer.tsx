import Link from "next/link";

import { Container } from "@/components/layout/container";
import { footerLinks } from "@/data/marketing";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/60 py-10">
      <Container className="grid gap-8 md:grid-cols-[1.2fr_repeat(3,1fr)]">
        <div>
          <Link href="/" className="text-base font-semibold">
            OneAtlas Runtime Builder
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            AI-native runtime app generation with editable schemas, mutations, history, and frozen previews.
          </p>
        </div>
        {[
          { title: "Product", links: footerLinks.product },
          { title: "Company", links: footerLinks.company },
          { title: "Community", links: footerLinks.community },
        ].map((group) => (
          <div key={group.title} className="grid gap-3 text-sm">
            <p className="font-medium">{group.title}</p>
            {group.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-muted-foreground transition hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </Container>
    </footer>
  );
}
