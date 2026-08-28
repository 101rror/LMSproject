export interface LessonProgress {
  id: number;
  documentId?: string;
  completed: boolean;
  student?: {
    id: number;
    documentId?: string;
    username: string;
  };
  lesson?: {
    id: number;
    documentId?: string;
    title: string;
  };
  course?: {
    id: number;
    documentId?: string;
    title: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
