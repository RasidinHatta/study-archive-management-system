export interface User {
  name?: string | null;
  image?: string | null;
}

export interface CommentType {
  id: string;
  content: string;
  userId: string;
  documentId: string;
  parentId?: string | null;
  mainId?: string | null; // Make sure this is string | null or string | undefined
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: User;
  parent?: CommentType | null;
  replies?: CommentType[];
}