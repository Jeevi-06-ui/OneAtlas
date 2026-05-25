import { MarketingPage } from "@/components/marketing/marketing-page";
import { marketingPages } from "@/data/marketing-pages";

export const metadata = {
  title: "Security | OneAtlas",
  description: "Immutable preview snapshots, transactional mutations, and Zod validation.",
};

export default function SecurityPage() {
  return <MarketingPage page={marketingPages.security} />;
}
