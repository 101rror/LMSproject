export interface QuizQuestion {
  id: number;
  documentId?: string;
  question: string;
  options: string[];
  correct_answer: number;
  quiz?: {
    id: number;
    documentId?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizQuestionFormData {
  question: string;
  options: string[];
  correct_answer: number;
  quiz: number;
}
