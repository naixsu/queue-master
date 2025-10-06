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
            Team Requirements
          </h3>

          <div class="requirements-grid">
            <div
              class="requirement"
              :class="{ 'met': selectedCounts['Setter'] >= 1 }"
            >
              <span class="requirement-icon">
                {{ selectedCounts['Setter'] >= 1 ? '✓' : '○' }}
              </span>
              <span>
                1 Setter
              </span>
              <span class="count">
                ({{ selectedCounts['Setter'] }}/1)
              </span>
            </div>

            <div
              class="requirement"
              :class="{ 'met': selectedCounts['Libero'] >= 1 }"
            >
              <span class="requirement-icon">
                {{ selectedCounts['Libero'] >= 1 ? '✓' : '○' }}
              </span>
              <span>
                1 Libero
              </span>
              <span class="count">
                ({{ selectedCounts['Libero'] }}/1)
              </span>
            </div>

            <div
              class="requirement"
              :class="{ 'met': selectedCounts['Middle Blocker'] >= 2 }"
            >
              <span class="requirement-icon">
                {{ selectedCounts['Middle Blocker'] >= 2 ? '✓' : '○' }}
              </span>
              <span>
                2 Middle Blockers
              </span>
              <span class="count">
                ({{ selectedCounts['Middle Blocker'] }}/2)
              </span>
            </div>

            <div
              class="requirement"
              :class="{ 'met': selectedCounts['Outside Hitter'] >= 2 }"
            >
              <span class="requirement-icon">
                {{ selectedCounts['Outside Hitter'] >= 2 ? '✓' : '○' }}
              </span>
              <span>
                2 Outside Hitters
              </span>
              <span class="count">
                ({{ selectedCounts['Outside Hitter'] }}/2)
              </span>
            </div>

            <div
              class="requirement"
              :class="{ 'met': selectedCounts['Opposite Hitter'] >= 1 }"
            >
              <span class="requirement-icon">
                {{ selectedCounts['Opposite Hitter'] >= 1 ? '✓' : '○' }}
              </span>
              <span>
                1 Opposite Hitter
              </span>
              <span class="count">
                ({{ selectedCounts['Opposite Hitter'] }}/1)
              </span>
            </div>

            <div class="requirement extra-requirement">
              <span class="requirement-icon">
                +
              </span>
              <span>
                Extra Players (Optional)
              </span>
              <span class="count">
                ({{ selectedCounts['Extra'] }})
              </span>
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
                :show-team-remove="false"
                :show-selection="true"
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
    if (props.editingTeam) {
      // When editing, include all players (both unassigned and current team players)
      return props.players
    }
    return props.players.filter(player => !player.teamNumber)
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
    const counts = {
      'Setter': 0,
      'Libero': 0,
      'Middle Blocker': 0,
      'Outside Hitter': 0,
      'Opposite Hitter': 0,
      'Extra': 0
    }

    selectedPlayers.value.forEach(playerName => {
      const player = availablePlayers.value.find(p => p.name === playerName)
      if (player) {
        counts[player.position]++
      }
    })

    return counts
  })

  const canCreateTeam = computed(() => {
    return (
      selectedCounts.value['Setter'] >= 1 &&
      selectedCounts.value['Libero'] >= 1 &&
      selectedCounts.value['Middle Blocker'] >= 2 &&
      selectedCounts.value['Outside Hitter'] >= 2 &&
      selectedCounts.value['Opposite Hitter'] >= 1
    )
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
    overflow-y: auto;
    padding: var(--space-6);
  }

  .team-requirements {
    margin-bottom: var(--space-6);
  }

  .team-requirements h3 {
    margin: 0 0 var(--space-4) 0;
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--text-secondary);
  }

  .requirements-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2);
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
    gap: var(--space-2);
    max-height: 400px;
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
  }

  .player-selector-wrapper.selected:first-child {
    margin-top: 5px;
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
  }
</style>
