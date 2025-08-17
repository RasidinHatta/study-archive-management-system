"use client"

import React, { useEffect, useState } from "react"
import { FileText } from "lucide-react" // document icon

interface DocumentViewerProps {
  pdfPath: string
  /**
   * Optional callback fired when the internal loading state changes.
   * Useful to sync other UI (e.g., avatar skeleton) with the viewer.
   */
  onLoadingChange?: (isLoading: boolean) => void
}

/**
 * DocumentViewer Component
 *
 * Displays a PDF inside an iframe with a document-style skeleton while loading.
 * Uses shadcn theme tokens (CSS variables) instead of hard-coded color classes.
 */
const DocumentViewer: React.FC<DocumentViewerProps> = ({ pdfPath, onLoadingChange }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // keep parent in sync if callback provided
  useEffect(() => {
    onLoadingChange?.(loading)
  }, [loading, onLoadingChange])

  useEffect(() => {
    if (pdfPath) {
      setPdfUrl(pdfPath)
      // new pdf -> go back to loading
      setLoading(true)
    } else {
      setPdfUrl(null)
      setLoading(false)
    }
  }, [pdfPath])

  return (
    <div className="pdf-viewer-container mt-4">
      {loading && (
        <div className="flex flex-col items-center justify-center space-y-4 border border-border rounded-md h-[600px]">
          {/* Document Icon */}
          <FileText className="w-12 h-12 text-muted-foreground" />

          {/* Loading text (centered) */}
          <p className="text-sm text-muted-foreground text-center">Document Loading...</p>
        </div>
      )}

      {pdfUrl && (
        <iframe
          src={pdfUrl}
          title="PDF Preview"
          width="100%"
          height="600px"
          className={`mt-4 border border-border rounded-md ${loading ? "hidden" : "block"}`}
          aria-label="PDF document preview"
          loading="eager"
          onLoad={() => setLoading(false)} // stop skeleton once iframe loads
        />
      )}
    </div>
  )
}

export default DocumentViewer