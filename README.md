# 🏐 Queue Master - Volleyball Team Manager

A simple Vue 3 app for creating balanced volleyball teams. Add players, assign positions (optional), and let the app automatically distribute them into fair teams.

## What it does

- **Add players** with names and positions (or leave as "Undecided")
- **Create teams** automatically with smart distribution
- **Manual team creation** for full control
- **Flexible system** - works with any number of players (minimum 2)
- **Auto-saves** everything to your browser

## Try it online

🌐 **Live Demo:** [https://naixsu.github.io/queue-master/](https://naixsu.github.io/queue-master/)

## Run locally

### Prerequisites
- Node.js 20+ 
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/naixsu/queue-master.git
cd queue-master

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production
```bash
npm run build
```

### Deploy
```bash
npm run deploy
```

## How to use

1. **Add players** - Enter names and optionally pick positions
2. **Create teams** - Click "Shuffle Teams" for automatic balancing
3. **Manual control** - Use "Manual Team Creation" to pick specific players
4. **Manage teams** - Edit, remove players, or delete entire teams

## Features

- ✅ **Flexible team creation** - Any number of players can form teams
- ✅ **Position prioritization** - Players with specific positions distributed evenly
- ✅ **Smart sorting** - Players organized by position for easy viewing
- ✅ **Responsive design** - Works on desktop and mobile
- ✅ **Auto-save** - No data loss on page refresh

## Tech Stack

- Vue 3 (Composition API)
- CSS Grid & Flexbox
- Local Storage for persistence
- No external dependencies

---
