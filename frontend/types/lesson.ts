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

export interface LessonFormData {
  title: string;
  content?: string;
  video_url?: string;
  order?: number;
  course: number;
}
