export type TaskStatus = "pending" | "in_progress" | "done";

export interface Task {
  id: string; // uuid
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  isImportant?: boolean;
}
