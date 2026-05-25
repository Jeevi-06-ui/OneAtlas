import Link from "next/link";
import { Sparkles } from "lucide-react";

import type { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        <aside className="relative hidden overflow-hidden border-r border-border bg-[#0A2540] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link href="/login" className="inline-flex items-center gap-2 font-semibold">
              <span className="grid size-9 place-items-center rounded-md bg-white/10">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              OneAtlas
            </Link>
            <h1 className="mt-12 max-w-md text-3xl font-semibold leading-tight">
              AI-native runtime apps for operational teams
            </h1>
            <p className="mt-4 max-w-sm text-sm text-white/70">
              Generate schema-driven dashboards, edit them conversationally, and share frozen previews with your team.
            </p>
          </div>
          <p className="text-xs text-white/50">Template-first · Schema mutations · Immutable previews</p>
        </aside>

        <main className="flex items-center justify-center px-4 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link href="/login" className="inline-flex items-center gap-2 font-semibold">
                <span className="grid size-8 place-items-center rounded-md bg-foreground text-background">
                  <Sparkles className="size-4" aria-hidden="true" />
                </span>
                OneAtlas
              </Link>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-lg sm:p-8">
              <h2 className="text-2xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
              <div className="mt-8">{children}</div>
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
          </div>
        </main>
      </div>
    </div>
  );
}
