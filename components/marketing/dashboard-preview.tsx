"use client";

import { useState } from "react";
import { Activity, ChartNoAxesColumn, Sparkles, Table2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function DashboardPreview() {
  const [activeView, setActiveView] = useState("overview");
  const bars = [38, 58, 46, 70, 88, 64, 96];
  const metricLines: Record<string, string> = {
    sky: "bg-sky-500/30",
    emerald: "bg-emerald-500/30",
    amber: "bg-amber-500/30",
  };
  const records = [
    { account: "Acme Corp", owner: "Jasmine Lee", stage: "Negotiation", value: "$128k" },
    { account: "Northwind", owner: "Evan Cole", stage: "Proposal", value: "$74k" },
    { account: "Orion Labs", owner: "Priya Shah", stage: "Qualified", value: "$52k" },
    { account: "Redwood", owner: "Luis Ramos", stage: "Lead", value: "$22k" },
  ];
  const analytics = [
    { label: "Conversion", value: "18%", trend: "+3%" },
    { label: "Pipeline", value: "$1.6M", trend: "+12%" },
    { label: "Latency", value: "220ms", trend: "-18%" },
  ];
  const edits = [
    { title: "Added revenue chart", detail: "Overview section", tone: "sky" },
    { title: "Renamed Contact to Client", detail: "Records schema", tone: "emerald" },
    { title: "Pinned analytics to top", detail: "Navigation order", tone: "amber" },
  ];
  const navItems = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "records", label: "Records", icon: Table2 },
    { id: "analytics", label: "Analytics", icon: ChartNoAxesColumn },
    { id: "ai-edits", label: "AI Edits", icon: Sparkles },
  ];

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
            {navItems.map((item) => {
              const LucideIcon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveView(item.id)}
                  className={`preview-nav-item mb-2 flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-muted-foreground transition ${
                    isActive ? "preview-nav-item-active bg-card text-foreground" : "hover:bg-card/70"
                  }`}
                >
                  <LucideIcon className="size-4 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </aside>
          <main className="grid gap-3">
            {activeView === "overview" ? (
              <>
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
              </>
            ) : null}

            {activeView === "records" ? (
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Records</p>
                  <Badge variant="outline">Live</Badge>
                </div>
                <div className="mt-4 overflow-hidden rounded-md border border-border">
                  <div className="grid grid-cols-[1.2fr_1fr_1fr_0.6fr] gap-2 border-b border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                    <span>Account</span>
                    <span>Owner</span>
                    <span>Stage</span>
                    <span>Value</span>
                  </div>
                  {records.map((record) => (
                    <div
                      key={`${record.account}-${record.owner}`}
                      className="grid grid-cols-[1.2fr_1fr_1fr_0.6fr] gap-2 px-3 py-2 text-sm"
                    >
                      <span className="font-medium text-foreground">{record.account}</span>
                      <span className="text-muted-foreground">{record.owner}</span>
                      <span className="text-muted-foreground">{record.stage}</span>
                      <span className="text-foreground">{record.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {activeView === "analytics" ? (
              <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Analytics Pulse</p>
                    <Badge variant="outline">Updated 5m</Badge>
                  </div>
                  <div className="mt-6 flex h-40 items-end gap-2">
                    {bars.slice(1).map((bar, index) => (
                      <div key={index} className="flex flex-1 items-end rounded-t-md bg-violet-500/15">
                        <div className="w-full rounded-t-md bg-violet-500" style={{ height: `${bar}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-medium">Snapshot</p>
                  <div className="mt-4 grid gap-3 text-sm">
                    {analytics.map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-semibold text-foreground">
                          {item.value}
                          <span className="ml-2 text-xs text-emerald-600">{item.trend}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {activeView === "ai-edits" ? (
              <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-medium">AI edits</p>
                  <div className="mt-4 grid gap-3 text-sm">
                    {edits.map((edit) => (
                      <div key={edit.title} className="rounded-md border border-border bg-muted/40 p-3">
                        <p className="font-medium text-foreground">{edit.title}</p>
                        <p className="text-xs text-muted-foreground">{edit.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-medium">Status</p>
                  <div className="mt-4 grid gap-2 text-xs">
                    <span className="rounded-md bg-emerald-500/10 px-2 py-2 text-emerald-700 dark:text-emerald-300">
                      3 edits applied
                    </span>
                    <span className="rounded-md bg-sky-500/10 px-2 py-2 text-sky-700 dark:text-sky-300">
                      preview regenerated
                    </span>
                    <span className="rounded-md bg-amber-500/10 px-2 py-2 text-amber-700 dark:text-amber-300">
                      awaiting approval
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}
