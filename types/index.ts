export interface User {
  name?: string | null;
  image?: string | null;
}

export interface CommentType {
  id: string;
  content: string;
  user?: User | null;
  replies?: CommentType[];
  createdAt: Date;
  parentId?: string | null;
  parent?: CommentType;
}