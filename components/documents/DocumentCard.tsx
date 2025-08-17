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
import { useState, useCallback, useEffect, useRef } from "react";
import { Skeleton } from "../ui/skeleton";
import DocumentCardHeader from "./DocumentCardHeader";

/**
 * Props interface for DocumentCard component
 */
interface DocumentCardProps {
  title: string;
  description?: string | null;
  url: string;
  author: string;
  authorImage?: string | null;
}

const AVATAR_TIMEOUT_MS = 3000; // safety fallback if avatar never loads

const DocumentCard = ({
  title,
  description,
  url,
  author,
  authorImage,
}: DocumentCardProps) => {
  // viewerLoading is true while DocumentViewer is loading the PDF
  const [viewerLoading, setViewerLoading] = useState<boolean>(true);

  // avatarStillLoading tracks the actual avatar preload state.
  // initialize to true only if there's an authorImage to load
  const [avatarStillLoading, setAvatarStillLoading] = useState<boolean>(
    !!authorImage
  );

  const timeoutRef = useRef<number | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // callback passed to DocumentViewer to sync loading state
  const handleViewerLoadingChange = useCallback((isLoading: boolean) => {
    setViewerLoading(isLoading);
  }, []);

  // Preload avatar when authorImage changes
  useEffect(() => {
    // cleanup previous
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (imgRef.current) {
      imgRef.current.onload = null;
      imgRef.current.onerror = null;
      imgRef.current = null;
    }

    if (!authorImage) {
      // no remote image -> show fallback immediately
      setAvatarStillLoading(false);
      return;
    }

    setAvatarStillLoading(true);

    const img = new Image();
    imgRef.current = img;

    // If the avatar host requires CORS, you may need to set crossOrigin:
    // img.crossOrigin = "anonymous";

    const handleLoaded = () => {
      setAvatarStillLoading(false);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const handleError = () => {
      // image failed to load -> show fallback (initial)
      setAvatarStillLoading(false);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    img.onload = handleLoaded;
    img.onerror = handleError;

    // Start loading
    img.src = authorImage;

    // Safety fallback: if image hasn't fired load/error in X ms, give up and show fallback
    timeoutRef.current = window.setTimeout(() => {
      // If still waiting, mark as not loading (show fallback)
      setAvatarStillLoading(false);
      timeoutRef.current = null;
    }, AVATAR_TIMEOUT_MS);

    // cleanup on unmount / authorImage change
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (imgRef.current) {
        imgRef.current.onload = null;
        imgRef.current.onerror = null;
        imgRef.current = null;
      }
    };
  }, [authorImage]);

  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
      link.style.display = "none";
      link.target = "_blank";
      document.body.appendChild(link);
      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      link.dispatchEvent(clickEvent);
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank");
    }
  };

  // show skeleton while either the viewer or avatar image is still loading
  const showAuthorSkeleton = viewerLoading || avatarStillLoading;

  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader>
        <DocumentCardHeader title={title} description={description ?? ""}/>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        {/* pass the loading callback to the viewer */}
        <DocumentViewer pdfPath={url} onLoadingChange={handleViewerLoadingChange} />
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-2">
          {showAuthorSkeleton ? (
            <>
              <Skeleton className="rounded-full h-6 w-6" />
              <div className="w-24">
                <Skeleton className="h-4 w-full" />
              </div>
            </>
          ) : (
            <>
              <Avatar className="h-6 w-6">
                {/* Use AvatarImage only for display — preload above handles loading logic.
                    If AvatarImage forwards onLoad/onError props, you may remove preload. */}
                <AvatarImage src={authorImage || undefined} />
                <AvatarFallback>{author.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{author}</span>
            </>
          )}
        </div>

        <Button size="sm" variant="outline" className="gap-1" onClick={handleDownload}>
          <Download className="w-4 h-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;