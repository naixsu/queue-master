<template>
  <div
    class="app"
    :class="{ 'modal-open': showTeamModal || showEditTeamModal || showHelpModal }"
  >
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1>
            Volleyball Team Manager
          </h1>
          <Button
            variant="primary"
            size="md"
            @click="showHelpModal = true"
            title="What is this app and how to use it?"
          >
            Help
          </Button>
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
                Select position (optional)
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
              :disabled="!newPlayer.name"
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
              v-for="(player, i) in sortedPlayers"
              :key="i"
              :player="player"
              :show-team-number="true"
              @remove="removePlayer(i)"
            />
          </div>
        </div>

        <div class="team-actions">
          <Button
            variant="success"
            size="lg"
            @click="openTeamModal"
            :disabled="players.length < 2"
          >
            Manual Team Creation
          </Button>

          <Button
            variant="success"
            size="lg"
            @click="shuffleTeams"
            :disabled="players.length < 2"
          >
            Shuffle Teams
          </Button>
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
            @edit-team="editTeam(t)"
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

    <!-- Edit Team Modal -->
    <TeamSelectionModal
      :is-open="showEditTeamModal"
      :players="players"
      :editing-team="editingTeamIndex !== null ? teams[editingTeamIndex] : null"
      @close="closeEditTeamModal"
      @create-team="updateTeamFromModal"
    />

    <!-- Help Modal -->
    <HelpModal
      :is-open="showHelpModal"
      @close="showHelpModal = false"
    />
  </div>
</template>

<script setup>
  import { ref, watch, onMounted, computed } from 'vue'
  import Button from './Button.vue'
  import PlayerCard from './PlayerCard.vue'
  import TeamCard from './TeamCard.vue'
  import TeamSelectionModal from './TeamSelectionModal.vue'
  import HelpModal from './HelpModal.vue'
  import { POSITION_CONFIG, getPositionClass, sortPlayersByPosition } from '../config/positions.js'

  const positions = POSITION_CONFIG.ORDER

  const newPlayer = ref({ name: '', position: '' })
  const players = ref([])
  const teams = ref([])
  const showTeamModal = ref(false)
  const showEditTeamModal = ref(false)
  const editingTeamIndex = ref(null)
  const showHelpModal = ref(false)

  // Computed property for players sorted by position
  const sortedPlayers = computed(() => {
    return sortPlayersByPosition(players.value)
  })

  onMounted(() => {
    const saved = localStorage.getItem('players')
    if (saved) {
      players.value = JSON.parse(saved)
      // Reconstruct teams from players' team numbers
      reconstructTeams()
    }
  })

  watch(players, (val) => {
    localStorage.setItem('players', JSON.stringify(val))
  }, { deep: true })

  function addPlayer() {
    if (!newPlayer.value.name) return

    const position = newPlayer.value.position || 'Undecided'
    players.value.push({ name: newPlayer.value.name, position })

    newPlayer.value = { name: '', position: '' }
  }

  function removePlayer(sortedIndex) {
    // Find the original index in the players array
    const sortedPlayer = sortedPlayers.value[sortedIndex]
    const originalIndex = players.value.findIndex(p => p.name === sortedPlayer.name && p.position === sortedPlayer.position)
    if (originalIndex !== -1) {
      players.value.splice(originalIndex, 1)
    }
  }

  function clearAllPlayers() {
    if (confirm('Are you sure you want to clear all players?')) {
      players.value = []
      teams.value = []
      showTeamModal.value = false
    }
  }


  function shuffleTeams() {
    // Clear existing team assignments
    players.value.forEach(player => {
      player.teamNumber = null
    })

    if (players.value.length === 0) {
      teams.value = []
      return
    }

    const numPlayers = players.value.length

    // Calculate number of teams based on 7-player threshold
    // e.g. 1 team for 1–7 players, 2 for 8–14, 3 for 15–21, etc.
    const numTeams = Math.max(1, Math.ceil(numPlayers / 7))

    // Separate players by position using global config
    const playersByPosition = {}
    POSITION_CONFIG.ORDER.forEach(position => {
      playersByPosition[position] = []
    })

    players.value.forEach(player => {
      if (playersByPosition[player.position]) {
        playersByPosition[player.position].push(player)
      } else {
        playersByPosition['Undecided'].push(player)
      }
    })

    // Shuffle each position group
    POSITION_CONFIG.ORDER.forEach(position => {
      playersByPosition[position].sort(() => Math.random() - 0.5)
    })

    // Create teams array
    const results = Array(numTeams).fill().map(() => [])

    // Distribute players by position (except Undecided)
    const specificPositions = POSITION_CONFIG.ORDER.filter(pos => pos !== 'Undecided')
    specificPositions.forEach(position => {
      const playersInPosition = playersByPosition[position]
      playersInPosition.forEach((player, index) => {
        const teamIndex = index % numTeams
        player.teamNumber = teamIndex + 1
        results[teamIndex].push(player)
      })
    })

    // Distribute Undecided players evenly after core roles
    const undecidedPlayers = playersByPosition['Undecided']
    undecidedPlayers.forEach((player, index) => {
      const teamIndex = index % numTeams
      player.teamNumber = teamIndex + 1
      results[teamIndex].push(player)
    })

    // Remove teams that are completely empty (shouldn’t happen, but just in case)
    const filledTeams = results.filter(team => team.length > 0)

    teams.value = filledTeams
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

  function editTeam(teamIndex) {
    editingTeamIndex.value = teamIndex
    showEditTeamModal.value = true
  }

  function closeEditTeamModal() {
    showEditTeamModal.value = false
    editingTeamIndex.value = null
  }

  function updateTeamFromModal(teamPlayers) {
    if (editingTeamIndex.value !== null) {
      const teamNumber = editingTeamIndex.value + 1

      // Clear team numbers from current team players
      teams.value[editingTeamIndex.value].forEach(player => {
        player.teamNumber = null
      })

      // Remove players from other teams if they're being transferred
      teamPlayers.forEach(player => {
        // Find and remove player from any existing team
        teams.value.forEach((team, teamIndex) => {
          const playerIndex = team.findIndex(p => p.name === player.name && p.position === player.position)
          if (playerIndex > -1) {
            team.splice(playerIndex, 1)
          }
        })

        // Assign team number to the player
        player.teamNumber = teamNumber
      })

      // Replace the team
      teams.value[editingTeamIndex.value] = teamPlayers

      // Remove empty teams and renumber remaining teams
      teams.value = teams.value.filter(team => team.length > 0)
      renumberTeams()
    }
    closeEditTeamModal()
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

  function reconstructTeams() {
    // Group players by their team number
    const teamsMap = new Map()

    players.value.forEach(player => {
      if (player.teamNumber) {
        if (!teamsMap.has(player.teamNumber)) {
          teamsMap.set(player.teamNumber, [])
        }
        teamsMap.get(player.teamNumber).push(player)
      }
    })

    // Convert map to array and sort by team number
    const teamsArray = Array.from(teamsMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([teamNumber, players]) => players)

    teams.value = teamsArray
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

  .app.modal-open {
    overflow: hidden;
    height: 100vh;
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
    justify-content: center;
    /* align-items: center; */
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

  .legend-item.position-undecided {
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
