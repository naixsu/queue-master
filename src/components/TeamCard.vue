<template>
  <div class="team-card">
    <div class="team-header">
      <h3>
        Team {{ teamNumber }}
      </h3>
      <div class="team-actions">
        <div class="team-size">
          {{ players.length }} players
        </div>
        <button
          class="remove-team-btn"
          @click="$emit('remove-team')"
          title="Remove entire team"
        >
          <span class="remove-icon">×</span>
        </button>
      </div>
    </div>

    <div class="team-players">
      <PlayerCard
        v-for="player in players"
        :key="player.name"
        :player="player"
        :show-remove="false"
        :show-team-remove="true"
        @remove-from-team="$emit('remove-player', player)"
      />
    </div>
  </div>
</template>

<script setup>
  import PlayerCard from './PlayerCard.vue'

  defineProps({
    teamNumber: {
      type: Number,
      required: true
    },
    players: {
      type: Array,
      required: true,
      default: () => []
    }
  })

  defineEmits(['remove-team', 'remove-player'])
</script>

<style scoped>
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

  .team-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .team-size {
    font-size: var(--text-sm);
    color: var(--color-gray-500);
    background-color: var(--color-gray-100);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    font-weight: var(--font-medium);
  }

  .remove-team-btn {
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

  .remove-team-btn:hover {
    background-color: var(--color-danger-hover);
  }

  .team-players {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-1);
  }


  .remove-icon {
    font-size: var(--text-sm);
    font-weight: var(--font-bold);
  }

  @media (max-width: 768px) {
    .team-players {
      grid-template-columns: 1fr;
    }
  }
</style>
