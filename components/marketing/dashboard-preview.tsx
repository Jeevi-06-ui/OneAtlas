import { Activity, ChartNoAxesColumn, Sparkles, Table2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function DashboardPreview() {
  const bars = [38, 58, 46, 70, 88, 64, 96];
  const metricLines: Record<string, string> = {
    sky: "bg-sky-500/30",
    emerald: "bg-emerald-500/30",
    amber: "bg-amber-500/30",
  };

  return (
    <div className="dashboard-preview-shell rounded-xl border border-border bg-card/90 p-3 shadow-2xl shadow-slate-950/10">
      <div className="rounded-lg border border-border bg-background">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Revenue Ops Runtime</p>
            <p className="text-xs text-muted-foreground">Schema v7 · live builder</p>
          </div>
          <Badge variant="secondary" className="preview-connected-badge">
            Connected
          </Badge>
        </div>
        <div className="grid gap-3 p-4 lg:grid-cols-[180px_1fr]">
          <aside className="hidden rounded-lg border border-border bg-muted/40 p-3 lg:block">
            {[
              ["Overview", Activity, true],
              ["Records", Table2, false],
              ["Analytics", ChartNoAxesColumn, false],
              ["AI Edits", Sparkles, false],
            ].map(([label, Icon, active]) => {
              const LucideIcon = Icon as typeof Activity;
              return (
                <div
                  key={String(label)}
                  className={`preview-nav-item mb-2 flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground ${
                    active ? "preview-nav-item-active bg-card text-foreground" : ""
                  }`}
                >
                  <LucideIcon className="size-4 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                  {String(label)}
                </div>
              );
            })}
          </aside>
          <main className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Pipeline", "$1.42M", "sky"],
                ["Qualified", "248", "emerald"],
                ["Risks", "18", "amber"],
              ].map(([label, value, tone]) => (
                <div key={label} className="preview-metric-card rounded-lg border border-border bg-card p-4">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-2 text-2xl font-semibold">{value}</p>
                  <div className={`mt-3 h-1.5 rounded-full transition-transform duration-300 ${metricLines[tone]}`} />
                </div>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
              <div className="preview-chart-panel rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Pipeline Creation</p>
                  <Badge variant="outline">Generated</Badge>
                </div>
                <div className="mt-6 flex h-40 items-end gap-2">
                  {bars.map((bar, index) => (
                    <div key={index} className="preview-bar-wrap flex flex-1 items-end rounded-t-md bg-sky-500/15">
                      <div
                        className="preview-bar-fill w-full rounded-t-md bg-sky-500"
                        style={{ height: `${bar}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="preview-mutation-panel rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-medium">Conversational mutation</p>
                <div className="preview-mutation-input mt-4 rounded-md border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
                  Add revenue chart and rename contact to client
                </div>
                <div className="mt-4 grid gap-2 text-xs">
                  <span className="preview-status-pill rounded-md bg-emerald-500/10 px-2 py-2 text-emerald-700 dark:text-emerald-300">
                    mutation parsed
                  </span>
                  <span className="preview-status-pill rounded-md bg-sky-500/10 px-2 py-2 text-sky-700 dark:text-sky-300">
                    schema version created
                  </span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
