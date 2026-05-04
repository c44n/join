export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export type NewSubtaskInput = {
  title: string;
  completed?: boolean;
  position?: number;
};
