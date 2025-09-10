"use client";

import { useState } from "react"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { register } from "@/actions/register"
import { RegisterSchema } from "@/lib/schemas"
import GoogleButton from "../GoogleButton"
import { toast } from "sonner"
import AuthCardWrapper from "../AuthCardWrapper"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { Eye, EyeOff } from "lucide-react"

/**
 * Password strength helper
 */
const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score += 20;
  if (/[a-z]/.test(password)) score += 20;
  if (/[A-Z]/.test(password)) score += 20;
  if (/\d/.test(password)) score += 20;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;

  let label = "Weak";
  if (score >= 60 && score < 80) label = "Medium"
  else if (score >= 80) label = "Strong"

  return { label, score }
}

const RegisterForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const [loading, setLoading] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [activeTab, setActiveTab] = useState("account") // track active tab
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)


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
    setLoading(true)
    register(data).then((res) => {
      if (res.error) {
        toast.error(res.error, { duration: 5000 })
      } else if (res.success) {
        toast.success(res.success, { duration: 3000 })
      }
      setLoading(false)
    });
  };

  const { label, score } = getPasswordStrength(passwordInput)

  return (
    <AuthCardWrapper
      agreement
      headerLabel="Getting Started"
      description="Create an account"
      label="Sign In"
      href="/login"
      question="Already have an account?"
    >
      <div className={cn("flex flex-col justify-center p-6", className)} {...props}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Tabs for form sections */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>

              {/* Account Info Tab */}
              <TabsContent value="account" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="johndoe@email.com" type="email" />
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
              </TabsContent>

              {/* Password Tab */}
              <TabsContent value="password" className="space-y-4 mt-4">
                {/* Password Field */}
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
                            placeholder="********"
                            type={showPassword ? "text" : "password"}
                            onChange={(e) => {
                              field.onChange(e);
                              setPasswordInput(e.target.value);
                            }}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>

                      {passwordInput && (
                        <div className="mt-2 space-y-2">
                          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${score < 40 ? "bg-red-500" :
                                score < 70 ? "bg-yellow-500" : "bg-green-500"
                                }`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <p className={`text-xs ${score < 40 ? "text-red-500" :
                            score < 70 ? "text-yellow-500" : "text-green-500"
                            }`}>
                            Strength: {label}
                          </p>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="passwordConfirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="******"
                            type={showConfirmPassword ? "text" : "password"}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            {/* Button: Next on Account, Register on Password */}
            {activeTab === "account" ? (
              <Button
                type="button"
                className="w-full text-background"
                onClick={() => setActiveTab("password")}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" className="w-full text-background" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>
            )}
          </form>
        </Form>

        <div className="mt-6 space-y-6">
          <div className="relative text-center text-sm">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <span className="bg-card relative z-10 px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <GoogleButton />
        </div>
      </div>
    </AuthCardWrapper>
  );
};

export default RegisterForm;