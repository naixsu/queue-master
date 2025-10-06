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
        <Button
          variant="primary"
          size="sm"
          @click="$emit('edit-team')"
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          @click="$emit('remove-team')"
        >
          Remove
        </Button>
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
  import Button from './Button.vue'

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

  defineEmits(['remove-team', 'remove-player', 'edit-team'])
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
