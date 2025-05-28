import * as z from "zod";

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    name: z.string().min(1, {
        message: "Name is required",
    }),
    password: z.string()
        .min(8, {
            message: "Password must be at least 8 characters long",
        })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).+$/,
            {
                message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
            }
        ),
    passwordConfirmation: z.string().min(8, {
        message: "Password must be at least 8 characters long",
    }),
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
});


export const LoginSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
    password: z.string().min(1, {
        message: "Please enter a valid password",
    }),
    code: z.optional(z.string())
});

export const ResetPasswordSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address",
    }),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
    passwordConfirmation: z.string().min(6, {
        message: "Password must be at least 6 characters long",
    }),
});

export const DocumentSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
    description: z.string().optional(),
    publicId: z.string().optional(),
    format: z.string().optional(),
    resourceType: z.string().optional(),
});


export const UserImageSchema = z.object({
    publicId: z.string().min(1, {
        message: "Public ID is required",
    }),
    format: z.string()
})

export const CommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
  documentId: z.string(),
  parentId: z.string().optional(),
  mainId: z.string().optional(), // Add mainId to the schema
});

export const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  twoFactorEnabled: z.boolean(),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine(data => {
  // Only validate passwords if any password field is filled
  if (data.newPassword || data.currentPassword || data.confirmPassword) {
    return data.newPassword === data.confirmPassword;
  }
  return true;
}, {
  message: "New passwords don't match",
  path: ["confirmPassword"],
});
