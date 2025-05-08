// UploadButton.tsx
"use client"

import React from 'react'
import { Button } from './ui/button'
import { FiUpload } from 'react-icons/fi'
import { CldUploadButton } from 'next-cloudinary'
import { useRouter } from 'next/navigation'

const UploadButton = ({ onUpload }: { onUpload: (info: any) => void }) => {
    const router = useRouter()

    return (
        <Button asChild>
            <CldUploadButton
                onSuccess={(result: any) => {
                    onUpload(result.info) // Pass Cloudinary info to parent
                    setTimeout(() => router.refresh(), 1000)
                }}
                options={{
                    sources: ['local', 'google_drive'],
                    clientAllowedFormats: ['pdf'],
                    maxFileSize: 10485760
                }}
                uploadPreset="biomed"
            >
                <div className="flex gap-2">
                    <FiUpload className="w-5 h-5" />
                    Upload
                </div>
            </CldUploadButton>
        </Button>
    )
}

export default UploadButton