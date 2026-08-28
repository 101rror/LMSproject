export interface Lesson {
  id: number;
  documentId?: string;
  title: string;
  content?: string;
  video_url?: string;
  order?: number;
  course?: {
    id: number;
    documentId?: string;
    title: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  id: number;
  documentId?: string;
  title: string;
  description: string;
  short_description?: string;
  thumbnail_url?: string;
  price?: number;
  instructor?: {
    id: number;
    documentId?: string;
    username: string;
    email: string;
  };
  lessons?: Lesson[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseFormData {
  title: string;
  description: string;
  short_description?: string;
  thumbnail_url?: string;
  price?: number;
}
