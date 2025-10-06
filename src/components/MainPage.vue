<template>
  <div class="app">
    <h1>🏐 Volleyball Queue</h1>

    <div class="form">
      <input v-model="newPlayer.name" placeholder="Player name" />
      <select v-model="newPlayer.position">
        <option disabled value="">Select position</option>
        <option v-for="pos in positions" :key="pos" :value="pos">{{ pos }}</option>
      </select>
      <button @click="addPlayer">Add Player</button>
    </div>

    <h2>Player List</h2>
    <ul>
      <li v-for="(p, i) in players" :key="i">
        {{ p.name }} — {{ p.position }}
        <button @click="removePlayer(i)">x</button>
      </li>
    </ul>

    <button class="shuffle" @click="shuffleTeams">Shuffle Teams</button>

    <div v-if="teams.length">
      <h2>Teams</h2>
      <div v-for="(team, t) in teams" :key="t" class="team">
        <h3>Team {{ t + 1 }}</h3>
        <ul>
          <li v-for="player in team" :key="player.name">
            {{ player.name }} — {{ player.position }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch, onMounted } from 'vue'

  const positions = [
    'Setter',
    'Libero',
    'Middle Blocker',
    'Outside Hitter',
    'Opposite Hitter',
    'Extra'
  ]

  const newPlayer = ref({ name: '', position: '' })
  const players = ref([])
  const teams = ref([])

  // Load saved data
  onMounted(() => {
    const saved = localStorage.getItem('players')
    if (saved) players.value = JSON.parse(saved)
  })

  // Auto-save when players change
  watch(players, (val) => {
    localStorage.setItem('players', JSON.stringify(val))
  }, { deep: true })

  function addPlayer() {
    if (!newPlayer.value.name || !newPlayer.value.position) return
    players.value.push({ ...newPlayer.value })
    newPlayer.value = { name: '', position: '' }
  }

  function removePlayer(i) {
    players.value.splice(i, 1)
  }

  function shuffleTeams() {
    // Clone and shuffle players
    const shuffled = [...players.value].sort(() => Math.random() - 0.5)
    const temp = {
      Setter: [], Libero: [],
      'Middle Blocker': [], 'Outside Hitter': [],
      'Opposite Hitter': [], Extra: []
    }

    // Group by position
    shuffled.forEach(p => temp[p.position].push(p))

    // Create valid teams
    const maxTeams = Math.min(
      temp.Setter.length,
      temp.Libero.length,
      Math.floor(temp['Middle Blocker'].length / 2),
      Math.floor(temp['Outside Hitter'].length / 2),
      temp['Opposite Hitter'].length
    )

    const results = []
    for (let i = 0; i < maxTeams; i++) {
      results.push([
        temp.Setter.pop(),
        temp.Libero.pop(),
        temp['Middle Blocker'].pop(),
        temp['Middle Blocker'].pop(),
        temp['Outside Hitter'].pop(),
        temp['Outside Hitter'].pop(),
        temp['Opposite Hitter'].pop(),
      ].filter(Boolean))
    }

    teams.value = results
  }
</script>

<style scoped>
  .app {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    border-radius: 12px;
    background: #1a1a1a;
    color: #fff;
    font-family: sans-serif;
  }

  .form {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  input,
  select,
  button {
    padding: 8px;
  }

  button.shuffle {
    margin-top: 10px;
    padding: 10px;
    background: #ffcc00;
    border: none;
    cursor: pointer;
  }

  .team {
    margin-top: 10px;
    background: #333;
    padding: 10px;
    border-radius: 8px;
  }
</style>
