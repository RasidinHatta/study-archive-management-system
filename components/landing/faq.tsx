import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Divider from "./divider"

const faqs = [
  {
    question: "Is StudyArchive free to use?",
    answer: "Yes, StudyArchive offers a free plan with access to all core features.",
  },
  {
    question: "What file types does StudyArchive support?",
    answer: "StudyArchive supports PDFs, DOCX, PPT, images, and many other common document formats.",
  },
  {
    question: "Can I collaborate with others on documents?",
    answer: "Yes, you can share documents with specific people or teams and collaborate in real-time.",
  },
  {
    question: "How do I organize my documents?",
    answer: "You can use tags, folders, and our smart search to keep your documents organized.",
  },
  {
    question: "Is my data secure with StudyArchive?",
    answer: "Yes, we use industry-standard encryption and security practices to protect your data.",
  },
  {
    question: "Does StudyArchive work on mobile devices?",
    answer: "Yes, our responsive design works on all devices including smartphones and tablets.",
  },
]

export function FAQ() {
  return (
    <section className="bg-background relative w-full px-8 py-24">
      <Divider />
      <h2 className="text-center text-3xl font-bold text-foreground mb-16">
        Frequently Asked Questions
      </h2>
      <div className="mx-auto max-w-3xl space-y-6">
        {faqs.map((faq) => (
          <Card key={faq.question} className="group border-border bg-card hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300">
                {faq.question}
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                {faq.answer}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}