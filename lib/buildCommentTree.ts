import { CommentType } from "@/types";

export function buildCommentTree(flatComments: CommentType[]): CommentType[] {
  // Create a map with proper typing including replies
  const commentMap = new Map<string, CommentType & { replies: CommentType[] }>();

  // First pass: create map entries with empty replies array
  flatComments.forEach((comment) => {
    commentMap.set(comment.id, { 
      ...comment, 
      replies: [],
      // Ensure all necessary fields are present
      mainId: comment.mainId || null,
      parentId: comment.parentId || null
    });
  });

  const rootComments: CommentType[] = [];

  // Second pass: build the tree structure
  flatComments.forEach((comment) => {
    const currentComment = commentMap.get(comment.id);
    if (!currentComment) return;

    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies.push(currentComment);
      }
    } else {
      rootComments.push(currentComment);
    }
  });

  // Recursive sorting function with proper typing
  const sortComments = (comments: CommentType[]): CommentType[] => {
    return comments
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((comment) => ({
        ...comment,
        replies: sortComments(comment.replies || []),
        // Ensure consistent typing
        mainId: comment.mainId || null,
        parentId: comment.parentId || null
      }));
  };

  return sortComments(rootComments);
}