<div align="center">

# 🧠 AI-Powered Code Analysis and Root Cause Diagnosis System

### *Transforming Bugs into Learning Opportunities with Artificial Intelligence*

An AI-powered debugging platform that analyzes **source code**, **error logs**, or **both together** to identify programming errors, determine their root causes, recommend fixes, and generate interactive learning resources that help developers improve their debugging skills.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript)
![AI Powered](https://img.shields.io/badge/AI-Powered-success)
![Hackathon](https://img.shields.io/badge/Hackathon-Project-blue)

### 🚀 Live Demo

[**Visit AI Bug Simulator →**](https://ai-bug-simulator.vercel.app/)

</div>

---

# 📖 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Objectives](#-objectives)
- [Solution](#-solution)
- [Key Features](#-key-features)
- [System Workflow](#-system-workflow)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Example Workflow](#-example-workflow)
- [Future Scope](#-future-scope)
- [Contributors](#-contributors)
- [License](#-license)

---

# 📌 Overview

Debugging is one of the most time-consuming and challenging aspects of software development. Developers often spend significant effort interpreting error messages, tracing program execution, and locating the actual cause of failures.

The **AI-Powered Code Analysis and Root Cause Diagnosis System** is designed to simplify this process by acting as an intelligent debugging assistant.

The system accepts:

- ✅ Source Code
- ✅ Error Logs
- ✅ Source Code + Error Logs

It then performs AI-driven analysis to identify bug patterns, determine root causes, explain failures in simple language, recommend fixes, and generate interactive educational content that helps developers learn from programming mistakes.

---

# ❗ Problem Statement

Developers—especially beginners and students—often struggle to understand programming errors because conventional debugging tools primarily display error messages rather than explaining why they occurred.

Typical debugging workflows involve:

- Reading lengthy stack traces
- Searching documentation and online forums
- Trial-and-error debugging
- Repeating similar mistakes due to limited conceptual understanding
- Spending excessive time identifying root causes

These challenges make debugging inefficient and reduce learning opportunities.

---

# 🎯 Objectives

This project aims to:

- Automate debugging using Artificial Intelligence.
- Detect bug patterns from code and error logs.
- Identify the underlying root cause of programming errors.
- Generate meaningful fix explanations.
- Produce corrected code whenever applicable.
- Convert debugging into an interactive learning experience.
- Improve developers' debugging and problem-solving skills.

---

# 💡 Solution

The system combines AI-powered code analysis with structured educational modules.

Depending on the provided input, it automatically generates:

- 🔍 Bug Pattern Classification
- 🧠 Root Cause Analysis
- 🛠 Fix Explanation
- 💻 Corrected Code *(when source code is provided)*
- 📊 Execution Flowchart
- 📘 Concept-Based Flashcards
- 📝 Interactive Quiz
- 🎯 Learning Outcome

This approach enables users to understand not only **what failed**, but also **why it failed** and **how to avoid similar issues in the future**.

---

# ✨ Key Features

## 🧠 Multi-Mode Analysis

Supports three intelligent analysis modes:

- Source Code Analysis
- Error Log Analysis
- Combined Code + Error Log Analysis

The system automatically selects the most suitable analysis strategy based on the user's input.

---

## 🔍 Root Cause Diagnosis

Rather than simply identifying an error, the system explains:

- Why the bug occurred
- Which variables or functions contributed to the issue
- Runtime behaviour leading to failure
- Best practices to prevent similar bugs

---

## 🛠 AI-Generated Fix Recommendations

Whenever source code is provided, the platform generates:

- Detailed Fix Explanation
- Corrected Source Code
- Best-practice implementation

---

## 📘 Interactive Learning Module

Every debugging session generates:

- Flashcards
- Interactive Quiz
- Execution Flowchart
- Learning Outcome

to reinforce programming concepts and debugging techniques.

---

## 📊 Interactive Dashboard

The results dashboard presents:

- Bug Pattern
- Severity Level
- Root Cause Analysis
- Fix Explanation
- Corrected Code
- Execution Flowchart
- Flashcards
- Quiz
- Learning Outcome

through an intuitive and user-friendly interface.

---

# ⚙️ System Workflow

```text
User Submission
(Code / Error Log / Both)
            │
            ▼
Input Classification
            │
            ▼
AI Prompt Generation
            │
            ▼
AI-Powered Analysis
            │
            ▼
Response Processing
            │
            ▼
Learning Content Generation
            │
            ▼
Interactive Results Dashboard
````

---

# 🏗️ System Architecture

```text
                User
                  │
                  ▼
      React Frontend Interface
                  │
                  ▼
         Express API Server
                  │
                  ▼
      Input Validation Module
                  │
                  ▼
      Prompt Generation Engine
                  │
                  ▼
     Large Language Model (LLM)
                  │
                  ▼
     Response Parser & Validator
                  │
                  ▼
    Learning Content Generator
                  │
                  ▼
   Interactive Results Dashboard
```

---

# 💻 Technology Stack

## Frontend

* React.js
* Tailwind CSS
* Framer Motion

### Backend

* Node.js
* Express.js

### Artificial Intelligence

* Large Language Model (LLM)
* Prompt Engineering
* Structured JSON Response Generation

### Development Tools

* Git
* GitHub
* Visual Studio Code

---

# 📂 Project Structure

```text
project-root
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── services
│   ├── utils
│   ├── uploads
│   ├── server.js
│   └── package.json
│
├── src
│   ├── assets
│   ├── components
│   ├── App.jsx
│   └── main.jsx
│
├── public
├── package.json
└── README.md
```

---

# 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/jshardul26/AI_BUG_SIMULATOR.git
```

### Navigate to the project

```bash
cd AI_BUG_SIMULATOR
```

### Install frontend dependencies

```bash
npm install
```

### Install backend dependencies

```bash
cd backend
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=8000
GROQ_API_KEY=your_api_key
JWT_SECRET=your_secret
```

---

# ▶️ Running the Project

### Start the Backend

```bash
cd backend
npm run dev
```

### Start the Frontend

```bash
npm run dev
```

---

# 📌 Example Workflow

### Step 1

The user submits:

* Source Code
* Error Log
* Source Code + Error Log

⬇️

### Step 2

The system analyses the input and identifies:

* Bug Pattern
* Root Cause
* Runtime Behaviour

⬇️

### Step 3

The platform generates:

* Root Cause Analysis
* Fix Explanation
* Corrected Code *(when source code is provided)*
* Execution Flowchart
* Flashcards
* Interactive Quiz
* Learning Outcome

⬇️

### Step 4

The user understands the underlying programming concept, applies the recommended solution, and develops stronger debugging skills.

---

# 🚀 Future Scope

* Support additional programming languages
* IDE plugin integration
* Personalized debugging history
* AI-powered code quality suggestions
* Performance optimization recommendations
* Team collaboration support
* Cloud deployment
* Debugging analytics dashboard

---

# 🌟 Why This Project?

Unlike conventional debugging tools that primarily identify errors, this system focuses on **understanding the reasoning behind programming failures**.

By combining AI-driven analysis with interactive educational content, it transforms every debugging session into a learning opportunity, enabling developers to resolve issues more effectively while strengthening their programming knowledge.

---

# 👥 Contributors

* **Sanvi Ingle**
* **Jshardul**

---

# 📄 License

This project was developed for educational and hackathon purposes.

---

<div align="center">

## ⭐ If you found this project useful, consider giving it a Star!

### **Analyse • Diagnose • Learn • Improve**

</div>
```
