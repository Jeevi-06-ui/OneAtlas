import { MarketingPage } from "@/components/marketing/marketing-page";
import { marketingPages } from "@/data/marketing-pages";

export const metadata = {
  title: "Docs | OneAtlas",
  description: "Documentation for runtime schemas, templates, mutations, and previews.",
};

export default function DocsPage() {
  return <MarketingPage page={marketingPages.docs} />;
}
