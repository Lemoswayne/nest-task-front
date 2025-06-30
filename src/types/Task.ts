export interface Task {
  id: string;
  title: string;
  description: string;
  boardId: string;
  order: number;
  dueDate: Date;
  completed: boolean;
  status: string;
}