"use client"

import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from '@/lib/schemas'
import { adminLogin } from '@/actions/login'
import AuthCardWrapper from '../AuthCardWrapper'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Eye, EyeOff } from "lucide-react"

const AdminLoginForm = ({ className, ...props }: React.ComponentProps<"div">) => {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showTwoFactor, setShowTwoFactor] = useState(false)

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            code: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
        setLoading(true);
        adminLogin(data).then((res) => {
            if (res.error) {
                toast.error(res.error, { duration: 5000 });
                setLoading(false);
            }
            if (res.success) {
                toast.success(res.success, { duration: 3000 });
                form.reset();
                setLoading(false);
            }
            if (res.twoFactor) {
                setShowTwoFactor(true);
                setLoading(false);
            }
        });
    };

    return (
        <AuthCardWrapper admin agreement headerLabel="Welcome back, Admin" description="Login to your Study Archive account">
            <div className={cn("flex flex-col justify-center p-6", className)} {...props}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            {!showTwoFactor && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="email" placeholder="johndoe@email.com" disabled={loading} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            {...field}
                                                            placeholder="******"
                                                            type={showPassword ? "text" : "password"}
                                                            disabled={loading}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                                                            onClick={() => setShowPassword(prev => !prev)}
                                                        >
                                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            {showTwoFactor && (
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Two-Factor Code</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="123456" disabled={loading} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                        <Button type="submit" className="w-full text-background" disabled={loading}>
                            {loading
                                ? (showTwoFactor ? "Confirming..." : "Logging In...")
                                : (showTwoFactor ? "Confirm" : "Login")}
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCardWrapper>
    );
}

export default AdminLoginForm;