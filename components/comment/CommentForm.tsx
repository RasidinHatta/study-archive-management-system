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

/**
 * Props for the CommentForm component
 * @property user - Current user information (name and image)
 * @property documentId - ID of the document being commented on
 * @property parentId - Optional parent comment ID for replies
 * @property mainId - Optional main comment ID for nested replies
 * @property onSuccess - Callback function to execute after successful comment submission
 * @property onCancel - Optional callback function to execute when cancel is clicked
 */
type CommentFormProps = {
  user: {
    id?: string | null;
    name?: string | null;
    image?: string | null;
  };
  documentId: string;
  parentId?: string;
  mainId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

/**
 * CommentForm Component
 * 
 * A rich text comment form with markdown support that allows:
 * - Creating new comments
 * - Replying to existing comments
 * - Nested comment threads
 * 
 * Features:
 * - Markdown editor with toolbar
 * - Custom table insertion
 * - Character count limit
 * - User avatar display
 * - Loading states
 * - Cancel button for reply mode
 */
const CommentForm = ({
  user,
  documentId,
  parentId,
  mainId,
  onSuccess,
  onCancel,
}: CommentFormProps) => {
  // State for loading indicator and character count
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Ref for the editor container
  const editorRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const userId = user.id

  // Form initialization with Zod validation - add userId to default values
  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      content: "",
      documentId,
      parentId,
      mainId: parentId ? mainId : undefined,
      userId: user?.id || "", // Add userId to default values
    },
  });

  /**
   * Handles form submission
   * Creates a new comment or reply and handles the response
   */
  const onSubmit = async () => {
    // Check if user ID is available
    if (!user?.id) {
      toast.error("You must be logged in to comment");
      return;
    }

    setLoading(true);
    try {
      // Get all form values including userId
      const formData = form.getValues();

      const res = await createComment({
        userId: user.id, // Use the user.id directly
        content: formData.content,
        documentId: formData.documentId,
        parentId: formData.parentId,
        mainId: formData.mainId
      });

      if (res.success) {
        toast.success(res.success);
        form.reset(); // Clear the form
        setCharCount(0); // Reset character count
        onSuccess?.(); // Execute success callback if provided
        router.refresh(); // Refresh the page to show new comment
      } else if (res.error) {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  /**
   * Handles cancel action
   * Resets the form and calls the onCancel callback if provided
   */
  const handleCancel = () => {
    form.reset();
    setCharCount(0);
    onCancel?.();
  };

  /**
   * Custom table command for the markdown editor
   * Allows users to insert markdown tables with configurable rows/columns
   */
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
      {/* User avatar */}
      <Avatar className="w-10 h-10 rounded-full">
        <AvatarImage src={user?.image || ""} />
        <AvatarFallback className="rounded-full">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      {/* Comment input area */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="relative" ref={editorRef}>
          {/* Markdown editor */}
          <MDEditor
            value={form.watch("content")}
            onChange={(val: string | undefined) => {
              form.setValue("content", val || "");
              setCharCount(val?.length || 0);
            }}
            height={150}
            preview="live" // Live preview mode
            textareaProps={{
              placeholder: "Add a comment...",
            }}
            // Configured toolbar commands
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
              customTableCommand, // Custom table command
              commands.divider,
              commands.title
            ]}
          />
        </div>

        {/* Footer with character count and action buttons */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {charCount}/1000 characters
          </span>
          <div className="flex gap-2">
            {/* Cancel button (only shown when onCancel is provided) */}
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={loading}
                className="rounded-md px-4 h-10"
              >
                Cancel
              </Button>
            )}
            {/* Submit button */}
            <Button
              type="submit"
              size="sm"
              disabled={loading || !form.watch("content").trim() || !user?.id}
              className="rounded-md px-4 h-10 text-secondary"
            >
              {loading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;