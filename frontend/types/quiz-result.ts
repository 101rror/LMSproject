export interface QuizResult {
  id: number;
  documentId?: string;
  score: number;
  total_questions: number;
  student?: {
    id: number;
    documentId?: string;
    username: string;
  };
  quiz?: {
    id: number;
    documentId?: string;
    title: string;
    course?: {
      id: number;
      documentId?: string;
      title: string;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}
