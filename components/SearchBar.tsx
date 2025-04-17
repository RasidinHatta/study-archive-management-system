"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from './ui/button'
import { Input } from './ui/input'
import {
    Form,
    FormField,
    FormControl,
    FormItem,
} from './ui/form'

const formSchema = z.object({
    search: z.string().optional(),
})

const SearchBar = () => {
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            search: "",
        },
    })

    const query = form.watch("search")

    const onSubmit = (data: { search?: string }) => {
        if (data.search?.trim()) {
            router.push(`/search?q=${encodeURIComponent(data.search)}`)
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="relative w-full max-w-md"
            >
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <FormField
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="search"
                                    placeholder="Search documents..."
                                    className="pl-10 pr-20"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-1/2 -translate-y-1/2 h-8 px-3"
                >
                    Search
                </Button>
            </form>
        </Form>
    )
}

export default SearchBar
