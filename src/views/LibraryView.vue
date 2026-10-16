<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <main>
    <div class="container">
      <h1>Bibliothèque</h1>
      <p>Explore les ressources pour construire ton entrainement.</p>
      <section id="libraryGrid">
        <RouterLink :to="{ name: 'program-types' }" class="libraryCard">
          <div>
            <font-awesome-icon :icon="['fas', 'clipboard-list']" />
            <h2>Programmes</h2>
          </div>

          <p>Découvrir les organisations d'entrainement.</p>
        </RouterLink>

        <RouterLink :to="{ name: 'workout-types' }" class="libraryCard">
          <div>
            <font-awesome-icon :icon="['fas', 'tasks']" />
            <h2>Séances types</h2>
          </div>

          <p>Explorer les différents types de séances.</p>
        </RouterLink>

        <RouterLink :to="{ name: 'muscles-list' }" class="libraryCard">
          <div>
            <font-awesome-icon :icon="['far', 'heart']" />
            <h2>Muscles</h2>
          </div>

          <p>Comprendre les groupes musculaires.</p>
        </RouterLink>

        <RouterLink :to="{ name: 'exercises-list' }" class="libraryCard">
          <div>
            <font-awesome-icon :icon="['fas', 'dumbbell']" />
            <h2>Exercices</h2>
          </div>

          <p>Consulter les exercices disponibles</p>
        </RouterLink>
      </section>
    </div>
  </main>
</template>

<style scoped>
#libraryGrid {
  margin-top: 50px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}
.libraryCard {
  background-color: var(--bgc-secondary);
  border: solid 1px var(--accent-border);
  border-radius: 10px;
  padding: 20px;
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
}
.libraryCard:hover {
  border-color: var(--purple-accent);
  transform: translateY(-2px);
}

.libraryCard > div {
  display: flex;
  gap: 10px;
}

svg {
  color: var(--purple-accent);
  font-size: 25px;
}

/* Media Query --------- */

@media (max-width: 1025px) {
  main {
    padding: 30px;
  }
}
@media (max-width: 840px) {
  #libraryGrid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 430px) {
  h2 {
    font-size: 16px;
  }
  svg {
    font-size: 20px;
  }
  a p {
    font-size: 12px;
  }
}
</style>
