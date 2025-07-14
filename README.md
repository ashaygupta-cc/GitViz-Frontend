# 🔍 GitViz

GitViz is an interactive visualization tool that helps users explore GitHub repositories, profiles, and file structures in a visually appealing and intuitive manner.

---

## 📚 Table of Contents

- Introduction  
- Features  
- Tech Stack  
- Getting Started  
  - Prerequisites  
  - Installation  
  - Running the Application  
- Backend Integration and Running Full Stack Locally  
- Environment Variables and API Key Setup  
- Project Structure  
- Contributing  
- License  
- Contact  

---

GitViz is a React-based developer tool that lets users visualize GitHub profiles, repositories, and directory trees with ease. It combines data analysis, UI interactivity, and export capabilities into a single streamlined interface.

---

## 🚀 Features

- GitHub Profile Visualization  
- Repository Structure Mapping  
- File Tree Flowchart Generation  
- Light/Dark Theme Toggle  
- Export as PNG, SVG, or PDF  
- Custom Color Presets Based on File Type  
- Zoom, Pan & Drag Interactions  

---

## 🛠 Tech Stack

- **Frontend**: React, Tailwind CSS, React Router  
- **Visualization**: React Flow, D3, Dagre, Chart.js  
- **PDF Export**: html-to-image, html2canvas, jspdf  
- **Utilities**: Date-fns  
- **Tooling**: Vite, ESLint, PostCSS
- **Backend**: Node.js, Express, dotenv, cors, axios  

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v14 or later)  
- npm  

### Installation

```bash
git clone https://github.com/your-username/GitViz.git
cd GitViz-Frontend
npm install
```

### Running the Application

```bash
npm run dev
```

Frontend app starts on: [http://localhost:5173](http://localhost:5173)

**⚠️ Important:** The frontend requires a backend server to be running. Make sure to start your backend server on http://localhost:5000 before using the application.

---

## 🔌 Backend Integration & Running Full Stack Locally

This project uses a separate backend server to securely handle GitHub API requests, token management, and rate limiting.

### Setup Backend

1. Navigate to backend folder:

```bash
cd GitViz-Backend
```

2. Create `.env` file and add your GitHub token:

```
GITHUB_TOKEN=your_personal_access_token_here
```

**⚠️ Never commit `.env` files with secrets publicly.**

3. Install backend dependencies and start the server:

```bash
npm install
npm start
```

Backend runs on: [http://localhost:5000](http://localhost:5000)

---

### Connect Frontend with Backend

Add the following to your frontend `.env`:

```
VITE_BACKEND_URL=http://localhost:5000
```

Run the frontend again:

```bash
cd GitViz-Frontend
npm install
npm run dev
```

Full app now accessible at [http://localhost:5173](http://localhost:5173), with secure backend integration.

---

## 🔐 Environment Variables & API Key Setup

1. Create a GitHub token (classic or fine-grained) with appropriate scopes.  
2. Add the token to the backend `.env` file:

```
GITHUB_TOKEN=YOUR_API_KEY_HERE
```

3. Add backend URL to the frontend `.env`:

```
VITE_BACKEND_URL=http://localhost:5000
```

> **❗ Do NOT commit your real tokens or `.env` files to public repositories.**

---

## 🗂 Project Structure

```bash
GitViz-Backend/
├── .env
├── api.js
├── server.js
├── package.json
├── package-lock.json
└── node_modules/

GitViz-Frontend/
├── .gitignore
├── LICENSE
├── index.html
├── eslint.config.js
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── package.json
├── package-lock.json
├── public/
├── node_modules/
└── src/
    ├── App.css
    ├── github.js
    ├── index.css
    ├── main.jsx
    ├── components/
    │   ├── Layout/
    │   │   ├── Header.jsx
    │   │   ├── Layout.jsx
    │   │   └── Sidebar.jsx
    │   ├── Repository/
    │   │   ├── downloadPdf.jsx
    │   │   ├── FlowChartView.jsx
    │   │   ├── LanguageDistribution.jsx
    │   │   └── RepositoryHeader.jsx
    │   └── User/
    │       ├── ProfileHeader.jsx
    │       └── RepositoryCard.jsx
    ├── pages/
    │   ├── Home.jsx
    │   ├── RepositoryDetail.jsx
    │   └── UserProfile.jsx
    ├── stores/
    │   ├── repoStore.js
    │   ├── themeStore.js
    │   └── userStore.js
    ├── types/
    │   └── index.js
    └── utils/
        └── treeutils.js

```

---

## 🤝 Contributing

Contributions are welcome!  
Feel free to open issues or submit pull requests.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 📬 Contact

**Created by**: Ashay  
**Email**: [ashay051204@gmail.com](mailto:ashay051204@gmail.com)  
**GitHub**: [https://github.com/ashaygupta-cc](https://github.com/ashaygupta-cc)
