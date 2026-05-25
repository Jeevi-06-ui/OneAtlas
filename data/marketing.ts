import type { MegaMenuItem } from "@/components/layout/mega-menu";

export const workSteps = [
  {
    title: "Prompt to intent",
    description: "OneAtlas scores the prompt against live template metadata and selects the best operational starting point.",
  },
  {
    title: "Schema first",
    description: "The runtime schema defines navigation, metrics, charts, records, forms, and editable properties.",
  },
  {
    title: "Conversational edits",
    description: "Natural language instructions become typed mutations with versioned snapshots and rollback safety.",
  },
  {
    title: "Frozen previews",
    description: "Share immutable preview links without coupling stakeholders to the live builder state.",
  },
];

export const modelHighlights = [
  "Bring your own model router",
  "Prompt-aware template selection",
  "Schema mutation guardrails",
  "Runtime preview isolation",
];

export const roleCards = [
  {
    role: "Founders",
    value: "Turn a rough product workflow into an editable app shell in minutes.",
  },
  {
    role: "Operations",
    value: "Build internal systems with records, queues, analytics, and approvals already wired into the schema.",
  },
  {
    role: "Product teams",
    value: "Prototype data-backed tools while preserving history for review and iteration.",
  },
  {
    role: "Agencies",
    value: "Create tailored client portals, dashboards, and admin panels with reusable runtime patterns.",
  },
];

export const pricingPreview = [
  {
    name: "Studio",
    price: "$29",
    description: "For builders validating internal tools and customer portals.",
    features: ["20 generated apps", "Version history", "Preview snapshots"],
  },
  {
    name: "Scale",
    price: "$99",
    description: "For teams shipping operational apps across functions.",
    features: ["Unlimited schemas", "Team templates", "Advanced audit logs"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For governed AI-native application programs.",
    features: ["SSO", "Private networking", "Dedicated runtime support"],
  },
];

export const faqs = [
  {
    question: "Is OneAtlas a code generator or a runtime?",
    answer:
      "It is schema-first runtime builder. The schema can be generated, edited, versioned, rendered, and frozen for previews.",
  },
  {
    question: "Can existing previews change after edits?",
    answer:
      "No. Preview snapshots store an immutable schema copy, so live edits do not affect links already shared.",
  },
  {
    question: "What kind of apps work best?",
    answer:
      "Operational tools such as CRMs, admin panels, dashboards, inventory systems, HR workspaces, and support queues.",
  },
  {
    question: "Can teams bring custom templates?",
    answer:
      "Yes. Templates are data-driven and can be seeded into the database or extended in the config layer.",
  },
];

export const navItems: MegaMenuItem[] = [
  {
    label: "Product",
    href: "/#how-it-works",
    columns: [
      {
        title: "Platform",
        items: [
          { label: "Runtime Builder", href: "/#how-it-works", description: "Prompt to schema generation" },
          { label: "Schema Engine", href: "/#models", description: "Typed runtime contracts" },
          { label: "Preview System", href: "/security", description: "Immutable frozen snapshots" },
        ],
      },
      {
        title: "Workflow",
        items: [
          { label: "Templates", href: "/templates", description: "Operational starting points" },
          { label: "Docs", href: "/docs", description: "Setup and API guides" },
          { label: "Support", href: "/support", description: "Builder troubleshooting" },
        ],
      },
    ],
  },
  {
    label: "Use Cases",
    href: "/#roles",
    columns: [
      {
        title: "Teams",
        items: [
          { label: "Operations", href: "/#roles", description: "Internal dashboards and queues" },
          { label: "Product", href: "/#roles", description: "Rapid workflow prototypes" },
          { label: "Agencies", href: "/#roles", description: "Client portals and admin panels" },
        ],
      },
      {
        title: "Templates",
        items: [
          { label: "CRM Workspace", href: "/templates?category=Sales" },
          { label: "HR Dashboard", href: "/templates?category=People%20Ops" },
          { label: "Admin Panel", href: "/templates?category=Platform" },
        ],
      },
    ],
  },
  { label: "Templates", href: "/templates" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Security", href: "/security" },
  { label: "Pricing", href: "/pricing" },
  {
    label: "Resources",
    href: "/docs",
    items: [
      { label: "Docs", href: "/docs" },
      { label: "Blog", href: "/blog" },
      { label: "Support", href: "/support" },
      { label: "Updates", href: "/blog" },
    ],
  },
  {
    label: "Community",
    href: "/#community",
    items: [
      { label: "Discord", href: "https://discord.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "Twitter", href: "https://twitter.com" },
      { label: "Reddit", href: "https://reddit.com" },
      { label: "GitHub", href: "https://github.com" },
      { label: "Instagram", href: "https://instagram.com" },
    ],
  },
];

export const footerLinks = {
  product: [
    { label: "Runtime Builder", href: "/#how-it-works" },
    { label: "Templates", href: "/templates" },
    { label: "Preview System", href: "/security" },
  ],
  company: [
    { label: "Enterprise", href: "/enterprise" },
    { label: "Security", href: "/security" },
    { label: "Pricing", href: "/pricing" },
  ],
  community: [
    { label: "Docs", href: "/docs" },
    { label: "Blog", href: "/blog" },
    { label: "Support", href: "/support" },
  ],
};
