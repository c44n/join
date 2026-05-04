import { Injectable } from '@angular/core';
import { Task, TaskDetails, NewTaskInput, UpdateTaskInput } from '../models/task';
import { SupabaseService } from './supabase';
import { SubtasksService } from './subtasks';
import { TaskAssigneesService } from './task-assignees';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(
    private supabaseService: SupabaseService,
    private subtasksService: SubtasksService,
    private taskAssigneesService: TaskAssigneesService,
  ) {}

  async getTasks(): Promise<Task[]> {
    const query = this.supabaseService.supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tasks:', error);
      throw new Error(error.message || 'Unknown Supabase error');
    }

    return (data ?? []) as Task[];
  }

  async getTaskById(id: string): Promise<TaskDetails> {
    const { data, error } = await this.supabaseService.supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching task:', error);
      throw new Error(error.message || 'Unknown Supabase error');
    }

    const [assigneeIds, subtasks] = await Promise.all([
      this.taskAssigneesService.getAssigneeIds(id),
      this.subtasksService.getSubtasks(id),
    ]);

    return {
      ...(data as Task),
      assignee_ids: assigneeIds,
      subtasks,
    };
  }

  async createTask(input: NewTaskInput): Promise<TaskDetails> {
    const row = this.mapTaskRow(input);
    const { data, error } = await this.supabaseService.supabase
      .from('tasks')
      .insert(row)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw new Error(error.message || 'Unknown Supabase error');
    }

    const task = data as Task;

    try {
      await this.taskAssigneesService.replaceAssignees(task.id, input.assigneeIds);
      await this.subtasksService.replaceSubtasks(task.id, input.subtasks);
      return await this.getTaskById(task.id);
    } catch (relationError) {
      await this.safeDelete(task.id);
      throw relationError;
    }
  }

  async updateTask(id: string, input: UpdateTaskInput): Promise<TaskDetails> {
    const row = this.mapTaskRow(input);
    const { error } = await this.supabaseService.supabase.from('tasks').update(row).eq('id', id);

    if (error) {
      console.error('Error updating task:', error);
      throw new Error(error.message || 'Unknown Supabase error');
    }

    if (input.assigneeIds) {
      await this.taskAssigneesService.replaceAssignees(id, input.assigneeIds);
    }

    if (input.subtasks) {
      await this.subtasksService.replaceSubtasks(id, input.subtasks);
    }

    return this.getTaskById(id);
  }

  async deleteTask(id: string): Promise<void> {
    const { error } = await this.supabaseService.supabase.from('tasks').delete().eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      throw new Error(error.message || 'Unknown Supabase error');
    }
  }

  private mapTaskRow(input: UpdateTaskInput) {
    const row: Record<string, string | null> = {};

    if (typeof input.title === 'string') {
      row['title'] = input.title.trim();
    }

    if (typeof input.description === 'string') {
      row['description'] = input.description.trim() || null;
    }

    if (typeof input.dueDate === 'string') {
      row['due_date'] = input.dueDate;
    }

    if (typeof input.priority === 'string') {
      row['priority'] = input.priority;
    }

    if (typeof input.category === 'string') {
      row['category'] = input.category;
    }

    if (typeof input.status === 'string') {
      row['status'] = input.status;
    }

    return row;
  }

  private async safeDelete(taskId: string): Promise<void> {
    const { error } = await this.supabaseService.supabase.from('tasks').delete().eq('id', taskId);

    if (error) {
      console.error('Error cleaning up task after failed relation write:', error);
    }
  }
}
