<template>
  <div
    class="player-card"
    :class="[
      getPositionClass(player.position),
      { 'player-assigned': player.teamNumber && showTeamNumber }
    ]"
  >
    <div class="player-info">
      <div class="player-name">
        {{ player.name }}
        <span
          v-if="player.teamNumber && showTeamNumber"
          class="team-number"
        >
          (Team {{ player.teamNumber }})
        </span>
      </div>
      <div class="player-position">
        {{ player.position }}
      </div>
    </div>
    <div class="player-actions">
      <Button
        v-if="showEdit"
        variant="secondary"
        size="sm"
        @click="$emit('edit')"
      >
        Edit
      </Button>
      <Button
        v-if="showRemove"
        variant="danger"
        size="sm"
        @click="$emit('remove')"
      >
        Remove
      </Button>
      <Button
        v-if="showTeamRemove"
        variant="danger"
        size="sm"
        @click="$emit('remove-from-team')"
      >
        Remove
      </Button>
    </div>
    <!-- <Button
      v-if="showEdit"
      variant="secondary"
      size="sm"
      @click="$emit('edit')"
    >
      Edit
    </Button>
    <Button
      v-if="showRemove"
      variant="danger"
      size="sm"
      @click="$emit('remove')"
    >
      Remove
    </Button>
    
    <Button
      v-if="showTeamRemove"
      variant="danger"
      size="sm"
      @click="$emit('remove-from-team')"
    >
      Remove
    </Button> -->

    <div
      v-if="showSelection"
      class="selection-indicator"
    >
      {{ isSelected ? '✓' : '○' }}
    </div>
  </div>
</template>

<script setup>
  import Button from './Button.vue'
  import { getPositionClass } from '../config/positions.js'

  defineProps({
    player: {
      type: Object,
      required: true
    },
    showRemove: {
      type: Boolean,
      default: true
    },
    showEdit: {
      type: Boolean,
      default: true
    },
    showTeamRemove: {
      type: Boolean,
      default: false
    },
    showSelection: {
      type: Boolean,
      default: false
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    showTeamNumber: {
      type: Boolean,
      default: false
    }
  })

  defineEmits(['remove', 'remove-from-team', 'edit'])

</script>

<style scoped>
  .player-card {
    position: relative;
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

  .player-card.player-assigned .player-info {
    opacity: 0.4;
  }

  .player-info {
    flex: 1;
  }

  .player-name {
    font-weight: var(--font-medium);
    color: var(--text-primary);
    margin-bottom: var(--space-1);
  }

  .team-number {
    font-size: var(--text-sm);
    color: var(--color-primary);
    font-weight: var(--font-semibold);
    margin-left: var(--space-1);
  }

  .player-position {
    font-size: var(--text-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: var(--font-medium);
  }


  .remove-team-btn {
    position: absolute;
    top: var(--space-1);
    right: var(--space-1);
    width: 1.25rem;
    height: 1.25rem;
    border: none;
    background-color: var(--color-danger-bg);
    color: var(--color-danger);
    border-radius: var(--radius-full);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--transition-fast);
    z-index: 10;
  }

  .remove-team-btn:hover {
    background-color: var(--color-danger-hover);
  }


  .selection-indicator {
    font-size: var(--text-lg);
    font-weight: var(--font-bold);
    color: var(--text-muted);
    transition: color var(--transition-fast);
  }

  .player-actions {
    display: flex;
    gap: var(--space-2); /* Add spacing between buttons */
    align-items: center;
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

  .position-undecided {
    background-color: var(--position-extra-bg);
    color: var(--position-extra-text);
  }
</style>
