"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import CardWrapper from "../CardWrapper";
import { NewPasswordSchema } from "@/lib/schemas";
import { resetPassword } from "@/actions/password";

const ResetPasswordForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
            passwordConfirmation: "",
        },
    });

    const onSubmit = useCallback((formData: z.infer<typeof NewPasswordSchema>) => {
        if (success || error) {
            return;
        }

        if (!token) {
            setError("No token provided");
            return;
        }

        setLoading(true);

        resetPassword({ ...formData, token })  // Pass token along with form data
            .then((data) => {
                if (data.success) {
                    setSuccess(data.success);
                    setError(""); // Clear previous error
                } else if (data.error) {
                    setError(data.error);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setError("An unexpected error occurred");
                setLoading(false);
            });
    }, [token, success, error]);

    return (
        <CardWrapper
            headerLabel="Choose a new password"
            title="Reset Password"
            backButtonHref="/login"
            backButtonLabel="Back to login"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="********" type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="passwordConfirmation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="********" type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormSuccess message={success} />
                    <FormError message={error} />
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Reseting..." : "Reset Password"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
};

export default ResetPasswordForm;
