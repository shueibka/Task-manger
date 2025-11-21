import { db, initDatabase } from "../services/storage/database";

export function seedDemoTasks() {
  initDatabase();

  const now = new Date().toISOString();

  // Clear existing tasks
  db.runSync("DELETE FROM tasks");

  const demoTasks = [
    { title: "Workout", description: "Leg day at the gym", isImportant: 1 },
    {
      title: "Study React Native",
      description: "Read docs and practice",
      isImportant: 1,
    },
    {
      title: "Grocery shopping",
      description: "Milk, eggs, bread",
      isImportant: 0,
    },
    {
      title: "Clean room",
      description: "Vacuum and organize desk",
      isImportant: 0,
    },
    { title: "Call family", description: "Weekly check-in", isImportant: 1 },
    { title: "Quran", description: "Read 2 pages after Fajr", isImportant: 1 },
    {
      title: "Plan week",
      description: "Write goals for the week",
      isImportant: 0,
    },
    { title: "Walk outside", description: "30 min walk", isImportant: 0 },
    {
      title: "Review CV",
      description: "Update projects section",
      isImportant: 1,
    },
    {
      title: "Learn SQL",
      description: "Practice SELECT/INSERT/UPDATE",
      isImportant: 0,
    },
  ];

  const insertSql = `
    INSERT INTO tasks (
      id, title, description, status,
      created_at, updated_at, due_date, is_important
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.withTransactionSync(() => {
    demoTasks.forEach((task, index) => {
      const id = `${Date.now()}-${index}`;
      db.runSync(insertSql, [
        id,
        task.title,
        task.description,
        "pending",
        now,
        now,
        null,
        task.isImportant,
      ]);
    });
  });

  console.log("Seeded demo tasks to database.");
}
