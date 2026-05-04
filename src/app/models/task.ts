import { NewSubtaskInput, Subtask } from './subtask';
import { Contact } from './contact';

export type TaskPriority = 'urgent' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'awaiting_feedback' | 'done';
export type TaskCategory = 'technical_task' | 'user_story';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface TaskDetails extends Task {
  assignee_ids: string[];
  subtasks: Subtask[];
}

export interface BoardTask extends Task {
  assignees: Contact[];
  subtasks: Subtask[];
}

export type NewTaskInput = {
  title: string;
  description?: string;
  dueDate: string;
  priority: TaskPriority;
  category: TaskCategory;
  status?: TaskStatus;
  assigneeIds: string[];
  subtasks: NewSubtaskInput[];
};

export type UpdateTaskInput = Partial<NewTaskInput>;
