import UploadForm from '@/components/upload/UploadForm';
import { Metadata } from 'next';
import React from 'react'

/**
 * Metadata for the Upload page
 * - Sets the browser tab title to "Upload | SAMS"
 * - Provides SEO description for search engines
 */
export const metadata: Metadata = {
  title: "Upload | SAMS",
  description: "A document sharing platform with community discussions",
};

/**
 * Upload Page Component
 * 
 * This page provides the interface for users to upload documents to the platform.
 * It renders the UploadForm component within a centered container layout.
 * 
 * Features:
 * - Responsive container with max-width constraint
 * - Consistent padding and spacing
 * - Wraps the UploadForm component
 */
const UploadPage = () => {
    return (
        // Main container with responsive padding and centering
        <div className="container mx-auto py-8">
            {/* Constrains content width for better readability on large screens */}
            <div className="max-w-2xl mx-auto">
                {/* The actual upload form component */}
                <UploadForm />
            </div>
        </div>
    )
}

export default UploadPage