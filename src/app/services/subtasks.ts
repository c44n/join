import { Injectable } from '@angular/core';
import { NewSubtaskInput, Subtask } from '../models/subtask';
import { SupabaseService } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class SubtasksService {
  constructor(private supabaseService: SupabaseService) {}

  async getSubtasks(taskId: string): Promise<Subtask[]> {
    const query = this.supabaseService.supabase
      .from('subtasks')
      .select('*')
      .eq('task_id', taskId)
      .order('position', { ascending: true });
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching subtasks:', error);
      throw new Error(error.message || 'Unknown Supabase error');
    }

    return (data ?? []) as Subtask[];
  }

  async replaceSubtasks(taskId: string, subtasks: NewSubtaskInput[]): Promise<void> {
    await this.deleteSubtasks(taskId);

    if (!subtasks.length) {
      return;
    }

    const rows = subtasks.map((subtask, index) => ({
      task_id: taskId,
      title: subtask.title.trim(),
      completed: subtask.completed ?? false,
      position: subtask.position ?? index,
    }));
    const { error } = await this.supabaseService.supabase.from('subtasks').insert(rows);

    if (error) {
      console.error('Error saving subtasks:', error);
      throw new Error(error.message || 'Unknown Supabase error');
    }
  }

  private async deleteSubtasks(taskId: string): Promise<void> {
    const { error } = await this.supabaseService.supabase.from('subtasks').delete().eq('task_id', taskId);

    if (error) {
      console.error('Error deleting subtasks:', error);
      throw new Error(error.message || 'Unknown Supabase error');
    }
  }
}
