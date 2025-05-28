"use client";

import React from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import CommentsEmpty from "../empty-states/CommentsEmpty";
import { buildCommentTree } from "@/lib/buildCommentTree";
import { CommentType, User } from "@/types";

interface CommentSectionProps {
  documentId: string;
  user: User | null;
  comments: CommentType[];
}

const CommentSection: React.FC<CommentSectionProps> = ({
  documentId,
  user,
  comments,
}) => {
  const nestedComments = buildCommentTree(comments);

  return (
    <div className="w-full mx-auto mt-10 bg-white dark:bg-zinc-900 rounded-xl shadow-md flex flex-col">
      <div className="px-4 py-3 border-b text-center font-semibold text-lg">
        Comments
      </div>
      <div className="max-h-[60vh] overflow-y-auto px-4 py-4 space-y-4">
        {nestedComments.length === 0 ? (
          <CommentsEmpty />
        ) : (
          <div className="space-y-4"> {/* Added container for consistent spacing */}
            {nestedComments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                documentId={documentId}
                user={user}
                isReply={false} // Root comments have no spacing
              />
            ))}
          </div>
        )}
      </div>
      <div className="border-t px-4 py-3">
        <CommentForm
          user={user || { name: "Anonymous", image: null }}
          documentId={documentId}
        />
      </div>
    </div>
  );
};

export default CommentSection;