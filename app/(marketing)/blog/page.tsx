import { MarketingPage } from "@/components/marketing/marketing-page";
import { marketingPages } from "@/data/marketing-pages";

export const metadata = {
  title: "Blog | OneAtlas",
  description: "Product updates and runtime architecture notes from the OneAtlas team.",
};

export default function BlogPage() {
  return <MarketingPage page={marketingPages.blog} />;
}
