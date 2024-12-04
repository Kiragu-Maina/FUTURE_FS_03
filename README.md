# Todo List Application

This repository contains the source code for a full-stack Todo List application, split into backend and frontend projects.

## Project Structure

```
.
├── todolistbackend    # Backend service for handling todos
│   ├── leapcell.yaml  # Configuration file for deployment (e.g., Kubernetes)
│   ├── LICENSE        # License for the project
│   ├── node_modules   # Node.js dependencies
│   ├── package.json   # Node.js project configuration
│   ├── package-lock.json # Lock file for dependencies
│   ├── README.md      # Backend README
│   └── src
│       ├── config
│       │   └── firebaseconfig.json  # Firebase configuration
│       ├── routes
│       │   └── todos.js             # API routes for todo operations
│       ├── server.js                # Entry point of the backend server
│       └── services
│           └── firebase.js          # Firebase service integration
└── todolistfrontend   # Frontend application for managing todos
    ├── apiconfig.js   # Backend API URL configuration
    ├── app
    │   ├── auth       # Authentication-related pages and layouts
    │   │   ├── layout.tsx
    │   │   ├── login/page.tsx       # Login page
    │   │   ├── logout.tsx          # Logout handler
    │   │   └── register/page.tsx   # User registration page
    │   ├── favicon.ico             # App icon
    │   ├── fonts                   # Fonts used in the app
    │   ├── globals.css             # Global CSS styles
    │   ├── layout.tsx              # Root layout
    │   ├── page.tsx                # Homepage
    │   └── todos                   # Todo-related pages
    │       ├── create/page.tsx     # Create todo page
    │       ├── [id]/edit/page.tsx  # Edit todo page
    │       ├── layout.tsx          # Todos layout
    │       └── page.tsx            # Todo list page
    ├── components
    │   └── ui                      # Reusable UI components
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── menubar.tsx
    │       └── textarea.tsx
    ├── components.json             # UI component metadata
    ├── firebaseConfig.js           # Firebase configuration for the frontend
    ├── firebase.js                 # Firebase service integration
    ├── lib
    │   └── utils.ts                # Utility functions
    ├── next.config.mjs             # Next.js configuration
    ├── next-env.d.ts               # TypeScript environment definitions
    ├── node_modules                # Node.js dependencies
    ├── package.json                # Node.js project configuration
    ├── package-lock.json           # Lock file for dependencies
    ├── postcss.config.mjs          # PostCSS configuration
    ├── tailwind.config.ts          # Tailwind CSS configuration
    └── tsconfig.json               # TypeScript configuration
```

---

## Backend (`todolistbackend`)

The backend is a Node.js and Express application that provides REST API endpoints for managing todos. It uses Firebase for authentication and database storage.

### Key Features
- User authentication and authorization (via JWT).
- CRUD operations for todos.
- Firebase Firestore as the database.
- Error handling and response validation.

### Setup
1. **Install dependencies**:
   ```bash
   cd todolistbackend
   npm install
   ```
2. **Configure Firebase**:
   Add your Firebase credentials in `src/config/firebaseconfig.json`.

3. **Run the server**:
   ```bash
   npm start
   ```

### API Endpoints
- `POST /todos` - Create a new todo.
- `GET /todos` - Retrieve all todos for the authenticated user.
- `PUT /todos/:id` - Update a specific todo.
- `DELETE /todos/:id` - Delete a specific todo.

---

## Frontend (`todolistfrontend`)

The frontend is built with Next.js and TypeScript. It provides an intuitive UI for managing todos, with features like authentication, creating, editing, and deleting todos.

### Key Features
- Authentication (register, login, logout).
- Responsive design using Tailwind CSS.
- Reusable UI components.

### Setup
1. **Install dependencies**:
   ```bash
   cd todolistfrontend
   npm install
   ```
2. **Configure Backend URL**:
   Update `apiconfig.js` with the backend's URL:
   ```javascript
   const config = {
       backendUrl: 'http://localhost:3002', // Replace with your backend URL
   };
   export default config;
   ```

3. **Run the application**:
   ```bash
   npm run dev
   ```

### Key Pages
- `/auth/register` - User registration.
- `/auth/login` - User login.
- `/todos` - View all todos.
- `/todos/create` - Create a new todo.
- `/todos/[id]/edit` - Edit a specific todo.

---

## License
This project is licensed under the MIT License. See the [LICENSE](todolistbackend/LICENSE) file for more details.

---

## Contributions
Contributions are welcome! Feel free to fork this repo and create a pull request with your changes.

---

## Author
Developed by **Kiragu Maina**.