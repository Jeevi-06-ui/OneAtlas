export interface MarketingPageSection {
  title: string;
  description: string;
}

export interface MarketingPageConfig {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  sections: MarketingPageSection[];
}

export const marketingPages: Record<string, MarketingPageConfig> = {
  enterprise: {
    slug: "enterprise",
    eyebrow: "Enterprise",
    title: "Governed runtime programs for large teams",
    description:
      "OneAtlas Enterprise extends the runtime builder with SSO, private networking, audit trails, and dedicated support for AI-native internal tooling.",
    sections: [
      {
        title: "Workspace governance",
        description: "Role-based access, template libraries, and schema versioning policies across business units.",
      },
      {
        title: "Private deployment",
        description: "Run generated runtime apps inside your network perimeter with Neon-backed persistence.",
      },
      {
        title: "Operational SLAs",
        description: "Dedicated support, uptime commitments, and migration assistance for production rollouts.",
      },
    ],
  },
  security: {
    slug: "security",
    eyebrow: "Security",
    title: "Security built around immutable runtime schemas",
    description:
      "Preview snapshots are frozen copies. Live edits never mutate shared links. Mutation logs provide a full audit trail.",
    sections: [
      {
        title: "Preview isolation",
        description: "Each preview token maps to an immutable schema snapshot stored independently from the live app.",
      },
      {
        title: "Transactional mutations",
        description: "Schema edits run inside Postgres transactions so partial writes never persist.",
      },
      {
        title: "Validation at the edge",
        description: "Zod validates prompts, mutations, and runtime schema payloads before they touch the database.",
      },
    ],
  },
  pricing: {
    slug: "pricing",
    eyebrow: "Pricing",
    title: "Plans that scale with your runtime footprint",
    description: "Start with Studio for prototypes, move to Scale for team templates, and graduate to Enterprise for governed programs.",
    sections: [
      {
        title: "Studio — $29",
        description: "20 generated apps, version history, and frozen preview links for validation workflows.",
      },
      {
        title: "Scale — $99",
        description: "Unlimited schemas, shared templates, and advanced mutation audit logs for product teams.",
      },
      {
        title: "Enterprise — Custom",
        description: "SSO, private networking, dedicated runtime support, and custom template inheritance.",
      },
    ],
  },
  docs: {
    slug: "docs",
    eyebrow: "Docs",
    title: "Runtime schema documentation",
    description: "Learn how templates, mutations, versioning, and preview snapshots work in OneAtlas.",
    sections: [
      {
        title: "Getting started",
        description: "Install locally, connect Neon, seed templates, and generate your first runtime app from a prompt.",
      },
      {
        title: "Schema reference",
        description: "Sections, metrics, charts, tables, forms, cards, and activity components with typed props.",
      },
      {
        title: "Mutation guide",
        description: "Conversational instructions map to add_field, rename_field, reorder_components, and more.",
      },
    ],
  },
  blog: {
    slug: "blog",
    eyebrow: "Blog",
    title: "Product updates and runtime patterns",
    description: "Notes from the OneAtlas team on template-first architecture, mutation safety, and operational dashboards.",
    sections: [
      {
        title: "Why runtime schemas beat static pages",
        description: "Generated apps stay editable because the schema—not the page—is the source of truth.",
      },
      {
        title: "Template-first internal tools",
        description: "CRM, HR, admin, analytics, inventory, and support templates ship distinct operational defaults.",
      },
      {
        title: "Frozen previews for stakeholders",
        description: "Share immutable snapshots while the live builder continues to evolve.",
      },
    ],
  },
  support: {
    slug: "support",
    eyebrow: "Support",
    title: "Help for builders and operators",
    description: "Troubleshooting guides, API references, and contact paths for teams shipping on OneAtlas.",
    sections: [
      {
        title: "Builder help",
        description: "Component tree selection, conversational edits, undo, and preview link creation.",
      },
      {
        title: "API troubleshooting",
        description: "Structured errors for template matching, mutation validation, and preview token expiry.",
      },
      {
        title: "Contact",
        description: "Reach the OneAtlas team for deployment, Neon connectivity, or enterprise onboarding.",
      },
    ],
  },
};
