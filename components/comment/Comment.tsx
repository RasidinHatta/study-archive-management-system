"use client";

import React, { useState, useCallback } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import CommentForm from "./CommentForm";
import { CommentType, User } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface CommentProps {
  comment: CommentType;
  documentId: string;
  user?: User | null;
  depth?: number;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  documentId,
  user,
  depth = 0,
}) => {
  const [showReply, setShowReply] = useState(false);
  const router = useRouter();
  
  const toggleReply = useCallback(() => {
    setShowReply((prev) => !prev);
  }, []);

  const handleSuccess = useCallback(() => {
    setShowReply(false);
    router.refresh();
  }, [router]);

  return (
    <div className={`flex gap-3 ${depth > 0 ? "ml-6" : ""}`}>
      <Avatar className="w-8 h-8 mt-1">
        <AvatarImage src={comment.user?.image || undefined} />
        <AvatarFallback>
          {comment.user?.name?.charAt(0)?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">
              {comment.user?.name || "Anonymous"}
              {depth > 0 && comment.parent && (
                <span className="text-xs text-muted-foreground ml-2">
                  → {comment.parent.user?.name || "parent"}
                </span>
              )}
            </p>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">
            {comment.content}
          </p>
        </div>
        <div className="flex gap-3 mt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleReply}
            className="text-xs text-primary h-6 px-2"
            aria-expanded={showReply}
          >
            {showReply ? "Cancel" : "Reply"}
          </Button>
        </div>
        {showReply && user && (
          <div className="mt-3">
            <CommentForm
              user={user}
              documentId={documentId}
              parentId={comment.id}
              onSuccess={handleSuccess}
            />
          </div>
        )}
        {Array.isArray(comment.replies) && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                documentId={documentId}
                user={user}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Comment);