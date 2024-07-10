# My Vue App

## Description
This project is a todo list application built with Vue.js, using the Composition API and Vuex for state management. It includes user authentication, allowing users to sign up, log in, and manage their tasks. The backend is built with Node.js and MongoDB.

## Features
- User authentication (signup and login)
- Task management (add, update, delete tasks)
- User-specific tasks
- Responsive design using Element Plus

## Technologies Used
- Vue.js
- Vuex
- Element Plus
- Node.js
- Express
- MongoDB

## Project Setup

### Prerequisites
- Node.js
- MongoDB

### Clone the Repository
```bash
git clone https://github.com/raouzair10/my-vue-app.git
cd my-vue-app
```

### Install Dependencies
```bash
npm install
cd backend
npm install
```

### Environment Variables
Create a .env file in the backend directory and add the following environment variables:
MONGO_URI=<your-mongodb-uri>


### Running the Application
#### Frontend
```bash
npm run dev
```
#### Backend
```bash
cd backend
npm start
```

Replace <your-mongodb-uri> with your actual MongoDB URI. After setting up and running both frontend and backend, you can access the application at http://localhost:5173/ by default.