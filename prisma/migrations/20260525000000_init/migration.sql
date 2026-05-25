CREATE TABLE "Template" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "complexity" TEXT NOT NULL,
  "tags" TEXT[] NOT NULL,
  "schemaDefaults" JSONB NOT NULL,
  "parentTemplateId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "App" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "prompt" TEXT NOT NULL,
  "templateId" TEXT NOT NULL,
  "currentSchema" JSONB NOT NULL,
  "currentVersion" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SchemaVersion" (
  "id" TEXT NOT NULL,
  "appId" TEXT NOT NULL,
  "version" INTEGER NOT NULL,
  "schemaSnapshot" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "SchemaVersion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MutationLog" (
  "id" TEXT NOT NULL,
  "appId" TEXT NOT NULL,
  "instruction" TEXT NOT NULL,
  "mutationType" TEXT NOT NULL,
  "mutationPayload" JSONB NOT NULL,
  "resultSummary" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "MutationLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PreviewSnapshot" (
  "id" TEXT NOT NULL,
  "appId" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "schemaSnapshot" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3),

  CONSTRAINT "PreviewSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Template_slug_key" ON "Template"("slug");
CREATE INDEX "Template_category_idx" ON "Template"("category");
CREATE INDEX "Template_complexity_idx" ON "Template"("complexity");
CREATE INDEX "Template_parentTemplateId_idx" ON "Template"("parentTemplateId");

CREATE INDEX "App_templateId_idx" ON "App"("templateId");
CREATE INDEX "App_createdAt_idx" ON "App"("createdAt");
CREATE INDEX "App_updatedAt_idx" ON "App"("updatedAt");

CREATE UNIQUE INDEX "SchemaVersion_appId_version_key" ON "SchemaVersion"("appId", "version");
CREATE INDEX "SchemaVersion_appId_createdAt_idx" ON "SchemaVersion"("appId", "createdAt");

CREATE INDEX "MutationLog_appId_createdAt_idx" ON "MutationLog"("appId", "createdAt");
CREATE INDEX "MutationLog_mutationType_idx" ON "MutationLog"("mutationType");

CREATE UNIQUE INDEX "PreviewSnapshot_token_key" ON "PreviewSnapshot"("token");
CREATE INDEX "PreviewSnapshot_appId_createdAt_idx" ON "PreviewSnapshot"("appId", "createdAt");
CREATE INDEX "PreviewSnapshot_expiresAt_idx" ON "PreviewSnapshot"("expiresAt");

ALTER TABLE "Template"
  ADD CONSTRAINT "Template_parentTemplateId_fkey"
  FOREIGN KEY ("parentTemplateId") REFERENCES "Template"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "App"
  ADD CONSTRAINT "App_templateId_fkey"
  FOREIGN KEY ("templateId") REFERENCES "Template"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "SchemaVersion"
  ADD CONSTRAINT "SchemaVersion_appId_fkey"
  FOREIGN KEY ("appId") REFERENCES "App"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MutationLog"
  ADD CONSTRAINT "MutationLog_appId_fkey"
  FOREIGN KEY ("appId") REFERENCES "App"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PreviewSnapshot"
  ADD CONSTRAINT "PreviewSnapshot_appId_fkey"
  FOREIGN KEY ("appId") REFERENCES "App"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
