import Database from "better-sqlite3";

const db = new Database("mydb.sqlite");

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        hash TEXT NOT NULL
    )
    `
).run();

db.prepare(
  `   
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        
        priority TEXT NOT NULL CHECK(priority IN ('low', 'medium', 'high')),
        status TEXT NOT NULL CHECK(status IN ('todo', 'in-progress', 'completed')),
        dueDate DATETIME NOT NULL,

        category TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `
).run();

export const createUser = (email, hash, name) => {
  try {
    const stmt = db.prepare("INSERT INTO users (name, email, hash) VALUES (?, ?, ?)");
    const info = stmt.run(name, email, hash);

    return info.lastInsertRowid;
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      throw new Error("EMAIL_EXISTS");
    }
    throw error;
  }
};

export function getUserById(userId) {
  try {
    const stmt = db.prepare("SELECT id, name, email FROM users WHERE id = ?");
    return stmt.get(userId);
  } catch (error) {
    throw error;
  }
}

export function getUserByEmail(userEmail) {
  try {
    const stmt = db.prepare("SELECT id, name, email, hash FROM users WHERE email = ?");
    return stmt.get(userEmail);
  } catch (error) {
    throw error;
  }
}

export function getTaskById(taskId) {
  try {
    const stmt = db.prepare("SELECT * FROM tasks WHERE id = ?");
    return stmt.get(taskId);
  } catch (error) {
    throw error;
  }
}

export function getAllTasks() {
  try {
    const stmt = db.prepare("SELECT * FROM tasks");
    return stmt.all();
  } catch (error) {
    throw error;
  }
}

export function createTask({ title, description, priority, status, dueDate, category }) {
  try {
    const stmt = db.prepare(
      "INSERT INTO tasks (title, description, priority, status, dueDate, category) VALUES (?, ?, ?, ?, ?, ?)"
    );
    const info = stmt.run(title, description, priority, status, dueDate, category);
    return info.lastInsertRowid;
  } catch (error) {
    throw error;
  }
}

export function deleteTaskById(taskId) {
  try {
    const stmt = db.prepare("DELETE FROM tasks WHERE id = ?");
    const info = stmt.run(taskId);
    return info.lastInsertRowid;
  } catch (error) {
    throw error;
  }
}

export function updateTaskById(taskId, updates) {
  try {
    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");

    const sql = `UPDATE tasks SET ${setClause}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;

    const values = [...Object.values(updates), taskId];

    const stmt = db.prepare(sql);
    const info = stmt.run(...values);

    const newTask = getTaskById(taskId);
    return newTask;
  } catch (error) {
    throw error;
  }
}

export default db;
