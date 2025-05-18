"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CommunityPage from "./CommunityPage";

export default function CommunitySection() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        async function fetchDocuments() {
            // Pass the query as a URL param to your API route
            const url = query ? `/api/community-documents?q=${encodeURIComponent(query)}` : "/api/community-documents";
            const res = await fetch(url);
            const data = await res.json();
            setDocuments(data);
        }

        fetchDocuments();
    }, [query]); // Refetch when query changes

    return <CommunityPage documents={documents} />;
}