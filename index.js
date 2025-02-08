#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store tasks in user's home directory
const TASKS_FILE = path.join(process.env.HOME || process.env.USERPROFILE, ".devtrack-tasks.json");

// Load tasks from file
const loadTasks = () => {
    try {
        return JSON.parse(fs.readFileSync(TASKS_FILE, "utf8"));
    } catch (error) {
        return [];
    }
};

// Save tasks to file
const saveTasks = (tasks) => {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
};

// Add a task
const addTask = (task) => {
    if (!task.trim()) {
        console.log(chalk.red("❌ Task cannot be empty!"));
        return;
    }
    const tasks = loadTasks();
    tasks.push({ task, done: false });
    saveTasks(tasks);
    console.log(chalk.green(`✔ Task added: ${task}`));
};

// List all tasks
const listTasks = () => {
    const tasks = loadTasks();
    if (tasks.length === 0) {
        console.log(chalk.yellow("⚠ No tasks found."));
    } else {
        console.log(chalk.blue("\n📌 Your To-Do List:"));
        tasks.forEach((t, i) => {
            console.log(
                `${chalk.bold(i + 1)}. ${t.done ? chalk.green("✔") : chalk.red("❌")} ${t.done ? chalk.strikethrough(t.task) : t.task}`
            );
        });
    }
};

// List only completed tasks
const listCompletedTasks = () => {
    const tasks = loadTasks();
    const completedTasks = tasks.filter(t => t.done);

    if (completedTasks.length === 0) {
        console.log(chalk.yellow("⚠ No completed tasks found."));
    } else {
        console.log(chalk.green("\n✔ Completed Tasks:"));
        completedTasks.forEach((t, i) => {
            console.log(`${chalk.bold(i + 1)}. ${chalk.strikethrough(t.task)}`);
        });
    }
};

// Complete a task
const completeTask = (index) => {
    const tasks = loadTasks();
    if (index > 0 && index <= tasks.length) {
        tasks[index - 1].done = true;
        saveTasks(tasks);
        console.log(chalk.green(`✔ Task ${index} marked as completed!`));
    } else {
        console.log(chalk.red("❌ Invalid task number!"));
    }
};

// Remove a task
const removeTask = (index) => {
    const tasks = loadTasks();
    if (index > 0 && index <= tasks.length) {
        const removedTask = tasks.splice(index - 1, 1);
        saveTasks(tasks);
        console.log(chalk.yellow(`🗑 Task removed: ${removedTask[0].task}`));
    } else {
        console.log(chalk.red("❌ Invalid task number!"));
    }
};


const showHelp = () => {
    console.log(chalk.cyan(`
📌 Devtrack CLI - A simple command-line task manager

🔹 Usage Commands:
1️⃣ Add a new task: 
   👉 npx devtrack add "Complete LeetCode Problem of the Day"

2️⃣ View all tasks: 
   👉 npx devtrack list

3️⃣ View completed tasks: 
   👉 npx devtrack completed

4️⃣ Mark a task as completed: 
   👉 npx devtrack done 1

5️⃣ Remove a task: 
   👉 npx devtrack remove 1

🌟 More Info:
📂 GitHub Repo: ${chalk.white("https://github.com/Sahilll94/devtrack-CLI")}  
📦 npm Package: ${chalk.white("https://www.npmjs.com/package/devtrack-cli")}  

🚀 Built by Sahil - Connect with me:  
   🔗 ${chalk.white("https://sahilportfolio.me/")}
`));
};


const [, , command, ...args] = process.argv;
switch (command) {
    case "add":
        addTask(args.join(" "));
        break;
    case "list":
        listTasks();
        break;
    case "completed":
        listCompletedTasks();
        break;
    case "done":
        completeTask(parseInt(args[0]));
        break;
    case "remove":
        removeTask(parseInt(args[0]));
        break;
    default:
        showHelp();
}
