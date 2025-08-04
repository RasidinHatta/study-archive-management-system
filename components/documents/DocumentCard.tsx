"use client"

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import DocumentViewer from "./DocumentViewer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

/**
 * Props interface for DocumentCard component
 * @property title - Document title
 * @property description - Optional document description
 * @property url - URL to the document file
 * @property author - Name of the document author
 * @property authorImage - Optional URL to the author's avatar image
 */
interface DocumentCardProps {
    title: string;
    description?: string | null;
    url: string;
    author: string;
    authorImage?: string | null;
}

/**
 * DocumentCard Component
 * 
 * A reusable card component that displays document information with:
 * - Document preview
 * - Author information
 * - Download functionality
 * 
 * Features:
 * - PDF viewer integration
 * - Graceful fallbacks for missing descriptions/avatars
 * - Cross-browser download handling
 * - Responsive design
 */
const DocumentCard = ({
    title,
    description,
    url,
    author,
    authorImage,
}: DocumentCardProps) => {
    /**
     * Handles document download with proper browser compatibility
     * Falls back to opening in new tab if direct download fails
     */
    const handleDownload = async () => {
        try {
            // Fetch the document as a blob
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            // Create invisible download link
            const link = document.createElement('a');
            link.href = blobUrl;
            // Sanitize filename and force PDF extension
            link.download = `${title.replace(/[^a-z0-9]/gi, '_')}.pdf`;

            // These additional steps help trigger the dialog in more browsers
            link.style.display = 'none';
            link.target = '_blank';
            document.body.appendChild(link);

            // Simulate click with custom event (helps in some browsers)
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            link.dispatchEvent(clickEvent);

            // Cleanup DOM and memory
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
            }, 100);

        } catch (error) {
            console.error('Download failed:', error);
            // Fallback to opening in new tab if download fails
            window.open(url, '_blank');
        }
    };

    return (
        <Card className="hover:shadow-lg transition-shadow flex flex-col">
            {/* Card Header with title and description */}
            <CardHeader>
                <CardTitle className="truncate">{title}</CardTitle>
                <CardDescription className="line-clamp-2">
                    {description || "No description provided."}
                </CardDescription>
            </CardHeader>

            {/* Document preview area */}
            <CardContent className="p-0 flex-1">
                <DocumentViewer pdfPath={url} />
            </CardContent>

            {/* Footer with author info and download button */}
            <CardFooter className="flex items-center justify-between pt-4">
                {/* Author information with avatar */}
                <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={authorImage || undefined} />
                        <AvatarFallback>{author.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{author}</span>
                </div>

                {/* Download button */}
                <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    onClick={handleDownload}
                >
                    <Download className="w-4 h-4" />
                    Download
                </Button>
            </CardFooter>
        </Card>
    );
};

export default DocumentCard;