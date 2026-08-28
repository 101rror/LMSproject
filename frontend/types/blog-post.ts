export interface BlogPost {
  id: number;
  documentId?: string;
  title: string;
  body: string;
  cover_image_url?: string;
  publishedAt: string | null;
  status?: 'draft' | 'published';
  author?: {
    id: number;
    documentId?: string;
    username: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPostFormData {
  title: string;
  body: string;
  cover_image_url?: string;
}
