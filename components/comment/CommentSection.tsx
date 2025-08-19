"use client";

import React, { useState, useCallback } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import CommentsEmpty from "../empty-states/CommentsEmpty";
import { buildCommentTree } from "@/lib/buildCommentTree";
import { CommentType, User } from "@/types";
import { Button } from "../ui/button";

interface CommentSectionProps {
  documentId: string;
  user: User | null;
  comments: CommentType[];
}

interface ReplyState {
  parentId: string;
  mainId: string;
  replyingTo: string; // Name of the user being replied to
}

const CommentSection: React.FC<CommentSectionProps> = ({
  documentId,
  user,
  comments,
}) => {
  const [replyState, setReplyState] = useState<ReplyState | null>(null);
  const nestedComments = buildCommentTree(comments);

  const handleStartReply = useCallback((parentId: string, mainId: string, replyingTo: string) => {
    setReplyState({ parentId, mainId, replyingTo });
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyState(null);
  }, []);

  const handleSuccess = useCallback(() => {
    setReplyState(null);
  }, []);

  return (
    <div className="w-full mx-auto mt-10 bg-white dark:bg-zinc-900 rounded-xl shadow-md flex flex-col">
      <div className="px-4 py-3 border-b text-center font-semibold text-lg">
        Comments
      </div>
      <div className="max-h-[60vh] overflow-y-auto px-4 py-4 space-y-4">
        {nestedComments.length === 0 ? (
          <CommentsEmpty />
        ) : (
          <div className="space-y-4">
            {nestedComments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                documentId={documentId}
                user={user}
                isReply={false}
                onStartReply={handleStartReply}
                isReplying={replyState?.parentId === comment.id}
              />
            ))}
          </div>
        )}
      </div>
      <div className="border-t px-4 py-3">
        {replyState ? (
          <div className="mb-4 p-3 bg-muted/30 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-muted-foreground">
                Replying to {replyState.replyingTo}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelReply}
                className="text-xs h-6 px-2"
              >
                Cancel
              </Button>
            </div>
            <CommentForm
              user={user || { name: "Anonymous", image: null }}
              documentId={documentId}
              parentId={replyState.parentId}
              mainId={replyState.mainId}
              onSuccess={handleSuccess}
              onCancel={handleCancelReply}
            />
          </div>
        ) : (
          <CommentForm
            user={user || { name: "Anonymous", image: null }}
            documentId={documentId}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default CommentSection;