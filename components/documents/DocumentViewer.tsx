"use client"

import React, { useEffect, useState } from 'react';

/**
 * Props interface for DocumentViewer component
 * @property pdfPath - URL or path to the PDF file to be displayed
 */
interface DocumentViewerProps {
    pdfPath: string;
}

/**
 * DocumentViewer Component
 * 
 * A component that renders a PDF document in an iframe for preview.
 * Handles the PDF URL state and provides a loading state while preparing the viewer.
 * 
 * Features:
 * - Displays PDFs in an embedded iframe
 * - Shows loading state while initializing
 * - Responsive width with fixed height
 * - Simple error handling (falls back to loading message)
 */
const DocumentViewer: React.FC<DocumentViewerProps> = ({ pdfPath }) => {
    // State to manage the PDF URL
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    /**
     * Effect to handle PDF URL initialization
     * Runs whenever the pdfPath prop changes
     */
    useEffect(() => {
        // Set the PDF URL from props
        // This could be extended to handle URL processing or validation
        setPdfUrl(pdfPath);
    }, [pdfPath]);

    return (
        <div className="pdf-viewer-container">
            {pdfUrl ? (
                // PDF Preview iframe
                <iframe
                    src={pdfUrl}
                    title="PDF Preview"
                    width="100%"  // Responsive width
                    height="600px" // Fixed height (consider making this configurable)
                    style={{ 
                        marginTop: '20px', 
                        border: '1px solid #ccc',
                        borderRadius: '4px' // Added for better visual appearance
                    }}
                    // Consider adding these for better accessibility:
                    aria-label="PDF document preview"
                    loading="lazy"
                />
            ) : (
                // Loading state
                <p className="pdf-loading-text">Loading PDF preview...</p>
            )}
        </div>
    );
};

export default DocumentViewer;