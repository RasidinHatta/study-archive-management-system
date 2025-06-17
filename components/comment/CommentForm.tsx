"use client";

import { useState, useRef } from "react";
import MDEditor, { commands, ICommand } from "@uiw/react-md-editor";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentSchema } from "@/lib/schemas";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createComment } from "@/actions/comment";
import { Button } from "../ui/button";

type CommentFormProps = {
  user: {
    name?: string | null;
    image?: string | null;
  };
  documentId: string;
  parentId?: string;
  mainId?: string;
  onSuccess?: () => void;
};

const CommentForm = ({
  user,
  documentId,
  parentId,
  mainId,
  onSuccess,
}: CommentFormProps) => {
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      content: "",
      documentId,
      parentId,
      mainId: parentId ? mainId : undefined,
    },
  });

  const onSubmit = async () => {
    setLoading(true);
    try {
      const res = await createComment({
        content: form.watch("content"),
        documentId,
        parentId,
        mainId: parentId ? mainId : undefined
      });

      if (res.success) {
        toast.success(res.success);
        form.reset();
        setCharCount(0);
        onSuccess?.();
        router.refresh();
      } else if (res.error) {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  const customTableCommand: ICommand = {
    name: "table",
    keyCommand: "table",
    buttonProps: { "aria-label": "Insert table" },
    icon: (
      <svg width="12" height="12" viewBox="0 0 520 520">
        {/* Table icon SVG */}
        <path
          fill="currentColor"
          d="M40 64C17.9 64 0 81.9 0 104V408c0 22.1 17.9 40 40 40H424c22.1 0 40-17.9 40-40V104c0-22.1-17.9-40-40-40H40zM184 360H72V312h112v48zm0-80H72V232h112v48zm0-80H72V152h112v48zm144 160H216V312h112v48zm0-80H216V232h112v48zm0-80H216V152h112v48zm64 160H360V312h112v48zm0-80H360V232h112v48zm0-80H360V152h112v48z"
        />
      </svg>
    ),
    execute: (state, api) => {
      // Prompt for rows and columns with proper type handling
      const rowsInput = prompt("Enter number of rows (1-10):", "3") || "3";
      const colsInput = prompt("Enter number of columns (1-10):", "3") || "3";

      // Parse inputs to numbers
      const rows = parseInt(rowsInput, 10);
      const cols = parseInt(colsInput, 10);

      // Limit to reasonable values with fallback to 3 if parsing fails
      const sanitizedRows = isNaN(rows) ? 3 : Math.min(Math.max(rows, 1), 10);
      const sanitizedCols = isNaN(cols) ? 3 : Math.min(Math.max(cols, 1), 10);

      // Generate table markdown
      let tableMd = "";

      // Header row
      tableMd += "|";
      for (let i = 0; i < sanitizedCols; i++) {
        tableMd += ` Header |`;
      }
      tableMd += "\n";

      // Separator row
      tableMd += "|";
      for (let i = 0; i < sanitizedCols; i++) {
        tableMd += `--------|`;
      }
      tableMd += "\n";

      // Data rows
      for (let i = 0; i < sanitizedRows; i++) {
        tableMd += "|";
        for (let j = 0; j < sanitizedCols; j++) {
          tableMd += ` Cell   |`;
        }
        tableMd += "\n";
      }

      // Insert the table at cursor position
      api.replaceSelection(tableMd);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-3">
      <Avatar className="w-10 h-10 rounded-full">
        <AvatarImage src={user?.image || ""} />
        <AvatarFallback className="rounded-full">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 flex flex-col gap-2">
        <div className="relative" ref={editorRef}>
          <MDEditor
            value={form.watch("content")}
            onChange={(val: string | undefined) => {
              form.setValue("content", val || "");
              setCharCount(val?.length || 0);
            }}
            height={150}
            preview="live"
            textareaProps={{
              placeholder: "Add a comment...",
            }}
            commands={[
              commands.bold,
              commands.italic,
              commands.strikethrough,
              commands.divider,
              commands.link,
              commands.divider,
              commands.code,
              commands.codeBlock,
              commands.divider,
              commands.orderedListCommand,
              commands.unorderedListCommand,
              commands.checkedListCommand,
              commands.divider,
              commands.quote,
              customTableCommand, // Use our custom table command instead of commands.table
              commands.divider,
              commands.title
            ]}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {charCount}/1000 characters
          </span>
          <Button
            type="submit"
            size="sm"
            disabled={loading || !form.watch("content").trim()}
            className="rounded-md px-4 h-10 text-secondary"
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;