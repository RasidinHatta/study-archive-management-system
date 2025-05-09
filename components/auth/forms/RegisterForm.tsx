"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { register } from "@/actions/register";
import { RegisterSchema } from "@/lib/schemas";
import CardWrapper from "../CardWrapper";
import { FormSuccess } from "../FormSuccess";
import { FormError } from "../FormError";
import GoogleButton from "../GoogleButton";

const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score += 20;
  if (/[a-z]/.test(password)) score += 20;
  if (/[A-Z]/.test(password)) score += 20;
  if (/\d/.test(password)) score += 20;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;

  let label = "Weak";
  let color = "bg-red-500";

  if (score >= 60 && score < 80) {
    label = "Medium";
    color = "bg-yellow-500";
  } else if (score >= 80) {
    label = "Strong";
    color = "bg-green-500";
  }

  return { label, color, score };
};


const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setLoading(true);
    register(data).then((res) => {
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
      headerLabel="Create an account"
      title="Register"
      backButtonHref="/login"
      backButtonLabel="Already have an account"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="johndoe@email.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                const { label, color, score } = getPasswordStrength(passwordInput);

                return (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="********"
                        type="password"
                        onChange={(e) => {
                          field.onChange(e);
                          setPasswordInput(e.target.value);
                        }}
                      />
                    </FormControl>

                    {passwordInput && (
                      <div className="mt-2">
                        <div className="h-2 w-full bg-gray-200 rounded">
                          <div
                            className={`h-full ${color} rounded transition-all duration-300`}
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                        <p className={`text-sm mt-1 ${color.replace("bg-", "text-")}`}>
                          Strength: {label}
                        </p>
                      </div>
                    )}

                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="******" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={success} />
          <FormError message={error} />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : "Register"}
          </Button>
        </form>
      </Form>
      <GoogleButton />
    </CardWrapper>
  );
};

export default RegisterForm;