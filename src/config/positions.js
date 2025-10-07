// Global position configuration
export const POSITION_CONFIG = {
  // Position order for sorting and team distribution
  ORDER: [
    'Undecided',
    'Setter',
    'Libero',
    'Middle Blocker',
    'Outside Hitter',
    'Opposite Hitter'
  ],

  // Position display names
  DISPLAY_NAMES: {
    'Undecided': 'Undecided',
    'Setter': 'Setter',
    'Libero': 'Libero',
    'Middle Blocker': 'Middle Blocker',
    'Outside Hitter': 'Outside Hitter',
    'Opposite Hitter': 'Opposite Hitter'
  },

  // CSS class mapping
  CLASS_MAP: {
    'Undecided': 'position-undecided',
    'Setter': 'position-setter',
    'Libero': 'position-libero',
    'Middle Blocker': 'position-middle',
    'Outside Hitter': 'position-outside',
    'Opposite Hitter': 'position-opposite'
  },

  // Position descriptions for help
  DESCRIPTIONS: {
    'Undecided': 'Flexible players (default option)',
    'Setter': 'Playmaker who sets up attacks',
    'Libero': 'Defensive specialist',
    'Middle Blocker': 'Front-row blockers',
    'Outside Hitter': 'Main attackers',
    'Opposite Hitter': 'Secondary attacker'
  }
}

// Helper functions
export function getPositionClass(position) {
  return POSITION_CONFIG.CLASS_MAP[position] || POSITION_CONFIG.CLASS_MAP['Undecided']
}

export function getPositionOrder(position) {
  return POSITION_CONFIG.ORDER.indexOf(position)
}

export function sortPlayersByPosition(players) {
  return [...players].sort((a, b) => {
    // First, sort by team assignment (unassigned players first)
    const aHasTeam = a.teamNumber !== null && a.teamNumber !== undefined
    const bHasTeam = b.teamNumber !== null && b.teamNumber !== undefined

    if (aHasTeam !== bHasTeam) {
      return aHasTeam ? 1 : -1 // unassigned players come first
    }

    // Then sort by position order
    const orderA = getPositionOrder(a.position)
    const orderB = getPositionOrder(b.position)
    return orderA - orderB
  })
}

export function getPositionDisplayName(position) {
  return POSITION_CONFIG.DISPLAY_NAMES[position] || 'Undecided'
}

export function getPositionDescription(position) {
  return POSITION_CONFIG.DESCRIPTIONS[position] || 'Flexible players'
}
