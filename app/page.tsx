import DocumentCard from "@/components/DocumentCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  const mockDocuments = Array(6).fill(0);

  return (
    <>
      <main className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Community Documents</h1>
            <p className="text-muted-foreground">
              Browse and discuss documents shared by the community
            </p>
          </div>
          <Button asChild>
            <Link href="/upload">Upload Document</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDocuments.map((_, index) => (
            <DocumentCard key={index} />
          ))}
        </div>
      </main>
    </>
  );
}
