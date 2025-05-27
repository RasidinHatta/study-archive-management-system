"use client"

import React, { useState } from 'react'
import { userImageUpload } from '@/actions/image';
import ChangeUserImage from './ChangeUserImage';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const ChangeImageForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleImageUpload = async (info: any) => {
        if (!info?.public_id || !info?.format) {
            setError("Invalid image data received");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const result = await userImageUpload({
                publicId: info.public_id,
                format: info.format
            });

            if (result?.error) {
                toast.error(result.error, {
                    duration: 5000
                })
            } else if (result?.success) {
                toast.success(result.success, {
                    duration: 3000
                })
                router.refresh();
            }
        } catch (err) {
            setError("Failed to process image upload");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <ChangeUserImage
                onUpload={handleImageUpload}
                disabled={loading}
            />
            {loading && <p className="text-sm text-muted-foreground">Processing image...</p>}
        </div>
    )
}

export default ChangeImageForm