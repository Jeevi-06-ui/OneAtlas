"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface MegaMenuColumn {
  title: string;
  items: Array<{ label: string; href: string; description?: string }>;
}

export interface MegaMenuItem {
  label: string;
  href: string;
  columns?: MegaMenuColumn[];
  items?: Array<{ label: string; href: string; description?: string }>;
}

interface MegaMenuProps {
  items: MegaMenuItem[];
}

export function MegaMenu({ items }: MegaMenuProps) {
  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
      {items.map((item) =>
        item.columns || (item.items && item.items.length > 0) ? (
          <DropdownMenu key={item.label}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                {item.label}
                <ChevronDown className="size-3.5 opacity-60" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className={cn(
                "p-4",
                item.columns && item.columns.length > 1 ? "w-[min(720px,92vw)]" : "w-72",
              )}
            >
              {item.columns ? (
                <div
                  className={cn(
                    "grid gap-6",
                    item.columns.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2",
                  )}
                >
                  {item.columns.map((column) => (
                    <div key={column.title}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {column.title}
                      </p>
                      <div className="grid gap-1">
                        {column.items.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            target={child.href.startsWith("http") ? "_blank" : undefined}
                            rel={child.href.startsWith("http") ? "noreferrer" : undefined}
                            className="rounded-md px-2 py-2 transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <span className="text-sm font-medium">{child.label}</span>
                            {child.description ? (
                              <span className="mt-0.5 block text-xs text-muted-foreground">{child.description}</span>
                            ) : null}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-1">
                  {item.items?.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      target={child.href.startsWith("http") ? "_blank" : undefined}
                      rel={child.href.startsWith("http") ? "noreferrer" : undefined}
                      className="rounded-md px-2 py-2 text-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button key={item.label} variant="ghost" size="sm" asChild>
            <Link href={item.href}>{item.label}</Link>
          </Button>
        ),
      )}
    </nav>
  );
}
