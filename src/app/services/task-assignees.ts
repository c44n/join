import { Injectable } from '@angular/core';
import { TaskAssignee } from '../models/task-assignee';
import { SupabaseService } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class TaskAssigneesService {
  constructor(private supabaseService: SupabaseService) {}

  async getAssigneeIds(taskId: string): Promise<string[]> {
    const { data, error } = await this.supabaseService.supabase
      .from('task_assignees')
      .select('contact_id')
      .eq('task_id', taskId);

    if (error) {
      console.error('Error fetching task assignees:', error);
      throw new Error(error.message || 'Unknown Supabase error');
    }

    return (data ?? []).map((row) => row.contact_id);
  }

  async getAssignments(taskId: string): Promise<TaskAssignee[]> {
    const { data, error } = await this.supabaseService.supabase
      .from('task_assignees')
      .select('*')
      .eq('task_id', taskId);

    if (error) {
      console.error('Error fetching assignments:', error);
      throw new Error(error.message || 'Unknown Supabase error');
    }

    return (data ?? []) as TaskAssignee[];
  }

  async replaceAssignees(taskId: string, contactIds: string[]): Promise<void> {
    await this.deleteAssignees(taskId);

    if (!contactIds.length) {
      return;
    }

    const rows = contactIds.map((contactId) => ({
      task_id: taskId,
      contact_id: contactId,
    }));
    const { error } = await this.supabaseService.supabase.from('task_assignees').insert(rows);

    if (error) {
      console.error('Error saving task assignees:', error);
      throw new Error(error.message || 'Unknown Supabase error');
    }
  }

  private async deleteAssignees(taskId: string): Promise<void> {
    const { error } = await this.supabaseService.supabase
      .from('task_assignees')
      .delete()
      .eq('task_id', taskId);

    if (error) {
      console.error('Error deleting task assignees:', error);
      throw new Error(error.message || 'Unknown Supabase error');
    }
  }
}
