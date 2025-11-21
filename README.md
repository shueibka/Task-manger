# Smart Task Manager (React Native + SQLite)

A clean and modern **React Native Task Manager App** built with **Expo**, using a **full MVC architecture**, **SQLite database**, and **modular controllers/services design**.

This app demonstrates real-world mobile development skills that employers look for:

- Offline-first architecture
- Real SQL-powered database (SQLite)
- MVC-structured codebase
- Clean navigation flows
- Scalable folder structure
- Professional UI components and state management
- Written in TypeScript

---

## Features

### ✔ Offline-first SQLite Database

All tasks are stored locally using SQLite with:

- `CREATE TABLE`
- `INSERT`
- `SELECT`
- `UPDATE`
- `DELETE`

### ✔ Clean MVC Architecture

- **Models** → Type definitions (Task model)
- **Views** → Screens & UI components
- **Controllers** → Business logic (CRUD)
- **Services** → Database abstraction layer

### ✔ Beautiful & Modern UI

- Filter bar (All, Pending, Done, Important)
- Real-time updated list
- Floating Action Button for adding tasks
- Edit & delete screens
- Important task indicator

### ✔ Cross-platform Support

Works on:

- iOS
- Android
- Expo Go
- Emulators & real devices

---

# Project Structure

src/
├─ controllers/ # Business logic (CRUD)
├─ models/ # Data models
├─ navigation/ # React Navigation stack
├─ scripts/ # Seed scripts
├─ services/ # SQLite DB utilities
└─ views/
├─ components/ # Reusable UI components
└─ screens/ # App screens (TaskList, TaskForm)

---

# 🧠 Architecture Overview

### Model (M)

Defines the shape of the data:

### View (V)

UI screens and components:

### Controller (C)

All app logic (CRUD):

### Services Layer

Database functions abstracted cleanly:

SQLite is used behind the scenes, so the controller never touches SQL directly.

---

# 🛠 Installation & Running (Auto Setup)

Clone the project:

```bash
git clone https://github.com/<Shueibka>/smart-task-manager.git
cd smart-task-manager
```

### Option 1 — Automatic Setup (Linux / macOS)

./setup.sh

### Option 2 — Automatic Setup (Windows PowerShell)

./setup.ps1

### Option 3 — Manual Setup

npm install
npx expo start

### To start the development server:

npx expo start
