import type { RuntimeSchema, RuntimeTone } from "@/types/runtime";
import type { TemplateCategory, TemplateComplexity, TemplateConfig } from "@/types/template";

const CREATED_AT = "2026-05-25T00:00:00.000Z";

export const templates: TemplateConfig[] = [
  {
    id: "tpl_crm_workspace",
    name: "CRM Workspace",
    slug: "crm-workspace",
    description: "A revenue operations workspace for accounts, opportunities, contacts, pipeline health, and follow-up automation.",
    category: "Sales",
    complexity: "Growth",
    tags: ["crm", "sales", "pipeline", "contacts", "accounts", "revenue"],
    keywords: ["lead", "deal", "sales", "client", "contact", "account", "pipeline", "customer"],
    schemaDefaults: {
      id: "crm-workspace-schema",
      appName: "CRM Workspace",
      templateSlug: "crm-workspace",
      version: 1,
      theme: { mode: "system", accent: "sky", density: "comfortable", radius: "md" },
      sidebar: {
        brand: "CRM Workspace",
        groups: [
          {
            id: "crm-sales",
            label: "Sales",
            items: [
              { id: "crm-dash", label: "Dashboard", icon: "LayoutDashboard" },
              { id: "crm-customers", label: "Customers", icon: "Users" },
              { id: "crm-deals", label: "Deals", icon: "Briefcase" },
              { id: "crm-pipeline", label: "Pipeline", icon: "Kanban" },
              { id: "crm-reports", label: "Reports", icon: "ChartNoAxesColumn" }
            ]
          }
        ]
      },
      navigation: [
        { id: "crm-home", label: "Dashboard", href: "#dashboard" },
        { id: "crm-pipeline-nav", label: "Pipeline", href: "#pipeline" }
      ],
      sections: [
        {
          id: "crm-overview-section",
          title: "Sales Overview",
          description: "Live revenue pipeline and sales performance.",
          layout: "grid",
          columns: 3,
          components: [
            { id: "crm-metric-revenue", type: "metric", title: "Revenue", value: "$84.2K", trend: "+12% this month", tone: "sky", icon: "DollarSign", order: 1, width: "third" },
            { id: "crm-metric-deals", type: "metric", title: "Active Deals", value: "148", trend: "+8% vs last month", tone: "emerald", icon: "Briefcase", order: 2, width: "third" },
            { id: "crm-metric-winrate", type: "metric", title: "Win Rate", value: "64%", trend: "+3% improvement", tone: "amber", icon: "TrendingUp", order: 3, width: "third" },
            { id: "crm-chart-pipeline", type: "chart", title: "Sales Pipeline", description: "Pipeline value by stage", chartType: "bar", tone: "sky", order: 4, width: "full",
              data: [
                { label: "Lead", value: 450, comparison: 400 },
                { label: "Qualified", value: 320, comparison: 300 },
                { label: "Proposal", value: 210, comparison: 180 },
                { label: "Negotiation", value: 150, comparison: 130 },
                { label: "Closed", value: 90, comparison: 80 }
              ]
            },
            { id: "crm-activity-feed", type: "activity", title: "Sales Activity Feed", description: "Recent deal movements", order: 5, width: "half",
              items: [
                { id: "crm-act-1", title: "Acme Corp moved to Negotiation", detail: "Deal size $12,500", timestamp: "10m ago", tone: "sky" },
                { id: "crm-act-2", title: "Contract signed", detail: "Delta LLC closed won", timestamp: "3h ago", tone: "emerald" }
              ]
            },
            { id: "crm-card-stages", type: "card", title: "Deal Stages", description: "Active stages requiring attention", content: "You have 3 deals in final negotiation and 12 proposals pending review.", tone: "sky", order: 6, width: "half", actions: [{ id: "crm-btn-review", label: "Review Proposals", intent: "primary" }] }
          ]
        },
        {
          id: "crm-records-section",
          title: "Customers & Deals",
          layout: "stack",
          columns: 1,
          components: [
            {
              id: "crm-table-customers", type: "table", title: "Customers", description: "Active customer accounts", primaryAction: "Add Customer", order: 1, width: "full",
              columns: [
                { key: "company", label: "Company", type: "text", sortable: true },
                { key: "contact", label: "Primary Contact", type: "text", sortable: true },
                { key: "status", label: "Status", type: "status", sortable: true },
                { key: "arr", label: "ARR", type: "currency", sortable: true }
              ],
              rows: [
                { company: "Acme Corp", contact: "John Doe", status: "Active", arr: 12500 },
                { company: "Beta Inc", contact: "Jane Smith", status: "Onboarding", arr: 8400 },
                { company: "Gamma LLC", contact: "Bob Jones", status: "At Risk", arr: 4200 }
              ]
            }
          ]
        }
      ],
      metadata: { generatedFrom: "CRM Workspace", ownerRole: "Revenue Operations", status: "draft", lastEditedAt: CREATED_AT }
    },
    parentTemplateId: undefined,
    createdAt: CREATED_AT
  },
  {
    id: "tpl_hr_dashboard",
    name: "HR Dashboard",
    slug: "hr-dashboard",
    description: "A people operations dashboard for hiring pipelines, employee engagement, onboarding, and workforce planning.",
    category: "People Ops",
    complexity: "Starter",
    tags: ["hr", "people", "employees", "hiring", "onboarding", "engagement"],
    keywords: ["employee", "candidate", "hiring", "people", "recruiting", "onboarding", "headcount"],
    schemaDefaults: {
      id: "hr-dashboard-schema",
      appName: "HR Dashboard",
      templateSlug: "hr-dashboard",
      version: 1,
      theme: { mode: "system", accent: "emerald", density: "comfortable", radius: "md" },
      sidebar: {
        brand: "HR Dashboard",
        groups: [
          {
            id: "hr-people",
            label: "People",
            items: [
              { id: "hr-employees", label: "Employees", icon: "Users" },
              { id: "hr-hiring", label: "Hiring", icon: "UserPlus" },
              { id: "hr-attendance", label: "Attendance", icon: "Clock" },
              { id: "hr-payroll", label: "Payroll", icon: "CreditCard" }
            ]
          }
        ]
      },
      navigation: [
        { id: "hr-nav-dash", label: "Employees", href: "#employees" },
        { id: "hr-nav-hire", label: "Hiring", href: "#hiring" }
      ],
      sections: [
        {
          id: "hr-metrics-section",
          title: "Employee Dashboard",
          layout: "grid",
          columns: 3,
          components: [
            { id: "hr-metric-emp", type: "metric", title: "Employees", value: "284", trend: "+4% YTD", tone: "emerald", icon: "Users", order: 1, width: "third" },
            { id: "hr-metric-roles", type: "metric", title: "Open Roles", value: "12", trend: "+2% this quarter", tone: "sky", icon: "Briefcase", order: 2, width: "third" },
            { id: "hr-metric-onboard", type: "metric", title: "Onboarding Progress", value: "86%", trend: "14 hires in flight", tone: "amber", icon: "UserPlus", order: 3, width: "third" },
            { id: "hr-chart-hiring", type: "chart", title: "Hiring Pipeline", description: "Candidates by stage", chartType: "line", tone: "emerald", order: 4, width: "half",
              data: [
                { label: "Sourcing", value: 80, comparison: 70 },
                { label: "Screening", value: 45, comparison: 40 },
                { label: "Interview", value: 25, comparison: 20 },
                { label: "Offer", value: 5, comparison: 3 }
              ]
            },
            { id: "hr-chart-attendance", type: "chart", title: "Attendance", description: "Weekly attendance rate", chartType: "area", tone: "sky", order: 5, width: "half",
              data: [
                { label: "Mon", value: 96, comparison: 94 },
                { label: "Tue", value: 94, comparison: 93 },
                { label: "Wed", value: 92, comparison: 91 },
                { label: "Thu", value: 95, comparison: 93 },
                { label: "Fri", value: 88, comparison: 90 }
              ]
            },
            { id: "hr-card-payroll", type: "card", title: "Payroll Widgets", description: "Next payroll cycle and approvals", content: "Payroll run scheduled in 3 days. 6 expense approvals and 2 bonus adjustments pending.", tone: "emerald", order: 6, width: "full", actions: [{ id: "hr-payroll-review", label: "Review Payroll", intent: "primary" }] },
            { id: "hr-table-emp", type: "table", title: "Employees", description: "Active workforce directory", primaryAction: "Add Employee", order: 7, width: "full",
              columns: [
                { key: "name", label: "Name", type: "text", sortable: true },
                { key: "role", label: "Role", type: "text", sortable: true },
                { key: "department", label: "Department", type: "text", sortable: true },
                { key: "status", label: "Status", type: "status", sortable: true }
              ],
              rows: [
                { name: "Alice Walker", role: "Engineer", department: "Engineering", status: "Active" },
                { name: "Bob Harris", role: "Designer", department: "Product", status: "Active" },
                { name: "Charlie Davis", role: "Recruiter", department: "People", status: "On Leave" }
              ]
            },
            { id: "hr-table-leave", type: "table", title: "Leave Requests", description: "Pending time-off approvals", primaryAction: "Approve Next", order: 8, width: "full",
              columns: [
                { key: "employee", label: "Employee", type: "text", sortable: true },
                { key: "type", label: "Type", type: "text", sortable: true },
                { key: "dates", label: "Dates", type: "text", sortable: true },
                { key: "status", label: "Status", type: "status", sortable: true }
              ],
              rows: [
                { employee: "Alice Walker", type: "PTO", dates: "Jun 2–6", status: "Pending" },
                { employee: "Bob Harris", type: "Sick", dates: "May 28", status: "Approved" },
                { employee: "Charlie Davis", type: "Parental", dates: "Jul 1–Aug 15", status: "Review" }
              ]
            }
          ]
        }
      ],
      metadata: { generatedFrom: "HR Dashboard", ownerRole: "People Operations", status: "draft", lastEditedAt: CREATED_AT }
    },
    parentTemplateId: undefined,
    createdAt: CREATED_AT
  },
  {
    id: "tpl_analytics_workspace",
    name: "Analytics Workspace",
    slug: "analytics-workspace",
    description: "A modular analytics workspace for KPI tracking, dashboards, reports, data quality, and executive briefs.",
    category: "Data",
    complexity: "Advanced",
    tags: ["analytics", "data", "kpi", "reports", "dashboards", "metrics"],
    keywords: ["analytics", "metric", "dashboard", "chart", "report", "data", "insight", "kpi"],
    schemaDefaults: {
      id: "analytics-workspace-schema",
      appName: "Analytics Workspace",
      templateSlug: "analytics-workspace",
      version: 1,
      theme: { mode: "system", accent: "violet", density: "comfortable", radius: "md" },
      sidebar: {
        brand: "Analytics Workspace",
        groups: [
          {
            id: "ana-dash",
            label: "Dashboards",
            items: [
              { id: "ana-overview", label: "Overview", icon: "BarChart" },
              { id: "ana-reports", label: "Reports", icon: "FileText" },
              { id: "ana-insights", label: "Insights", icon: "Lightbulb" },
              { id: "ana-kpis", label: "KPIs", icon: "Target" }
            ]
          }
        ]
      },
      navigation: [
        { id: "ana-nav-dash", label: "Dashboards", href: "#dashboards" }
      ],
      sections: [
        {
          id: "ana-kpi-section",
          title: "KPI Dashboards",
          layout: "grid",
          columns: 2,
          components: [
            { id: "ana-metric-traffic", type: "metric", title: "Traffic", value: "1.2M", trend: "+22% vs last month", tone: "violet", icon: "Globe", order: 1, width: "half" },
            { id: "ana-metric-conv", type: "metric", title: "Conversions", value: "18%", trend: "+5% vs last month", tone: "emerald", icon: "MousePointerClick", order: 2, width: "half" },
            { id: "ana-chart-traffic", type: "chart", title: "Traffic Trends", description: "Daily unique visitors", chartType: "area", tone: "violet", order: 3, width: "full",
              data: [
                { label: "Mon", value: 12000, comparison: 10000 },
                { label: "Tue", value: 14000, comparison: 11000 },
                { label: "Wed", value: 16000, comparison: 13000 },
                { label: "Thu", value: 15000, comparison: 12000 },
                { label: "Fri", value: 18000, comparison: 14000 }
              ]
            },
            { id: "ana-card-insights", type: "card", title: "Executive Insights", description: "AI-generated brief for leadership", content: "Conversion lift is strongest on mobile web. Paid search CAC improved 11% while organic traffic drove 62% of new signups.", tone: "violet", order: 4, width: "half", actions: [{ id: "ana-insight-share", label: "Share Brief", intent: "primary" }] },
            { id: "ana-card-filters", type: "card", title: "Report Filters", description: "Saved executive filter sets", content: "Active filters: Enterprise segment, North America, last 30 days, paid + organic channels.", tone: "sky", order: 5, width: "half", actions: [{ id: "ana-filter-edit", label: "Edit Filters", intent: "secondary" }] },
            { id: "ana-table-reports", type: "table", title: "Top Reports", description: "Most viewed executive reports", primaryAction: "New Report", order: 6, width: "full",
              columns: [
                { key: "report", label: "Report Name", type: "text", sortable: true },
                { key: "views", label: "Views", type: "number", sortable: true },
                { key: "status", label: "Status", type: "status", sortable: true }
              ],
              rows: [
                { report: "Q1 Growth Board", views: 1240, status: "Active" },
                { report: "Marketing Spend", views: 890, status: "Active" },
                { report: "Churn Analysis", views: 450, status: "Needs Review" }
              ]
            }
          ]
        }
      ],
      metadata: { generatedFrom: "Analytics Workspace", ownerRole: "Data Operations", status: "draft", lastEditedAt: CREATED_AT }
    },
    parentTemplateId: undefined,
    createdAt: CREATED_AT
  },
  {
    id: "tpl_inventory_system",
    name: "Inventory System",
    slug: "inventory-system",
    description: "A supply chain control center for SKU inventory, reorder rules, suppliers, warehouses, and exceptions.",
    category: "Supply Chain",
    complexity: "Growth",
    tags: ["inventory", "supply chain", "warehouse", "sku", "procurement", "stock"],
    keywords: ["inventory", "stock", "sku", "warehouse", "supplier", "procurement", "reorder"],
    schemaDefaults: {
      id: "inv-workspace-schema",
      appName: "Inventory System",
      templateSlug: "inventory-system",
      version: 1,
      theme: { mode: "system", accent: "amber", density: "comfortable", radius: "md" },
      sidebar: {
        brand: "Inventory System",
        groups: [
          {
            id: "inv-ops",
            label: "Operations",
            items: [
              { id: "inv-stock", label: "Stock Levels", icon: "Package" },
              { id: "inv-sku", label: "SKU Tables", icon: "List" },
              { id: "inv-map", label: "Warehouse Map", icon: "Map" },
              { id: "inv-suppliers", label: "Supplier Analytics", icon: "Truck" },
              { id: "inv-alerts", label: "Reorder Alerts", icon: "Bell" }
            ]
          }
        ]
      },
      navigation: [{ id: "inv-nav-dash", label: "Stock Levels", href: "#stock" }],
      sections: [
        {
          id: "inv-levels-section",
          title: "Warehouse Analytics",
          layout: "grid",
          columns: 2,
          components: [
            { id: "inv-metric-val", type: "metric", title: "Stock Levels", value: "$1.8M", trend: "Stable", tone: "amber", icon: "Package", order: 1, width: "half" },
            { id: "inv-metric-alerts", type: "metric", title: "Reorder Alerts", value: "34", trend: "+12 critical", tone: "rose", icon: "AlertTriangle", order: 2, width: "half" },
            { id: "inv-chart-wh", type: "chart", title: "Warehouse Distribution", description: "Stock distribution by zone", chartType: "donut", tone: "amber", order: 3, width: "full",
              data: [
                { label: "Zone A", value: 45 },
                { label: "Zone B", value: 30 },
                { label: "Zone C", value: 15 },
                { label: "Zone D", value: 10 }
              ]
            },
            { id: "inv-card-suppliers", type: "card", title: "Supplier Analytics", description: "Vendor performance snapshot", content: "Top supplier fill rate is 94%. Two vendors missed SLA targets this week and require review.", tone: "amber", order: 4, width: "half", actions: [{ id: "inv-supplier-review", label: "Review Vendors", intent: "primary" }] },
            { id: "inv-activity-reorder", type: "activity", title: "Reorder Alerts", description: "SKUs below safety stock", order: 5, width: "half",
              items: [
                { id: "inv-alert-1", title: "SKU-8821 critical", detail: "Connector Beta at 8 units", timestamp: "5m ago", tone: "rose" },
                { id: "inv-alert-2", title: "SKU-1029 reorder", detail: "Widget Alpha below threshold", timestamp: "1h ago", tone: "amber" },
                { id: "inv-alert-3", title: "PO-4412 delayed", detail: "Supplier Gamma shipment late", timestamp: "3h ago", tone: "amber" }
              ]
            },
            { id: "inv-table-skus", type: "table", title: "SKU Tables", description: "Current low stock items", primaryAction: "Reorder All", order: 6, width: "full",
              columns: [
                { key: "sku", label: "SKU", type: "text", sortable: true },
                { key: "name", label: "Product", type: "text", sortable: true },
                { key: "qty", label: "Qty", type: "number", sortable: true },
                { key: "status", label: "Status", type: "status", sortable: true }
              ],
              rows: [
                { sku: "SKU-1029", name: "Widget Alpha", qty: 15, status: "Reorder" },
                { sku: "SKU-8821", name: "Connector Beta", qty: 8, status: "Critical" },
                { sku: "SKU-9912", name: "Housing Gamma", qty: 24, status: "Warning" }
              ]
            }
          ]
        }
      ],
      metadata: { generatedFrom: "Inventory System", ownerRole: "Supply Chain Operations", status: "draft", lastEditedAt: CREATED_AT }
    },
    parentTemplateId: undefined,
    createdAt: CREATED_AT
  },
  {
    id: "tpl_support_workspace",
    name: "Support Workspace",
    slug: "support-workspace",
    description: "A customer support workspace for tickets, SLA health, escalations, knowledge gaps, and team queues.",
    category: "Customer Ops",
    complexity: "Starter",
    tags: ["support", "tickets", "sla", "customer", "queue", "escalations"],
    keywords: ["support", "ticket", "case", "sla", "queue", "customer", "escalation", "helpdesk"],
    schemaDefaults: {
      id: "sup-workspace-schema",
      appName: "Support Workspace",
      templateSlug: "support-workspace",
      version: 1,
      theme: { mode: "system", accent: "rose", density: "comfortable", radius: "md" },
      sidebar: {
        brand: "Support Workspace",
        groups: [
          {
            id: "sup-ops",
            label: "Support Ops",
            items: [
              { id: "sup-queue", label: "Tickets Queue", icon: "Inbox" },
              { id: "sup-sla", label: "SLA Cards", icon: "Clock" },
              { id: "sup-chat", label: "Customer Chat", icon: "MessageSquare" },
              { id: "sup-feed", label: "Escalation Feed", icon: "AlertCircle" },
              { id: "sup-metrics", label: "Response Metrics", icon: "Activity" }
            ]
          }
        ]
      },
      navigation: [{ id: "sup-nav-dash", label: "Tickets", href: "#tickets" }],
      sections: [
        {
          id: "sup-sla-section",
          title: "SLA Dashboard",
          layout: "grid",
          columns: 3,
          components: [
            { id: "sup-metric-open", type: "metric", title: "Open Tickets", value: "142", trend: "-18 today", tone: "sky", icon: "Inbox", order: 1, width: "third" },
            { id: "sup-metric-sla", type: "metric", title: "SLA Compliance", value: "96.4%", trend: "Within target", tone: "emerald", icon: "ShieldCheck", order: 2, width: "third" },
            { id: "sup-metric-resp", type: "metric", title: "Avg Response", value: "1h 12m", trend: "Meeting SLA", tone: "amber", icon: "Clock", order: 3, width: "third" },
            { id: "sup-card-chat", type: "card", title: "Customer Chat", description: "Live conversations awaiting agent", content: "7 active chats. 2 VIP threads flagged for immediate response.", tone: "sky", order: 4, width: "half", actions: [{ id: "sup-chat-open", label: "Open Queue", intent: "primary" }] },
            { id: "sup-activity-esc", type: "activity", title: "Escalation Feed", description: "Recent VIP and critical escalations", order: 5, width: "half",
              items: [
                { id: "esc-1", title: "VIP Customer Outage", detail: "Acme Corp experiencing auth failure", timestamp: "2m ago", tone: "rose" },
                { id: "esc-2", title: "Billing Dispute", detail: "Beta Inc charged twice", timestamp: "45m ago", tone: "amber" }
              ]
            },
            { id: "sup-table-tickets", type: "table", title: "Tickets Queue", description: "Active tickets needing response", primaryAction: "Assign Next", order: 6, width: "full",
              columns: [
                { key: "id", label: "ID", type: "text", sortable: true },
                { key: "subject", label: "Subject", type: "text", sortable: true },
                { key: "priority", label: "Priority", type: "status", sortable: true },
                { key: "wait", label: "Wait Time", type: "text", sortable: true }
              ],
              rows: [
                { id: "TCK-8819", subject: "Cannot login to portal", priority: "High", wait: "45m" },
                { id: "TCK-8820", subject: "Invoice question", priority: "Normal", wait: "2h" },
                { id: "TCK-8821", subject: "Feature request", priority: "Low", wait: "1d" }
              ]
            }
          ]
        }
      ],
      metadata: { generatedFrom: "Support Workspace", ownerRole: "Support Operations", status: "draft", lastEditedAt: CREATED_AT }
    },
    parentTemplateId: undefined,
    createdAt: CREATED_AT
  }
];

export function getTemplateBySlug(slug: string) {
  return templates.find((template) => template.slug === slug);
}

export function getTemplateById(id: string) {
  return templates.find((template) => template.id === id);
}