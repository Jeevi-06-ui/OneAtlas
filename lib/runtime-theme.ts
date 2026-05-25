import type { RuntimeTone } from "@/types/runtime";

export const runtimeAccentClasses: Record<
  RuntimeTone,
  {
    badge: string;
    border: string;
    glow: string;
    sidebarActive: string;
    navActive: string;
    metricBar: string;
  }
> = {
  neutral: {
    badge: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
    border: "border-slate-500/30",
    glow: "shadow-slate-500/10",
    sidebarActive: "bg-slate-500/10 text-foreground",
    navActive: "bg-slate-500/10 text-foreground",
    metricBar: "bg-slate-500/30",
  },
  sky: {
    badge: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    border: "border-sky-500/30",
    glow: "shadow-sky-500/15",
    sidebarActive: "bg-sky-500/10 text-sky-800 dark:text-sky-200",
    navActive: "bg-sky-500/10 text-sky-800 dark:text-sky-200",
    metricBar: "bg-sky-500/30",
  },
  emerald: {
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/15",
    sidebarActive: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
    navActive: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
    metricBar: "bg-emerald-500/30",
  },
  amber: {
    badge: "bg-amber-500/10 text-amber-800 dark:text-amber-300",
    border: "border-amber-500/30",
    glow: "shadow-amber-500/15",
    sidebarActive: "bg-amber-500/10 text-amber-900 dark:text-amber-200",
    navActive: "bg-amber-500/10 text-amber-900 dark:text-amber-200",
    metricBar: "bg-amber-500/30",
  },
  rose: {
    badge: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    border: "border-rose-500/30",
    glow: "shadow-rose-500/15",
    sidebarActive: "bg-rose-500/10 text-rose-800 dark:text-rose-200",
    navActive: "bg-rose-500/10 text-rose-800 dark:text-rose-200",
    metricBar: "bg-rose-500/30",
  },
  violet: {
    badge: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
    border: "border-violet-500/30",
    glow: "shadow-violet-500/15",
    sidebarActive: "bg-violet-500/10 text-violet-800 dark:text-violet-200",
    navActive: "bg-violet-500/10 text-violet-800 dark:text-violet-200",
    metricBar: "bg-violet-500/30",
  },
};

export function getRuntimeAccentClasses(tone: RuntimeTone) {
  return runtimeAccentClasses[tone] ?? runtimeAccentClasses.neutral;
}
