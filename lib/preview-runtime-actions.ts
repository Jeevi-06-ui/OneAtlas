import { toast } from "sonner";

import { scrollToHash } from "@/lib/widget-actions";
import type { RuntimeRenderActions } from "@/types/runtime-render";

export function createPreviewRuntimeActions(): RuntimeRenderActions {
  return {
    onTableAction: (actionLabel, _componentId, tableTitle) => {
      toast.success(`${actionLabel} queued for ${tableTitle}`, {
        description: "Generate an app from this template to persist schema changes.",
      });
    },
    onCardAction: (actionLabel, _componentId, cardTitle) => {
      toast.success(`${actionLabel}`, { description: `Action applied in ${cardTitle} preview.` });
    },
    onFormSubmit: (_componentId, values) => {
      const filled = Object.values(values).filter((value) => value.trim().length > 0).length;
      toast.success(`Preview form captured ${filled} field(s).`);
    },
    onActivityItem: (title, detail) => {
      toast.info(title, { description: detail });
    },
    onNavSelect: (href) => {
      scrollToHash(href);
    },
  };
}
