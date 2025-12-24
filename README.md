# Tokohobby Blogs Client 🎨

A modern, "Daily.dev-style" blog interface built with **Vue 3**, **Vite**, and **Tailwind CSS**. It features a stunning grid layout, fun animations, and dark mode support.

## 🛠️ Tech Stack
- **Vue.js 3** (Composition API)
- **Vite** (Next Gen Frontend Tooling)
- **Tailwind CSS v3** (Utility-first styling)
- **Axios** (API Client)

## ✨ Key Features
- **Daily.dev Grid**: Responsive card layout with lift effects.
- **Media Integration**: 
  - **YouTube**: Auto-embeds videos in detail view and fetches thumbnails for the feed.
  - **Images**: Renders custom cover images.
- **Fun UI**: Bouncy buttons, emoji loading screens, and smooth transitions.
- **Dark Mode**: Fully supported slate-themed dark mode.
- **Smart Search**: Debounced search bar for performance.

## 🏃‍♂️ How to Run

### Prerequisites
- Node.js 18+
- NPM

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
The app will open at `http://localhost:5173`.

### Build for Production
```bash
npm run build
```
Outputs static files to `dist/`.

## 📁 Project Structure
- `src/components`: Reusable Vue components (Navbar, BlogList, BlogDetail).
- `src/style.css`: Tailwind directives and global styles.
- `tailwind.config.js`: Theme customization (colors, fonts).
