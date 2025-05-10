"use client"

import React from 'react'
import { Button } from '../ui/button'
import { CldUploadButton } from 'next-cloudinary'
import { FiUpload } from 'react-icons/fi'
import { useRouter } from 'next/navigation'


const ChangeUserImage = ({ onUpload }: { onUpload: (info: any) => void }) => {
    const router = useRouter()
    return (
        <Button asChild>
            <CldUploadButton
                onSuccess={(result: any) => {
                    onUpload(result.info) // Pass Cloudinary info to parent
                    setTimeout(() => router.refresh(), 1000)
                    console.log(result)
                }}
                options={{
                    clientAllowedFormats: ['png', 'jpg', 'jpeg'],
                    maxFileSize: 5242880, // 5MB
                    multiple: false,
                    cropping: true,           // ✅ Enable cropping UI
                    croppingAspectRatio: 1.0, // ✅ Enforce 1:1 ratio
                    croppingShowBackButton: true,
                    showSkipCropButton: false, // ✅ Force cropping step
                }}
                uploadPreset="sams-image"
            >
                <div className="flex gap-2">
                    <FiUpload className="w-5 h-5" />
                    Upload Image
                </div>
            </CldUploadButton>
        </Button>
    )
}

export default ChangeUserImage