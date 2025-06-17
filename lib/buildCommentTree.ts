import { CommentType } from "@/types";

export function buildCommentTree(flatComments: CommentType[]): CommentType[] {
  const commentMap = new Map<string, CommentType & { replies: CommentType[] }>();

  flatComments.forEach((comment) => {
    commentMap.set(comment.id, { 
      ...comment, 
      replies: [],
      mainId: comment.mainId || null,
      parentId: comment.parentId || null
    });
  });

  const rootComments: CommentType[] = [];

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

  // Sort comments NEWEST FIRST (descending order)
  const sortComments = (comments: CommentType[]): CommentType[] => {
    return comments
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((comment) => ({
        ...comment,
        replies: sortComments(comment.replies || []),
        mainId: comment.mainId || null,
        parentId: comment.parentId || null
      }));
  };

  return sortComments(rootComments);
}