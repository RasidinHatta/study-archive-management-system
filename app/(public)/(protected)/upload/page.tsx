import UploadForm from '@/components/UploadForm'
import React from 'react'

const UploadPage = () => {
    return (
        <div className="container mx-auto py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Upload Document</h1>
                <p className="text-muted-foreground mb-8">
                    Share your document with the community
                </p>
                <UploadForm />
            </div>
        </div>
    )
}

export default UploadPage