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
        <h2>Edit Player</h2>
        <Button
          variant="secondary"
          size="md"
          @click="closeModal"
        >
          Close
        </Button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label for="playerName">Name</label>
          <input
            id="playerName"
            v-model="editedPlayer.name"
            type="text"
            class="input"
            placeholder="Enter player name"
          />
        </div>

        <div class="form-group">
          <label for="playerPosition">Position</label>
          <select
            id="playerPosition"
            v-model="editedPlayer.position"
            class="input"
          >
            <option
              v-for="position in POSITION_CONFIG.ORDER"
              :key="position"
              :value="position"
            >
              {{ position }}
            </option>
            <option value="Undecided">Undecided</option>
          </select>
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
          @click="saveChanges"
          :disabled="!editedPlayer.name"
        >
          Save
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import Button from './Button.vue'
  import { POSITION_CONFIG } from '../config/positions.js'

  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false
    },
    player: {
      type: Object,
      required: false
    },
  })

  const emit = defineEmits(['close', 'save'])

  const editedPlayer = ref({
    name: '',
    position: 'Undecided',
  })

  watch(() => props.isOpen, (open) => {
    if (open && props.player) {
      editedPlayer.value = {
        name: props.player.name,
        position: props.player.position || 'Undecided',
      }
    }
  })

  function saveChanges() {
    emit('save', { ...props.player, ...editedPlayer.value })
    closeModal()
  }

  function closeModal() {
    emit('close')
  }
</script>

<style scoped>
  .modal-overlay {
    position: fixed;
    inset: 0;
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
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
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
    padding: var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  label {
    margin-bottom: var(--space-1);
    font-weight: var(--font-medium);
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  .input {
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--border-medium);
    border-radius: var(--radius-md);
    font-size: var(--text-base);
    background-color: var(--bg-input);
    color: var(--text-primary);
  }

  .input:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
    padding: var(--space-6);
    border-top: 1px solid var(--border-light);
  }
</style>
