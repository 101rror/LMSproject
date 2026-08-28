export interface Enrollment {
  id: number;
  documentId?: string;
  student?: {
    id: number;
    documentId?: string;
    username: string;
    email: string;
  };
  course?: {
    id: number;
    documentId?: string;
    title: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
