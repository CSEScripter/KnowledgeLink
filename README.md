# KnowledgeLink
KnowledgeLink ::  A Web-Based Academic Portal for Collaborative Learning and Knowledge Sharing
# KnowledgeLink

KnowledgeLink is a MERN stack project for managing courses, resources, and blogs for CSE students of Comilla University.

---

## 🚀 How to Run This Project on Another Machine

Follow the steps below to clone and run this project on any other computer.

---

## ✅ Prerequisites

Make sure you have the following installed:

- [Node.js (v14+ recommended)](https://nodejs.org/)
- npm (comes with Node.js)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas)

---

## 📥 Step 1: Clone the Repository

Clone the repository using Git:

```bash
git clone https://github.com/CSEScripter/KnowledgeLink.git
cd KnowledgeLink
```

If the project uses Git submodules (e.g., a separate frontend submodule), clone with:

```bash
git clone --recurse-submodules https://github.com/CSEScripter/KnowledgeLink.git
```

---

## 📦 Step 2: Install Dependencies

Make sure Node.js is installed. Then, install the required packages for both frontend and backend.

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd ../frontend
npm install
```

---

## ⚙️ Step 3: Configure Environment Variables

Create a `.env` file inside the backend directory:

If a sample file is available:

```bash
# Linux/macOS
cp .env.example .env

# Windows
copy .env.example .env
```

Update the `.env` file with your MongoDB URI and any other required configuration:

```env
MONGO_URI=mongodb://localhost:27017/knowledgeLink
PORT=5000
```

---

## ▶️ Step 4: Run the Project

### Start the Backend Server
```bash
cd backend
npm start
```
By default, this runs the backend at:  
👉 `http://localhost:5000`

### Start the Frontend App
```bash
cd ../frontend
npm start
```
The React app will be available at:  
👉 `http://localhost:3000`

---

## 🛠️ Optional: Use Local MongoDB

If you don't want to use MongoDB Atlas, you can install MongoDB locally and set your `MONGO_URI` in the `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/knowledgeLink
```

---

## 💡 Tips

- Ensure your Node.js version is compatible with the project.
- If you face build issues in the frontend, try:
  ```bash
  npm run build
  ```
- You can use `concurrently` or a monorepo setup to run both frontend and backend with a single command (optional).

---

## 📌 License
This project is developed for educational purposes in the **CSE Department, Comilla University**.
