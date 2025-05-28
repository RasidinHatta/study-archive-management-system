"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentSchema } from "@/lib/schemas";
import { z } from "zod";
import { useState } from "react";
import { createComment } from "@/actions/comment";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";

type CommentFormProps = {
  user: {
    name?: string | null;
    image?: string | null;
  };
  documentId: string;
  parentId?: string;
  onSuccess?: () => void;
};

const CommentForm = ({
  user,
  documentId,
  parentId,
  onSuccess,
}: CommentFormProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      content: "",
      documentId,
      parentId,
    },
  });

  const onSubmit = async (data: z.infer<typeof CommentSchema>) => {
    setLoading(true);
    const res = await createComment({ ...data, documentId, parentId });

    if (res.success) {
      toast.success(res.success);
      form.reset();
      onSuccess?.();
      router.refresh();
    } else if (res.error) {
      toast.error(res.error);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex items-end gap-3"
    >
      <Avatar className="w-8 h-8">
        <AvatarImage src={user?.image || ""} />
        <AvatarFallback>
          {user?.name?.[0]?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      <Textarea
        {...form.register("content")}
        placeholder="Add a comment..."
        rows={1}
        className="flex-1 resize-none text-sm px-3 py-2 h-10 max-h-20 rounded-full"
        disabled={loading}
      />

      <Button
        type="submit"
        size="sm"
        disabled={loading || !form.watch("content").trim()}
        className="rounded-full px-4"
      >
        {loading ? "..." : "Send"}
      </Button>
    </form>
  );
};

export default CommentForm;