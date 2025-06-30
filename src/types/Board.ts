import { Task } from './Task';

export interface Board {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
}