import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipWrapper } from "../wrappers/TooltipWrapper";
import { CldImage } from "next-cloudinary";

interface PDFCardProps {
  id: string;
  title: string;
  description?: string | null;
  publicId?: string;
  author: string;
  authorImage?: string | null;
}

const PDFCard = ({
  id,
  title,
  description,
  publicId,
  author,
  authorImage,
}: PDFCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader>
        <CardTitle className="truncate">{title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description || "No description provided."}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 h-48 w-full relative overflow-hidden">
        {publicId && (
          <CldImage
            fill
            src={publicId}
            sizes="100vw"
            alt="Document preview"
            className="object-cover object-top"
          />
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center pt-4">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={authorImage || "https://github.com/shadcn.png"} />
            <AvatarFallback>
              {author.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{author}</span>
        </div>

        <TooltipWrapper content="View PDF document">
          <Button asChild size="sm" variant="outline">
            <Link href={`/documents/${id}`}>
              View PDF
            </Link>
          </Button>
        </TooltipWrapper>
      </CardFooter>
    </Card>
  );
};

export default PDFCard;