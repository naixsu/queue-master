# 🏐 Queue Master - Volleyball Team Management System

Hey there! I built this volleyball team management app because I was tired of manually trying to balance teams and keep track of who's playing what position. It's a Vue 3 app that makes organizing volleyball teams super easy and follows the actual volleyball rules.

## What This Does

### Managing Players
- Add players with their names and positions (all the standard volleyball positions plus "Extra" for those who don't have a specific role)
- Each position has its own color so you can quickly see who's what
- Shows which team each player is on right in the player list
- Remove players individually or clear everyone at once

### Creating Teams
I've got two ways to make teams:

**Automatic Shuffling**: Just click the shuffle button and it'll create balanced teams following volleyball rules. You need at least 7 players for this to work. Extra players are automatically distributed evenly across all teams.

**Manual Team Creation**: This is my favorite feature. Click "Manual Team Creation" and a modal pops up where you can pick exactly which players you want on a team. It shows you the requirements in real-time and won't let you create a team unless it follows the rules. You can also add Extra players as needed.

The volleyball rules it follows:
- 1 Setter
- 1 Libero  
- 2 Middle Blockers
- 2 Outside Hitters
- 1 Opposite Hitter
- Extra players (optional, distributed evenly)

### The UI
I tried to keep it clean and simple. No fancy gradients or anything that might distract from actually using it. Everything scales nicely when you zoom in/out, and it works on mobile too. I broke it down into reusable components so it's easy to maintain.

### Data Persistence
Everything saves automatically to your browser's local storage, so you won't lose your teams when you refresh the page. When you reload, it reconstructs all the teams from the player data.

## Getting Started

### What You Need
- Node.js (version 16 ((maybe 20 i think?)) or higher)
- npm or yarn

### Installation

1. **Get the code**
   ```bash
   git clone <repository-url>
   cd queue-master
   ```

2. **Install the dependencies**
   ```bash
   npm install
   ```

3. **Start it up**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Go to `http://localhost:5173`

### Building for Production
```bash
npm run build
```

## How to Use It

### Adding Players
Pretty straightforward - just type in a name, pick a position from the dropdown, and hit "Add Player". The player will show up in the list with a colored badge for their position.

### Making Teams

**For Automatic Teams:**
1. Make sure you have at least 7 players
2. Click "Shuffle Teams"
3. Done! Teams are created and players show their team numbers

**For Manual Teams:**
1. Click "Manual Team Creation"
2. A modal opens with all your available players
3. Click players to select them (you'll see them highlighted with a blue border)
4. The requirements section shows what you still need (including optional Extra players)
5. When everything's green, click "Create Team"
6. Your team appears in the teams section

### Managing Teams
- **Edit Teams**: Click the "Edit" button on any team to modify its players
- **Remove Players**: Click "Remove" on individual player cards to remove them from teams
- **Remove Teams**: Click "Remove" in the team header to delete entire teams
- **Auto-renumbering**: When you remove teams, all remaining teams get renumbered automatically
- **Extra Players**: Add as many Extra players as you want during team creation or editing

## How I Built It

### Components
I split everything into separate components:
- **MainPage.vue**: The main container that holds everything
- **PlayerCard.vue**: Shows individual players (can be in different modes)
- **TeamCard.vue**: Displays teams with management controls
- **Button.vue**: Reusable button component
- **ShuffleButton.vue**: Special button for shuffling
- **TeamSelectionModal.vue**: The modal for manual team creation

### Styling
I put all the CSS variables in `main.css` so I can easily change colors and spacing across the whole app. Each component has its own scoped styles that use those variables.

### State Management
I used Vue 3's Composition API with `ref()` for reactive data. Everything automatically saves to localStorage using `watch()`, and when you reload the page, it rebuilds the teams from the player data.

## The Technical Stuff

### Volleyball Rules
I implemented the standard volleyball team composition:
- **1 Setter**: The one who sets up the plays
- **1 Libero**: Defensive specialist (can't attack)
- **2 Middle Blockers**: Front-row blockers
- **2 Outside Hitters**: Main attackers
- **1 Opposite Hitter**: Secondary attacker
- **Extra Players**: Flexible players that can fill any role (distributed evenly across teams)

### Data Structure
Here's how the data looks:

```javascript
// Each player
{
  name: "John Doe",
  position: "Setter", // or Libero, Middle Blocker, etc.
  teamNumber: 1 // null if not on a team
}

// Teams array
[
  [player1, player2, player3, ...], // Team 1
  [player4, player5, player6, ...], // Team 2
  // etc.
]
```

### Browser Support
Works on all modern browsers (Chrome, Firefox, Safari, Edge). Uses CSS Grid, Flexbox, and CSS Variables, so older browsers might not work perfectly.

## Project Structure
```
src/
├── components/
│   ├── MainPage.vue
│   ├── PlayerCard.vue
│   ├── TeamCard.vue
│   ├── Button.vue
│   ├── ShuffleButton.vue
│   └── TeamSelectionModal.vue
├── main.css
├── main.js
└── App.vue
```

## Recent Updates

### New Features Added:
- **Extra Player Support**: Extra players are now included in automatic shuffling and distributed evenly across teams
- **Team Editing**: Click the "Edit" button on any team to modify its players after creation
- **Enhanced Manual Team Creation**: Add as many Extra players as you want during team creation
- **Improved UI**: Better visual feedback for selected players with highlighting and consistent button styling
- **Flexible Team Management**: Full control over team composition with easy add/remove functionality

### UI Improvements:
- Replaced icon-based buttons with clear text labels for better accessibility
- Enhanced visual feedback for player selection in team creation modal
- Consistent button styling throughout the application
- Better responsive design for mobile devices

## Contributing

If you find any bugs or want to add features, feel free to submit a pull request! I'm always looking to improve this.

## License

This is open source under the MIT License.

---

Thanks for checking out my volleyball team management app! I hope it makes organizing your teams as easy as it does for me. 🏐