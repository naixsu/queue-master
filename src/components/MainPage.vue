<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1>Volleyball Team Manager</h1>
        </div>
        <div class="stats">
          <div class="stat">
            <span class="stat-number">{{ players.length }}</span>
            <span class="stat-label">Players</span>
          </div>
          <div class="stat">
            <span class="stat-number">{{ teams.length }}</span>
            <span class="stat-label">Teams</span>
          </div>
        </div>
      </div>
    </header>

    <div class="main-layout">
      <!-- Left Column: Player Management -->
      <div class="players-section">
        <div class="section-header">
          <h2>Player Management</h2>
          <div class="position-legend">
            <span class="legend-item" v-for="pos in positions" :key="pos" :class="getPositionClass(pos)">
              {{ pos }}
            </span>
          </div>
        </div>

        <div class="player-form-card">
          <h3>Add New Player</h3>
          <div class="form-group">
            <input
              v-model="newPlayer.name"
              placeholder="Enter player name"
              class="player-input"
              @keyup.enter="addPlayer"
            />
            <select v-model="newPlayer.position" class="position-select">
              <option disabled value="">Select position</option>
              <option
                v-for="pos in positions"
                :key="pos"
                :value="pos"
              >
                {{ pos }}
              </option>
            </select>
            <button @click="addPlayer" class="add-btn" :disabled="!newPlayer.name || !newPlayer.position">
              Add Player
            </button>
          </div>
        </div>

        <div class="players-list-card">
          <div class="card-header">
            <h3>All Players ({{ players.length }})</h3>
            <button v-if="players.length > 0" @click="clearAllPlayers" class="clear-btn">
              Clear All
            </button>
          </div>
          
          <div v-if="players.length === 0" class="empty-state">
            <p>No players added yet</p>
            <p class="empty-subtitle">Add players to start building teams</p>
          </div>

          <div v-else class="players-grid">
            <div
              v-for="(player, i) in players"
              :key="i"
              class="player-card"
              :class="getPositionClass(player.position)"
            >
              <div class="player-info">
                <div class="player-name">{{ player.name }}</div>
                <div class="player-position">{{ player.position }}</div>
              </div>
              <button
                class="remove-btn"
                @click="removePlayer(i)"
                title="Remove player"
              >
                <span class="remove-icon">×</span>
              </button>
            </div>
          </div>
        </div>

        <button
          class="shuffle-btn"
          @click="shuffleTeams"
          :disabled="players.length < 7"
        >
          Shuffle Teams
          <span class="btn-subtitle">(Need at least 7 players)</span>
        </button>
      </div>

      <!-- Right Column: Teams -->
      <div class="teams-section">
        <div class="section-header">
          <h2>Generated Teams</h2>
          <div v-if="teams.length > 0" class="team-stats">
            {{ teams.length }} team{{ teams.length !== 1 ? 's' : '' }} formed
          </div>
        </div>

        <div v-if="teams.length === 0" class="empty-teams">
          <h3>No teams yet</h3>
          <p>Add players and shuffle to generate balanced volleyball teams</p>
        </div>

        <div v-else class="teams-grid">
          <div
            v-for="(team, t) in teams"
            :key="t"
            class="team-card"
          >
            <div class="team-header">
              <h3>Team {{ t + 1 }}</h3>
              <div class="team-size">{{ team.length }} players</div>
            </div>
            
            <div class="team-players">
              <div
                v-for="player in team"
                :key="player.name"
                class="team-player"
                :class="getPositionClass(player.position)"
              >
                <div class="player-name">{{ player.name }}</div>
                <div class="player-position">{{ player.position }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch, onMounted } from 'vue'

  const positions = [
    'Setter',
    'Libero',
    'Middle Blocker',
    'Outside Hitter',
    'Opposite Hitter',
    'Extra'
  ]

  const newPlayer = ref({ name: '', position: '' })
  const players = ref([])
  const teams = ref([])

  onMounted(() => {
    const saved = localStorage.getItem('players')
    if (saved) players.value = JSON.parse(saved)
  })

  watch(players, (val) => {
    localStorage.setItem('players', JSON.stringify(val))
  }, { deep: true })

  function addPlayer() {
    if (!newPlayer.value.name || !newPlayer.value.position) return
    players.value.push({ ...newPlayer.value })
    newPlayer.value = { name: '', position: '' }
  }

  function removePlayer(i) {
    players.value.splice(i, 1)
  }

  function clearAllPlayers() {
    if (confirm('Are you sure you want to clear all players?')) {
      players.value = []
      teams.value = []
    }
  }

  function getPositionClass(position) {
    const classMap = {
      'Setter': 'position-setter',
      'Libero': 'position-libero',
      'Middle Blocker': 'position-middle',
      'Outside Hitter': 'position-outside',
      'Opposite Hitter': 'position-opposite',
      'Extra': 'position-extra'
    }
    return classMap[position] || 'position-extra'
  }

  function shuffleTeams() {
    const shuffled = [...players.value].sort(() => Math.random() - 0.5)
    const temp = {
      Setter: [],
      Libero: [],
      'Middle Blocker': [],
      'Outside Hitter': [],
      'Opposite Hitter': [],
      Extra: []
    }

    shuffled.forEach(p => temp[p.position].push(p))

    const maxTeams = Math.min(
      temp.Setter.length,
      temp.Libero.length,
      Math.floor(temp['Middle Blocker'].length / 2),
      Math.floor(temp['Outside Hitter'].length / 2),
      temp['Opposite Hitter'].length
    )

    const results = []
    for (let i = 0; i < maxTeams; i++) {
      results.push([
        temp.Setter.pop(),
        temp.Libero.pop(),
        temp['Middle Blocker'].pop(),
        temp['Middle Blocker'].pop(),
        temp['Outside Hitter'].pop(),
        temp['Outside Hitter'].pop(),
        temp['Opposite Hitter'].pop(),
      ].filter(Boolean))
    }

    teams.value = results
  }
</script>

<style scoped>
  .app {
    min-height: 100vh;
    background-color: var(--bg-primary);
  }

  .header {
    background-color: var(--bg-card);
    border-bottom: 1px solid var(--border-light);
    padding: var(--space-4) 0;
    position: sticky;
    top: 0;
    z-index: var(--z-header);
  }

  .header-content {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 var(--space-4);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .logo h1 {
    font-size: var(--text-3xl);
    font-weight: var(--font-semibold);
    color: var(--text-secondary);
    margin: 0;
  }

  .stats {
    display: flex;
    gap: var(--space-6);
  }

  .stat {
    text-align: center;
  }

  .stat-number {
    display: block;
    font-size: var(--text-2xl);
    font-weight: var(--font-semibold);
    color: var(--color-gray-600);
  }

  .stat-label {
    font-size: var(--text-sm);
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .main-layout {
    max-width: 1000px;
    margin: 0 auto;
    padding: var(--space-4);
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-6);
  }

  .players-section,
  .teams-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-2);
  }

  .section-header h2 {
    font-size: var(--text-2xl);
    font-weight: var(--font-semibold);
    color: var(--text-secondary);
    margin: 0;
  }

  .position-legend {
    display: flex;
    gap: var(--space-1);
    flex-wrap: wrap;
  }

  .legend-item {
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .team-stats {
    color: var(--text-muted);
    font-size: var(--text-base);
  }

  .player-form-card,
  .players-list-card {
    background-color: var(--bg-card);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-light);
  }

  .player-form-card h3,
  .players-list-card h3 {
    margin: 0 0 var(--space-3) 0;
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--text-secondary);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-3);
  }

  .form-group {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
  }

  .player-input,
  .position-select {
    flex: 1;
    min-width: 120px;
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--border-medium);
    border-radius: var(--radius-md);
    font-size: var(--text-base);
    background-color: var(--bg-card);
    transition: border-color var(--transition-fast);
  }

  .player-input:focus,
  .position-select:focus {
    outline: none;
    border-color: var(--border-focus);
    box-shadow: 0 0 0 1px var(--border-focus);
  }

  .add-btn {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-2) var(--space-4);
    background-color: var(--color-primary);
    color: var(--color-white);
    border: none;
    border-radius: var(--radius-md);
    font-weight: var(--font-medium);
    cursor: pointer;
    white-space: nowrap;
    transition: background-color var(--transition-fast);
  }

  .add-btn:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
  }

  .add-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .clear-btn {
    padding: var(--space-1) var(--space-3);
    background-color: var(--color-danger-bg);
    color: var(--color-danger);
    border: 1px solid var(--color-danger-bg);
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    cursor: pointer;
    transition: background-color var(--transition-fast);
  }

  .clear-btn:hover {
    background-color: var(--color-danger-hover);
  }

  .empty-state {
    text-align: center;
    padding: var(--space-8) var(--space-4);
    color: var(--text-muted);
  }

  .empty-state p {
    margin: var(--space-1) 0;
    font-size: var(--text-base);
  }

  .empty-subtitle {
    font-size: var(--text-sm);
    opacity: 0.7;
  }

  .players-grid {
    display: grid;
    gap: var(--space-2);
    max-height: 500px;
    overflow-y: auto;
  }

  .player-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-3);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-medium);
    background-color: var(--bg-card);
    transition: border-color var(--transition-fast);
  }

  .player-card:hover {
    border-color: var(--border-medium);
  }

  .player-info {
    flex: 1;
  }

  .player-name {
    font-weight: var(--font-medium);
    color: var(--text-primary);
    margin-bottom: var(--space-1);
  }

  .player-position {
    font-size: var(--text-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: var(--font-medium);
  }

  .remove-btn {
    width: 1.5rem;
    height: 1.5rem;
    border: none;
    background-color: var(--color-danger-bg);
    color: var(--color-danger);
    border-radius: var(--radius-full);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--transition-fast);
  }

  .remove-btn:hover {
    background-color: var(--color-danger-hover);
  }

  .remove-icon {
    font-size: var(--text-lg);
    font-weight: var(--font-bold);
  }

  .shuffle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-6);
    background-color: var(--color-success);
    color: var(--color-white);
    border: none;
    border-radius: var(--radius-lg);
    font-size: var(--text-base);
    font-weight: var(--font-medium);
    cursor: pointer;
    flex-direction: column;
    transition: background-color var(--transition-fast);
  }

  .shuffle-btn:hover:not(:disabled) {
    background-color: var(--color-success-hover);
  }

  .shuffle-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-subtitle {
    font-size: var(--text-sm);
    opacity: 0.8;
    font-weight: var(--font-normal);
  }

  .empty-teams {
    background-color: var(--bg-card);
    border-radius: var(--radius-lg);
    padding: var(--space-8) var(--space-4);
    text-align: center;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-light);
  }

  .empty-teams h3 {
    margin: 0 0 var(--space-2) 0;
    font-size: var(--text-xl);
    color: var(--text-secondary);
  }

  .empty-teams p {
    margin: 0;
    color: var(--text-muted);
    font-size: var(--text-base);
  }

  .teams-grid {
    display: grid;
    gap: var(--space-3);
  }

  .team-card {
    background-color: var(--bg-card);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-light);
  }

  .team-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-3);
    padding-bottom: var(--space-2);
    border-bottom: 1px solid var(--border-medium);
  }

  .team-header h3 {
    margin: 0;
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--text-secondary);
  }

  .team-size {
    font-size: var(--text-sm);
    color: var(--color-gray-500);
    background-color: var(--color-gray-100);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    font-weight: var(--font-medium);
  }

  .team-players {
    display: grid;
    gap: var(--space-1);
  }

  .team-player {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-2);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-medium);
  }

  .team-player .player-name {
    font-weight: var(--font-medium);
    color: var(--text-primary);
  }

  .team-player .player-position {
    font-size: var(--text-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: var(--font-medium);
  }

  /* Position-specific colors */
  .position-setter {
    background-color: var(--position-setter-bg);
    color: var(--position-setter-text);
  }

  .position-libero {
    background-color: var(--position-libero-bg);
    color: var(--position-libero-text);
  }

  .position-middle {
    background-color: var(--position-middle-bg);
    color: var(--position-middle-text);
  }

  .position-outside {
    background-color: var(--position-outside-bg);
    color: var(--position-outside-text);
  }

  .position-opposite {
    background-color: var(--position-opposite-bg);
    color: var(--position-opposite-text);
  }

  .position-extra {
    background-color: var(--position-extra-bg);
    color: var(--position-extra-text);
  }

  .legend-item.position-setter {
    background-color: var(--position-setter-bg);
    color: var(--position-setter-text);
  }

  .legend-item.position-libero {
    background-color: var(--position-libero-bg);
    color: var(--position-libero-text);
  }

  .legend-item.position-middle {
    background-color: var(--position-middle-bg);
    color: var(--position-middle-text);
  }

  .legend-item.position-outside {
    background-color: var(--position-outside-bg);
    color: var(--position-outside-text);
  }

  .legend-item.position-opposite {
    background-color: var(--position-opposite-bg);
    color: var(--position-opposite-text);
  }

  .legend-item.position-extra {
    background-color: var(--position-extra-bg);
    color: var(--position-extra-text);
  }

  @media (max-width: 768px) {
    .main-layout {
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }
    
    .header-content {
      flex-direction: column;
      gap: var(--space-3);
    }
    
    .stats {
      gap: var(--space-4);
    }
    
    .form-group {
      flex-direction: column;
    }
    
    .player-input,
    .position-select {
      min-width: auto;
    }
    
    .position-legend {
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .main-layout {
      padding: var(--space-2);
    }
    
    .player-form-card,
    .players-list-card {
      padding: var(--space-3);
    }
    
    .logo h1 {
      font-size: var(--text-2xl);
    }
  }
</style>
