"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CommunityPage from "./CommunityPage";

/**
 * CommunitySection Component
 * 
 * A client-side component that fetches and manages community documents data.
 * Handles search functionality by observing URL search parameters.
 * 
 * Features:
 * - Fetches documents from API based on search query
 * - Automatically refetches when search query changes
 * - Passes fetched data to the CommunityPage component
 */
export default function CommunitySection() {
    // Get search parameters from URL
    const searchParams = useSearchParams();
    // Extract search query or default to empty string
    const query = searchParams.get("q") || "";
    
    // State for storing fetched documents
    const [documents, setDocuments] = useState([]);

    /**
     * Effect hook to fetch documents when query changes
     * Runs whenever the 'query' value changes
     */
    useEffect(() => {
        /**
         * Fetches documents from API
         * Includes search query if present
         */
        async function fetchDocuments() {
            // Construct API URL with query parameter if it exists
            const url = query 
                ? `/api/community-documents?q=${encodeURIComponent(query)}` 
                : "/api/community-documents";
            
            try {
                const res = await fetch(url);
                
                // Check if response is successful
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                
                const data = await res.json();
                setDocuments(data);
            } catch (error) {
                console.error("Failed to fetch documents:", error);
                // Consider setting an error state here for UI feedback
                setDocuments([]);
            }
        }

        fetchDocuments();
    }, [query]); // Dependency array ensures refetch when query changes

    /**
     * Render CommunityPage component with fetched documents
     * Acts as a data provider for the presentation component
     */
    return <CommunityPage documents={documents} />;
}