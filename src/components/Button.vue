<template>
  <button
    :class="buttonClass"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'success', 'danger', 'secondary'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    }
  })

  defineEmits(['click'])

  const buttonClass = computed(() => {
    return [
      'btn',
      `btn-${props.variant}`,
      `btn-${props.size}`
    ]
  })
</script>

<style scoped>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: var(--radius-md);
    font-weight: var(--font-medium);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-decoration: none;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Variants */
  .btn-primary {
    background-color: var(--color-primary);
    color: var(--color-white);
  }

  .btn-primary:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
  }

  .btn-success {
    background-color: var(--color-success);
    color: var(--color-white);
  }

  .btn-success:hover:not(:disabled) {
    background-color: var(--color-success-hover);
  }

  .btn-danger {
    background-color: var(--color-danger-bg);
    color: var(--color-danger);
    border: 1px solid var(--color-danger-bg);
  }

  .btn-danger:hover:not(:disabled) {
    background-color: var(--color-danger-hover);
  }

  .btn-secondary {
    background-color: var(--color-gray-100);
    color: var(--color-gray-700);
    border: 1px solid var(--border-medium);
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: var(--color-gray-200);
  }

  /* Sizes */
  .btn-sm {
    padding: var(--space-1) var(--space-3);
    font-size: var(--text-sm);
    gap: var(--space-1);
  }

  .btn-md {
    padding: var(--space-2) var(--space-4);
    font-size: var(--text-base);
    gap: var(--space-2);
  }

  .btn-lg {
    padding: var(--space-3) var(--space-6);
    font-size: var(--text-lg);
    gap: var(--space-2);
  }
</style>
