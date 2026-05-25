"use client";

import type { ReactNode } from "react";

import { CardRenderer } from "@/components/runtime-renderer/renderers/card-renderer";
import { ChartRenderer } from "@/components/runtime-renderer/renderers/chart-renderer";
import { FormRenderer } from "@/components/runtime-renderer/renderers/form-renderer";
import { MetricRenderer } from "@/components/runtime-renderer/renderers/metric-renderer";
import { TableRenderer } from "@/components/runtime-renderer/renderers/table-renderer";
import { ActivityRenderer } from "@/components/runtime-renderer/renderers/activity-renderer";
import type {
  RuntimeActivityComponent,
  RuntimeCardComponent,
  RuntimeChartComponent,
  RuntimeComponent,
  RuntimeFormComponent,
  RuntimeMetricComponent,
  RuntimeTableComponent,
} from "@/types/runtime";

import type { RuntimeRenderContext } from "@/types/runtime-render";

interface RegistryEntry {
  render: (component: RuntimeComponent, context: RuntimeRenderContext) => ReactNode;
}

export const runtimeComponentRegistry: Record<RuntimeComponent["type"], RegistryEntry> = {
  metric: {
    render: (component, context) => (
      <MetricRenderer
        component={component as RuntimeMetricComponent}
        selected={context.selectedId === component.id}
        onSelect={context.onSelect}
      />
    ),
  },
  chart: {
    render: (component, context) => (
      <ChartRenderer
        component={component as RuntimeChartComponent}
        selected={context.selectedId === component.id}
        onSelect={context.onSelect}
      />
    ),
  },
  table: {
    render: (component, context) => (
      <TableRenderer
        component={component as RuntimeTableComponent}
        selected={context.selectedId === component.id}
        onSelect={context.onSelect}
        context={context}
      />
    ),
  },
  form: {
    render: (component, context) => (
      <FormRenderer
        component={component as RuntimeFormComponent}
        selected={context.selectedId === component.id}
        onSelect={context.onSelect}
        context={context}
      />
    ),
  },
  card: {
    render: (component, context) => (
      <CardRenderer
        component={component as RuntimeCardComponent}
        selected={context.selectedId === component.id}
        onSelect={context.onSelect}
        context={context}
      />
    ),
  },
  activity: {
    render: (component, context) => (
      <ActivityRenderer
        component={component as RuntimeActivityComponent}
        selected={context.selectedId === component.id}
        onSelect={context.onSelect}
        context={context}
      />
    ),
  },
};
