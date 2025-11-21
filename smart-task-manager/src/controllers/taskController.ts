import { Task, TaskStatus } from "../models/Task";
import { db, initDatabase } from "../services/storage/database";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";

let tasksCache: Task[] = [];
let isInitialized = false;

function rowToTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    status: row.status as TaskStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    dueDate: row.due_date ?? undefined,
    isImportant: row.is_important === 1,
  };
}

export async function initTasks(): Promise<Task[]> {
  if (isInitialized) return tasksCache;

  // Create table if not exists
  initDatabase();

  const query = `SELECT * FROM tasks ORDER BY created_at DESC`;
  const result = db.getAllSync(query);

  tasksCache = result.map(rowToTask);
  isInitialized = true;
  return tasksCache;
}

export function getTasks(): Task[] {
  return tasksCache;
}

export async function createTask(input: {
  title: string;
  description?: string;
  dueDate?: string;
  isImportant?: boolean;
}): Promise<Task> {
  const id = uuidv4();
  const now = new Date().toISOString();

  const query = `
    INSERT INTO tasks (
      id, title, description, status,
      created_at, updated_at, due_date, is_important
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.runSync(query, [
    id,
    input.title,
    input.description ?? null,
    "pending",
    now,
    now,
    input.dueDate ?? null,
    input.isImportant ? 1 : 0,
  ]);

  const newTask: Task = {
    id,
    title: input.title,
    description: input.description ?? "",
    status: "pending",
    createdAt: now,
    updatedAt: now,
    dueDate: input.dueDate,
    isImportant: input.isImportant ?? false,
  };

  tasksCache = [newTask, ...tasksCache];
  return newTask;
}

export async function updateTask(
  id: string,
  updates: Partial<Task>
): Promise<Task | null> {
  const now = new Date().toISOString();

  const existing = tasksCache.find((t) => t.id === id);
  if (!existing) return null;

  const updated: Task = {
    ...existing,
    ...updates,
    updatedAt: now,
  };

  const query = `
    UPDATE tasks
    SET title = ?, description = ?, status = ?, updated_at = ?,
        due_date = ?, is_important = ?
    WHERE id = ?
  `;

  db.runSync(query, [
    updated.title,
    updated.description ?? null,
    updated.status,
    now,
    updated.dueDate ?? null,
    updated.isImportant ? 1 : 0,
    id,
  ]);

  const index = tasksCache.findIndex((t) => t.id === id);
  tasksCache[index] = updated;

  return updated;
}

export async function deleteTask(id: string): Promise<boolean> {
  db.runSync(`DELETE FROM tasks WHERE id = ?`, [id]);

  const before = tasksCache.length;
  tasksCache = tasksCache.filter((t) => t.id !== id);
  return tasksCache.length < before;
}

export async function setTaskStatus(
  id: string,
  status: TaskStatus
): Promise<Task | null> {
  return updateTask(id, { status });
}
