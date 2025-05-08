"use client"

import { useForm } from 'react-hook-form'
import CardWrapper from './auth/CardWrapper'
import { Button } from './ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { DocumentSchema } from '@/lib/schemas'
import { useState } from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { FormSuccess } from './auth/FormSuccess'
import { FormError } from './auth/FormError'
import { documentUpload } from '@/actions/document'
import UploadButton from './UploadButton'

const UploadForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const form = useForm<z.infer<typeof DocumentSchema>>({
        resolver: zodResolver(DocumentSchema),
        defaultValues: {
            title: "",
            description: "",
            publicId: "",
            format: "",
            resourceType: ""
        },
    });

    const onSubmit = async (data: z.infer<typeof DocumentSchema>) => {
        setLoading(true);
        documentUpload(data).then((res) => {
            if (res.error) {
                setError(res.error);
                setLoading(false);
            }
            if (res.success) {
                setError("");
                setSuccess(res.success);
                setLoading(false);
            }
        });
    };

    return (
        <CardWrapper
            headerLabel="Document Uploader"
            title="Upload Document"
            backButtonHref="/home"
            backButtonLabel="Back to Home Page"
            showSocial={false}
            className="w-full"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <UploadButton
                        onUpload={(info) => {
                            form.setValue("publicId", info.public_id || "");
                            form.setValue("format", info.format || "");
                            form.setValue("resourceType", info.resource_type || "");
                        }}
                    />
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Document's title" type="text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Brief description" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormSuccess message={success} />
                    <FormError message={error} />
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Uploading..." : "Upload"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}

export default UploadForm;
