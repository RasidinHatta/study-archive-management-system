import { AnimatedGroup } from "@/components/animations/AnimatedGroup";
import { AnimatedText } from "@/components/animations/AnimatedText";
import HeroGrid from "@/components/landing/hero/HeroGrid";
import InteractiveGrid from "@/components/landing/hero/InteractiveGrid";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Upload & Organize",
    description: "Easily upload documents and manage them with tags, folders, and version history.",
  },
  {
    title: "Read Anywhere",
    description: "Mobile-friendly viewer supports PDFs, DOCX, PPT, and more — no extra software needed.",
  },
  {
    title: "Share & Collaborate",
    description: "Control access, leave comments, and collaborate in real-time with your team or audience.",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <HeroGrid />

      {/* Separator */}
      <Separator className="my-12" />

      {/* Features Section */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Why Use Study Archive?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-card p-6 rounded-lg shadow-sm border transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}