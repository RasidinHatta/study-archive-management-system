import { Package, Share, Smartphone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Upload & Organize",
    description: "Easily upload documents and manage them with tags, folders, and version history.",
    icon: Package
  },
  {
    title: "Read Anywhere",
    description: "Mobile-friendly viewer supports PDFs, DOCX, PPT, and more — no extra software needed.",
    icon: Smartphone
  },
  {
    title: "Share & Collaborate",
    description: "Control access, leave comments, and collaborate in real-time with your team or audience.",
    icon: Share
  },
];

export function Features() {
  return (
    <section className="relative px-8 py-24 bg-background">
      <div className="container mx-auto">
        <h2 className="text-center text-3xl font-bold text-foreground mb-16">
          Why Choose Study<span className="text-primary">Archive</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-foreground group-hover:bg-primary transition-colors duration-300">
                    <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl font-semibold ml-4 text-card-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}