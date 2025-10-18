<template>
  <div
    v-if="isOpen"
    class="modal-overlay"
    @click="closeModal"
  >
    <div
      class="modal-content"
      @click.stop
    >
      <div class="modal-header">
        <h2>
          {{ editingTeam ? 'Edit Team' : 'Create Team' }}
        </h2>
        <button
          class="close-btn"
          @click="closeModal"
        >
          ×
        </button>
      </div>
      
      <div class="modal-body">
        <div class="team-requirements">
          <h3>
            Team Composition
          </h3>

          <div class="requirements-grid">
            <div class="requirement">
              <span class="requirement-icon">
                ✓
              </span>
              <span>
                At least 1 player
              </span>
              <span class="count">
                ({{ selectedPlayers.length }} selected)
              </span>
            </div>

            <div class="requirement extra-requirement">
              <span>
                Positions are optional - players with specific positions will be prioritized in team distribution
              </span>
            </div>
          </div>

          <div class="position-breakdown">
            <h4>
              Selected Players by Position:
            </h4>
            <div class="position-stats">
              <div
                v-if="selectedCounts['Setter'] > 0"
                class="position-stat"
              >
                <span class="position-name">
                  Setters:
                </span>
                <span class="position-count">
                  {{ selectedCounts['Setter'] }}
                </span>
              </div>
              <div
                v-if="selectedCounts['Libero'] > 0"
                class="position-stat"
              >
                <span class="position-name">
                  Liberos:
                </span>
                <span class="position-count">
                  {{ selectedCounts['Libero'] }}
                </span>
              </div>
              <div
                v-if="selectedCounts['Middle Blocker'] > 0"
                class="position-stat"
              >
                <span class="position-name">
                  Middle Blockers:
                </span>
                <span class="position-count">
                  {{ selectedCounts['Middle Blocker'] }}
                </span>
              </div>
              <div
                v-if="selectedCounts['Outside Hitter'] > 0"
                class="position-stat"
              >
                <span class="position-name">
                  Outside Hitters:
                </span>
                <span class="position-count">
                  {{ selectedCounts['Outside Hitter'] }}
                </span>
              </div>
              <div
                v-if="selectedCounts['Opposite Hitter'] > 0"
                class="position-stat"
              >
                <span class="position-name">
                  Opposite Hitters:
                </span>
                <span class="position-count">
                  {{ selectedCounts['Opposite Hitter'] }}
                </span>
              </div>
              <div
                v-if="selectedCounts['Undecided'] > 0"
                class="position-stat"
              >
                <span class="position-name">
                  Undecided:
                </span>
                <span class="position-count">
                  {{ selectedCounts['Undecided'] }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="players-section">
          <h3>
            Available Players
          </h3>

          <div class="players-grid">
            <div
              v-for="player in availablePlayers"
              :key="player.name"
              class="player-selector-wrapper"
              :class="{ 'selected': selectedPlayers.includes(player.name) }"
              @click="togglePlayer(player)"
            >
              <PlayerCard
                :player="player"
                :show-remove="false"
                :show-edit="false"
                :show-team-remove="false"
                :show-selection="true"
                :show-team-number="true"
                :is-selected="selectedPlayers.includes(player.name)"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <Button
          variant="secondary"
          size="md"
          @click="closeModal"
        >
          Cancel
        </Button>

        <Button
          variant="primary"
          size="md"
          @click="createTeam"
          :disabled="!canCreateTeam"
        >
          {{ editingTeam ? 'Update Team' : 'Create Team' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import Button from './Button.vue'
  import PlayerCard from './PlayerCard.vue'
  import { POSITION_CONFIG, sortPlayersByPosition } from '../config/positions.js'

  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false
    },
    players: {
      type: Array,
      default: () => []
    },
    editingTeam: {
      type: Array,
      default: null
    }
  })

  const emit = defineEmits(['close', 'create-team'])

  const selectedPlayers = ref([])

  const availablePlayers = computed(() => {
    let players = []
    if (props.editingTeam) {
      // When editing, include all players (both unassigned and current team players)
      players = props.players
    } else {
      players = props.players.filter(player => !player.teamNumber)
    }
    return sortPlayersByPosition(players)
  })

  // Watch for editing team changes to pre-select players
  watch(() => props.editingTeam, (newEditingTeam) => {
    if (newEditingTeam && props.isOpen) {
      selectedPlayers.value = newEditingTeam.map(player => player.name)
    } else if (!newEditingTeam) {
      selectedPlayers.value = []
    }
  }, { immediate: true })

  // Watch for modal open/close to reset selection when not editing
  watch(() => props.isOpen, (isOpen) => {
    if (isOpen && !props.editingTeam) {
      selectedPlayers.value = []
    }
  })

  const selectedCounts = computed(() => {
    const counts = {}
    POSITION_CONFIG.ORDER.forEach(position => {
      counts[position] = 0
    })

    selectedPlayers.value.forEach(playerName => {
      const player = availablePlayers.value.find(p => p.name === playerName)
      if (player) {
        counts[player.position]++
      }
    })

    return counts
  })

  const canCreateTeam = computed(() => {
    return selectedPlayers.value.length >= 1 // Any number of players can form a team
  })

  function togglePlayer(player) {
    const index = selectedPlayers.value.indexOf(player.name)
    if (index > -1) {
      selectedPlayers.value.splice(index, 1)
    } else {
      selectedPlayers.value.push(player.name)
    }
  }

  function createTeam() {
    if (canCreateTeam.value) {
      const teamPlayers = selectedPlayers.value
        .map(playerName => availablePlayers.value.find(p => p.name === playerName))
        .filter(Boolean)

      emit('create-team', teamPlayers)
      selectedPlayers.value = []
      closeModal()
    }
  }

  function closeModal() {
    selectedPlayers.value = []
    emit('close')
  }
</script>

<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
    padding: var(--space-4);
  }

  .modal-content {
    background-color: var(--bg-card);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-6);
    border-bottom: 1px solid var(--border-light);
  }

  .modal-header h2 {
    margin: 0;
    font-size: var(--text-2xl);
    font-weight: var(--font-semibold);
    color: var(--text-secondary);
  }

  .close-btn {
    width: 2rem;
    height: 2rem;
    border: none;
    background: none;
    font-size: var(--text-xl);
    color: var(--text-muted);
    cursor: pointer;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover {
    background-color: var(--color-gray-100);
  }

  .modal-body {
    flex: 1;
    overflow: hidden;
    padding: var(--space-6);
  }

  .team-requirements {
    margin-bottom: var(--space-1);
  }

  .team-requirements h3 {
    margin: 0 0 var(--space-4) 0;
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--text-secondary);
  }

  .requirements-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-2);
    margin-bottom: var(--space-4);
  }

  .position-breakdown {
    background-color: var(--color-gray-50);
    border-radius: var(--radius-md);
    padding: var(--space-4);
  }

  .position-breakdown h4 {
    margin: 0 0 var(--space-3) 0;
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    color: var(--text-secondary);
  }

  .position-stats {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
  }

  .position-stat {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-2);
    background-color: var(--bg-card);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-light);
  }

  .position-name {
    font-size: var(--text-sm);
    color: var(--text-muted);
  }

  .position-count {
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--color-primary);
  }

  .requirement {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2);
    border-radius: var(--radius-sm);
    background-color: var(--color-gray-50);
    transition: background-color var(--transition-fast);
  }

  .requirement.met {
    background-color: var(--color-success);
    color: var(--color-white);
  }

  .requirement.extra-requirement {
    background-color: var(--color-gray-100);
    color: var(--text-muted);
    border: 1px dashed var(--border-medium);
  }

  .requirement-icon {
    font-weight: var(--font-bold);
    font-size: var(--text-lg);
  }

  .count {
    margin-left: auto;
    font-size: var(--text-sm);
    opacity: 0.8;
  }

  .players-section h3 {
    margin: 0 0 var(--space-4) 0;
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--text-secondary);
  }

  .players-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-2);
    max-height: 230px;
    overflow-y: auto;
  }

  .player-selector-wrapper {
    cursor: pointer;
    transition: all var(--transition-fast);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .player-selector-wrapper:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .player-selector-wrapper.selected {
    box-shadow: 0 0 0 2px var(--color-primary);
    background-color: var(--color-primary-bg);
    border: 1px solid var(--color-primary);
    transform: translateY(-1px);
    margin: 2px;
  }

  .player-selector-wrapper.selected:hover {
    box-shadow: 0 0 0 2px var(--color-primary), var(--shadow-lg);
    background-color: var(--color-primary-hover);
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
    padding: var(--space-6);
    border-top: 1px solid var(--border-light);
  }

  @media (max-width: 768px) {
    .modal-content {
      margin: var(--space-4);
      max-height: 90vh;
    }
    
    .modal-header,
    .modal-body,
    .modal-footer {
      padding: var(--space-4);
    }
    
    .requirements-grid {
      grid-template-columns: 1fr;
    }

    .players-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
