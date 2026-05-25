import { MarketingPage } from "@/components/marketing/marketing-page";
import { marketingPages } from "@/data/marketing-pages";

export const metadata = {
  title: "Enterprise | OneAtlas",
  description: "Enterprise runtime programs with governance, private deployment, and dedicated support.",
};

export default function EnterprisePage() {
  return <MarketingPage page={marketingPages.enterprise} />;
}
