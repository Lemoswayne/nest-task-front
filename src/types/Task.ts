export interface Task {
  id: string;
  title: string;
  description?: string;
  boardId: string;
  status: string;
  order: number;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}