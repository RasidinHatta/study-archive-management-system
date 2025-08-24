import { FAQ } from "@/components/landing/faq";
import { Features } from "@/components/landing/features";
import HeroGrid from "@/components/landing/hero/HeroGrid";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <section className="flex flex-col overflow-hidden">
      <HeroGrid />
      <Separator />
      <Features />
      <Separator />
      <FAQ />
    </section>
  );
}