<template>
  <button
    class="shuffle-btn"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <span class="btn-content">
      Shuffle Teams
    </span>
    <span class="btn-subtitle">
      (Need at least 7 players)
    </span>
  </button>
</template>

<script setup>
  defineProps({
    disabled: {
      type: Boolean,
      default: false
    }
  })

  defineEmits(['click'])
</script>

<style scoped>
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

  .btn-content {
    font-size: var(--text-base);
    font-weight: var(--font-medium);
  }

  .btn-subtitle {
    font-size: var(--text-sm);
    opacity: 0.8;
    font-weight: var(--font-normal);
  }
</style>
