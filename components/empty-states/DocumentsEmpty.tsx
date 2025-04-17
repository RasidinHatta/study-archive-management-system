import { FileText } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

const DocumentEmpty = () => {
    return (
        <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">No documents yet</h3>
            <p className="mt-1 text-muted-foreground">
                Get started by uploading your first document
            </p>
            <div className="mt-6">
                <Button asChild>
                    <Link href="/upload">Upload Document</Link>
                </Button>
            </div>
        </div>
    )
}

export default DocumentEmpty