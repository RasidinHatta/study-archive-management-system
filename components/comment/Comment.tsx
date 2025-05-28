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
  isReply?: boolean; // Changed from depth to simple isReply flag
  replyChain?: string[];
}

const Comment: React.FC<CommentProps> = ({
  comment,
  documentId,
  user,
  isReply = false,
  replyChain = [],
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

  // Add current comment's author to the reply chain if it's a reply
  const newReplyChain = comment.parentId 
    ? [...replyChain, comment.user?.name || "Anonymous"]
    : [];

  return (
    <div className={`flex gap-3 ${isReply ? "ml-6 mt-3" : ""}`}> {/* Fixed spacing for all replies */}
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
              {isReply && replyChain.length > 0 && ( // Changed from depth to isReply
                <span className="text-xs text-muted-foreground ml-2">
                  → {replyChain.join(" → ")}
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
              mainId={comment.mainId || comment.id}
              onSuccess={handleSuccess}
            />
          </div>
        )}
        {Array.isArray(comment.replies) && comment.replies.length > 0 && (
          <div className="space-y-3"> {/* Removed mt-3 here to make spacing consistent */}
            {comment.replies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                documentId={documentId}
                user={user}
                isReply={true} // All replies will have the same spacing
                replyChain={newReplyChain}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Comment);