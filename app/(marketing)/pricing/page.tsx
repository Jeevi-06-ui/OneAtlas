import { MarketingPage } from "@/components/marketing/marketing-page";
import { marketingPages } from "@/data/marketing-pages";

export const metadata = {
  title: "Pricing | OneAtlas",
  description: "Studio, Scale, and Enterprise plans for runtime app generation.",
};

export default function PricingPage() {
  return <MarketingPage page={marketingPages.pricing} />;
}
