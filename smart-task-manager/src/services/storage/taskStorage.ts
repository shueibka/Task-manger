import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../../models/Task";

const TASKS_KEY = "SMART_TASK_MANAGER_TASKS";

export async function loadTasksFromStorage(): Promise<Task[]> {
  try {
    const json = await AsyncStorage.getItem(TASKS_KEY);
    if (!json) return [];
    return JSON.parse(json) as Task[];
  } catch (error) {
    console.error("Failed to load tasks from storage", error);
    return [];
  }
}

export async function saveTasksToStorage(tasks: Task[]): Promise<void> {
  try {
    const json = JSON.stringify(tasks);
    await AsyncStorage.setItem(TASKS_KEY, json);
  } catch (error) {
    console.error("Failed to save tasks to storage", error);
  }
}
