"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RendererFrame } from "@/components/runtime-renderer/renderer-frame";
import type { RuntimeChartComponent } from "@/types/runtime";

const toneFill: Record<RuntimeChartComponent["tone"], string> = {
  neutral: "#64748b",
  sky: "#0284c7",
  emerald: "#059669",
  amber: "#d97706",
  rose: "#e11d48",
  violet: "#7c3aed",
};

interface ChartRendererProps {
  component: RuntimeChartComponent;
  selected?: boolean;
  onSelect?: (componentId: string) => void;
}

export function ChartRenderer({ component, selected, onSelect }: ChartRendererProps) {
  const maxValue = Math.max(...component.data.map((point) => point.value), 1);
  const points = component.data
    .map((point, index) => {
      const x = 16 + index * (320 / Math.max(component.data.length - 1, 1));
      const y = 138 - (point.value / maxValue) * 112;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <RendererFrame id={component.id} selected={selected} onSelect={onSelect}>
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{component.title}</CardTitle>
            {component.description ? (
              <p className="mt-2 text-sm text-muted-foreground">{component.description}</p>
            ) : null}
          </div>
          <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
            {component.chartType}
          </span>
        </CardHeader>
        <CardContent>
          {component.chartType === "donut" ? (
            <div className="flex h-44 items-center justify-center gap-6">
              <div
                className="relative size-32 rounded-full"
                style={{
                  background: `conic-gradient(${component.data
                    .map((point, index) => {
                      const start = (component.data
                        .slice(0, index)
                        .reduce((sum, item) => sum + item.value, 0) /
                        component.data.reduce((sum, item) => sum + item.value, 0)) *
                        360;
                      const end =
                        start +
                        (point.value / component.data.reduce((sum, item) => sum + item.value, 0)) * 360;
                      const palette = ["#0284c7", "#059669", "#d97706", "#7c3aed", "#e11d48"];
                      return `${palette[index % palette.length]} ${start}deg ${end}deg`;
                    })
                    .join(", ")})`,
                }}
                role="img"
                aria-label={component.title}
              />
              <div className="grid gap-2 text-xs text-muted-foreground">
                {component.data.map((point) => (
                  <div key={point.label} className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{point.label}</span>
                    <span>{point.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : component.chartType === "line" || component.chartType === "area" ? (
            <svg viewBox="0 0 360 160" className="h-44 w-full" role="img" aria-label={component.title}>
              {component.chartType === "area" ? (
                <polygon
                  points={`16,138 ${points} ${16 + (component.data.length - 1) * (320 / Math.max(component.data.length - 1, 1))},138`}
                  fill={toneFill[component.tone]}
                  fillOpacity="0.15"
                />
              ) : null}
              <polyline points={points} fill="none" stroke={toneFill[component.tone]} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              {component.data.map((point, index) => {
                const x = 16 + index * (320 / Math.max(component.data.length - 1, 1));
                const y = 138 - (point.value / maxValue) * 112;
                return <circle key={point.label} cx={x} cy={y} r="4" fill={toneFill[component.tone]} />;
              })}
            </svg>
          ) : (
            <div className="flex h-44 items-end gap-2">
              {component.data.map((point) => (
                <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full items-end rounded-t-md bg-muted">
                    <div
                      className="w-full rounded-t-md"
                      style={{
                        height: `${Math.max(12, (point.value / maxValue) * 150)}px`,
                        backgroundColor: toneFill[component.tone],
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{point.label}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </RendererFrame>
  );
}
