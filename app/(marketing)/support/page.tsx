import { MarketingPage } from "@/components/marketing/marketing-page";
import { marketingPages } from "@/data/marketing-pages";

export const metadata = {
  title: "Support | OneAtlas",
  description: "Builder help, API troubleshooting, and contact paths for OneAtlas teams.",
};

export default function SupportPage() {
  return <MarketingPage page={marketingPages.support} />;
}
