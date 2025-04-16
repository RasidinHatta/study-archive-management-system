import DocumentCard from '@/components/DocumentCard'
import Comment from '@/components/Comment'
import React from 'react'
import CommentForm from '@/components/CommentForm'

const DocumentPage = () => {
    const mockComments = Array(3).fill(0);

    return (
        <div className="container mx-auto py-8 space-y-8">
            <DocumentCard />

            <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Discussion</h2>
                <CommentForm />

                <div className="space-y-6">
                    {mockComments.map((_, index) => (
                        <Comment key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DocumentPage