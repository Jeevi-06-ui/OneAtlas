"use client";

import Link from "next/link";
import { Menu, Sparkles } from "lucide-react";

import { MegaMenu } from "@/components/layout/mega-menu";
import { navItems } from "@/data/marketing";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 glass-nav">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid size-8 place-items-center rounded-md bg-foreground text-background">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <span className="hidden sm:inline">OneAtlas</span>
        </Link>

        <MegaMenu items={navItems} />

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/templates">Templates</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/#start-building">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/#start-building">Start Building</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(360px,90vw)]">
              <SheetHeader>
                <SheetTitle>OneAtlas</SheetTitle>
              </SheetHeader>
              <nav className="mt-8 grid gap-2" aria-label="Mobile navigation">
                {navItems.map((item) => (
                  <div key={item.label} className="grid gap-2">
                    <Link href={item.href} className="rounded-md px-2 py-2 text-sm font-medium hover:bg-muted">
                      {item.label}
                    </Link>
                    {item.columns
                      ? item.columns.flatMap((column) =>
                          column.items.map((child) => (
                            <Link
                              key={`${item.label}-${child.label}`}
                              href={child.href}
                              className="rounded-md px-2 py-1.5 pl-4 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                              {child.label}
                            </Link>
                          )),
                        )
                      : null}
                    {item.items
                      ? item.items.map((child) => (
                          <Link
                            key={`${item.label}-${child.label}`}
                            href={child.href}
                            className="rounded-md px-2 py-1.5 pl-4 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            {child.label}
                          </Link>
                        ))
                      : null}
                  </div>
                ))}
              </nav>
              <Button className="mt-8 w-full" asChild>
                <Link href="/#start-building">Start Building</Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
