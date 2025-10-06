<template>
  <div class="team-card">
    <div class="team-header">
      <h3>
        Team {{ teamNumber }}
      </h3>
      <div class="team-size">
        {{ players.length }} players
      </div>
    </div>

    <div class="team-players">
      <PlayerCard
        v-for="player in players"
        :key="player.name"
        :player="player"
        :show-remove="false"
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
    grid-template-columns: 1fr 1fr;
    gap: var(--space-1);
  }

  @media (max-width: 768px) {
    .team-players {
      grid-template-columns: 1fr;
    }
  }
</style>
