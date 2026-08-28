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

export interface Quiz {
  id: number;
  documentId?: string;
  title: string;
  description?: string;
  course?: {
    id: number;
    documentId?: string;
    title: string;
  };
  quiz_questions?: QuizQuestion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizFormData {
  title: string;
  description?: string;
  course: number;
}
