<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <main>
    <div class="container">
      <section id="hero">
        <h1>Prêt pour ta prochaine séance ?</h1>
        <h2>
          Suis tes performances, garde un historique de tes séances et progresse
          à chaque entraînement.
        </h2>

        <RouterLink :to="{ name: 'dashboard' }">
          Commencer une séance</RouterLink
        >

        <img
          src="../assets/imgs/Raptor Workout Tracker.png"
          alt="Fond d'écran s'inspirant du logo"
        />
      </section>

      <section id="quickAccess">
        <RouterLink>Créer un programme</RouterLink>

        <RouterLink>Mon programme</RouterLink>

        <RouterLink>Mes progrès</RouterLink>

        <RouterLink>Mes exercices</RouterLink>

        <RouterLink>Mes statistiques</RouterLink>

        <RouterLink>Mes objectifs</RouterLink>
      </section>
    </div>
  </main>
</template>

<style scoped>
h1,
h2 {
  margin-bottom: 45px;
}

#hero {
  display: flex;
  flex-direction: column;
}

#hero a {
  align-self: center;
  color: var(--main-bg);
  font-weight: bold;
  font-size: 18px;
  background-color: var(--purple-accent);
  min-width: fit-content;
  padding: 5px 10px;
  border-radius: 7px;
  font-size: 17px;
  border: solid 1px var(--main-bg);
  transition: 0.3s;
}

#hero img {
  height: 150px;
  width: 150px;
  object-fit: cover;
  align-self: center;
}

/* --------------------- */

#quickAccess {
  display: grid;
  justify-content: center;
  grid-template-columns: auto auto auto;
  gap: 50px;
}

#quickAccess a {
  height: 250px;
  width: 250px;
  /* border: solid white 2px; */
  border-radius: 15px;
  padding: 20px;
  background-color: #161b22;
  transition: 0.8s;
}

#quickAccess a:hover {
  background-color: #8b5cf6;
  border: solid 2px #8b5cf6;
  transform: translateY(-2px);
}
</style>
