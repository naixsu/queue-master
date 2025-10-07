<template>
  <div
    v-if="isOpen"
    class="modal-overlay"
    @click="$emit('close')"
  >
    <div
      class="help-modal"
      @click.stop
    >
      <div class="help-header">
        <h2>
          🏐 How to Use Volleyball Team Manager
        </h2>
        <Button
          variant="secondary"
          size="md"
          @click="$emit('close')"
        >
          Close
        </Button>
      </div>

      <div class="help-content">
        <div class="help-section">
          <h3>
            What is this?
          </h3>
          <p>
            This app helps you create balanced volleyball teams quickly and easily. No more guessing who should play where!
          </p>
        </div>

        <div class="help-section">
          <h3>
            Quick Start:
          </h3>
          <ol>
            <li>
              <strong>Add Players:</strong> Enter names and optionally pick positions (or leave as "Undecided")
            </li>
            <li>
              <strong>Create Teams:</strong> Click "Shuffle Teams" for automatic balancing, or "Manual Team Creation" to pick players yourself
            </li>
            <li>
              <strong>Manage Teams:</strong> Edit teams, remove players, or delete entire teams as needed
            </li>
          </ol>
        </div>

        <div class="help-section">
          <h3>
            Flexible Team Creation:
          </h3>
          <ul>
            <li><strong>Any number of players</strong> can form teams (minimum 2 players)</li>
            <li><strong>Positions are optional</strong> - players can be "Undecided" or have specific roles</li>
            <li><strong>Smart distribution:</strong> Players with specific positions are prioritized and distributed evenly across teams</li>
            <li><strong>Undecided players</strong> fill remaining spots in teams</li>
          </ul>
        </div>

        <div class="help-section">
          <h3>
            Volleyball Positions (Optional):
          </h3>
          <ul>
            <li v-for="position in POSITION_CONFIG.ORDER" :key="position">
              <strong>{{ position }}:</strong> {{ getPositionDescription(position) }}
            </li>
          </ul>
        </div>

        <div class="help-section">
          <h3>
            Pro Tips:
          </h3>
          <ul>
            <li>You only need 2 players to create teams</li>
            <li>Players with specific positions will be distributed evenly across teams</li>
            <li>Click "Edit" on any team to modify its players</li>
            <li>Everything saves automatically - no need to worry about losing your teams!</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import Button from './Button.vue'
  import { POSITION_CONFIG, getPositionDescription } from '../config/positions.js'

  defineProps({
    isOpen: {
      type: Boolean,
      default: false
    }
  })

  defineEmits(['close'])
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

  .help-modal {
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

  .help-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-6);
    border-bottom: 1px solid var(--border-light);
  }

  .help-header h2 {
    margin: 0;
    font-size: var(--text-2xl);
    font-weight: var(--font-semibold);
    color: var(--text-secondary);
  }

  .help-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-6);
  }

  .help-section {
    margin-bottom: var(--space-6);
  }

  .help-section:last-child {
    margin-bottom: 0;
  }

  .help-section h3 {
    margin: 0 0 var(--space-3) 0;
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--text-secondary);
  }

  .help-section p {
    margin: 0 0 var(--space-2) 0;
    color: var(--text-primary);
    line-height: 1.6;
  }

  .help-section ol,
  .help-section ul {
    margin: 0;
    padding-left: var(--space-6);
    color: var(--text-primary);
  }

  .help-section li {
    margin-bottom: var(--space-2);
    line-height: 1.5;
  }

  .help-section strong {
    color: var(--text-secondary);
    font-weight: var(--font-semibold);
  }

  @media (max-width: 768px) {
    .help-modal {
      margin: var(--space-4);
      max-height: 90vh;
    }
    
    .help-header,
    .help-content {
      padding: var(--space-4);
    }
  }
</style>
