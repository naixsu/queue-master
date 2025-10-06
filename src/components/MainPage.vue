<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1>
            Volleyball Team Manager
          </h1>
        </div>
        <div class="stats">
          <div class="stat">
            <span class="stat-number">
              {{ players.length }}
            </span>
            <span class="stat-label">
              Players
            </span>
          </div>
          <div class="stat">
            <span class="stat-number">
              {{ teams.length }}
            </span>
            <span class="stat-label">
              Teams
            </span>
          </div>
        </div>
      </div>
    </header>

    <div class="main-layout">
      <!-- Left Column: Player Management -->
      <div class="players-section">
        <div class="section-header">
          <h2>
            Player Management
          </h2>
          <div class="position-legend">
            <span
              v-for="pos in positions"
              class="legend-item"
              :key="pos"
              :class="getPositionClass(pos)"
            >
              {{ pos }}
            </span>
          </div>
        </div>

        <div class="player-form-card">
          <h3>
            Add New Player
          </h3>
          <div class="form-group">
            <input
              v-model="newPlayer.name"
              placeholder="Enter player name"
              class="player-input"
              @keyup.enter="addPlayer"
            />
            <select
              v-model="newPlayer.position"
              class="position-select"
            >
              <option
                disabled
                value=""
              >
                Select position
              </option>
              <option
                v-for="pos in positions"
                :key="pos"
                :value="pos"
              >
                {{ pos }}
              </option>
            </select>
            <Button
              variant="primary"
              size="md"
              @click="addPlayer"
              :disabled="!newPlayer.name || !newPlayer.position"
            >
              Add Player
            </Button>
          </div>
        </div>

        <div class="players-list-card">
          <div class="card-header">
            <h3>
              All Players ({{ players.length }})
            </h3>
            <Button
              v-if="players.length > 0"
              variant="danger"
              size="sm"
              @click="clearAllPlayers"
            >
              Clear All
            </Button>
          </div>

          <div
            v-if="players.length === 0"
            class="empty-state"
          >
            <p>
              No players added yet
            </p>
            <p class="empty-subtitle">
              Add players to start building teams
            </p>
          </div>

          <div
            v-else
            class="players-grid"
          >
            <PlayerCard
              v-for="(player, i) in players"
              :key="i"
              :player="player"
              @remove="removePlayer(i)"
            />
          </div>
        </div>

        <div class="team-actions">
          <Button
            variant="success"
            size="md"
            @click="openTeamModal"
            :disabled="players.length < 7"
          >
            Manual Team Creation
          </Button>

          <ShuffleButton
            @click="shuffleTeams"
            :disabled="players.length < 7"
          />
        </div>
      </div>

      <!-- Right Column: Teams -->
      <div class="teams-section">
        <div class="section-header">
          <h2>
            Generated Teams
          </h2>
          <div
            v-if="teams.length > 0"
            class="team-stats"
          >
            {{ teams.length }} team{{ teams.length !== 1 ? 's' : '' }} formed
          </div>
        </div>

        <div
          v-if="teams.length === 0"
          class="empty-teams"
        >
          <h3>
            No teams yet
          </h3>
          <p>
            Add players and shuffle to generate balanced volleyball teams
          </p>
        </div>

        <div v-else class="teams-grid">
          <TeamCard
            v-for="(team, t) in teams"
            :key="t"
            :team-number="t + 1"
            :players="team"
            @remove-team="removeTeam(t)"
            @remove-player="removePlayerFromTeam"
          />
        </div>
      </div>
    </div>

    <!-- Team Selection Modal -->
    <TeamSelectionModal
      :is-open="showTeamModal"
      :players="players"
      @close="closeTeamModal"
      @create-team="createTeamFromModal"
    />
  </div>
</template>

<script setup>
  import { ref, watch, onMounted } from 'vue'
  import Button from './Button.vue'
  import PlayerCard from './PlayerCard.vue'
  import TeamCard from './TeamCard.vue'
  import ShuffleButton from './ShuffleButton.vue'
  import TeamSelectionModal from './TeamSelectionModal.vue'

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
  const showTeamModal = ref(false)

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
      showTeamModal.value = false
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
    // Clear existing team assignments
    players.value.forEach(player => {
      player.teamNumber = null
    })

    const shuffled = [...players.value].sort(() => Math.random() - 0.5)
    const temp = {
      'Setter': [],
      'Libero': [],
      'Middle Blocker': [],
      'Outside Hitter': [],
      'Opposite Hitter': [],
      'Extra': []
    }

    shuffled.forEach(p => temp[p.position].push(p))

    const maxTeams = Math.min(
      temp['Setter'].length,
      temp['Libero'].length,
      Math.floor(temp['Middle Blocker'].length / 2),
      Math.floor(temp['Outside Hitter'].length / 2),
      temp['Opposite Hitter'].length
    )

    const results = []
    for (let i = 0; i < maxTeams; i++) {
      const teamPlayers = [
        temp['Setter'].pop(),
        temp['Libero'].pop(),
        temp['Middle Blocker'].pop(),
        temp['Middle Blocker'].pop(),
        temp['Outside Hitter'].pop(),
        temp['Outside Hitter'].pop(),
        temp['Opposite Hitter'].pop(),
      ].filter(Boolean)

      // Assign team numbers to players
      teamPlayers.forEach(player => {
        player.teamNumber = i + 1
      })

      results.push(teamPlayers)
    }

    teams.value = results
  }

  function openTeamModal() {
    showTeamModal.value = true
  }

  function closeTeamModal() {
    showTeamModal.value = false
  }

  function createTeamFromModal(teamPlayers) {
    const teamNumber = teams.value.length + 1
    
    // Assign team numbers
    teamPlayers.forEach(player => {
      player.teamNumber = teamNumber
    })

    teams.value.push(teamPlayers)
  }

  function removeTeam(teamIndex) {
    if (confirm('Are you sure you want to remove this entire team?')) {
      // Clear team numbers from all players in this team
      teams.value[teamIndex].forEach(player => {
        player.teamNumber = null
      })

      // Remove the team
      teams.value.splice(teamIndex, 1)

      // Renumber all remaining teams
      renumberTeams()
    }
  }

  function renumberTeams() {
    teams.value.forEach((team, index) => {
      const newTeamNumber = index + 1
      team.forEach(player => {
        player.teamNumber = newTeamNumber
      })
    })
  }

  function removePlayerFromTeam(player) {
    // Clear team number from player
    player.teamNumber = null

    // Remove player from all teams
    teams.value.forEach(team => {
      const playerIndex = team.findIndex(p => p.name === player.name)
      if (playerIndex > -1) {
        team.splice(playerIndex, 1)
      }
    })

    // Remove empty teams
    teams.value = teams.value.filter(team => team.length > 0)
    
    // Renumber all remaining teams
    renumberTeams()
  }
</script>

<style scoped>
  .app {
    min-height: 100vh;
    background-color: var(--bg-primary);
    width: 100%;
    overflow-x: hidden;
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
    max-width: 90vw;
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
    max-width: 90vw;
    margin: 0 auto;
    padding: var(--space-4);
    display: grid;
    grid-template-columns: 1fr 1.5fr;
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
    max-height: 50vh;
    overflow-y: auto;
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

  .team-actions {
    display: flex;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  .teams-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3);
  }

  /* Position-specific colors for legend */
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
      max-width: 95vw;
    }

    .header-content {
      flex-direction: column;
      gap: var(--space-3);
      max-width: 95vw;
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

    .teams-grid {
      grid-template-columns: 1fr;
    }
    
    .team-actions {
      flex-direction: column;
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
