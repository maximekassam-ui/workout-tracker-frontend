<script setup>
import { inject } from "vue";
import { RouterLink } from "vue-router";

const GlobalStore = inject("GlobalStore");

console.log(GlobalStore.userToken.value);
</script>

<template>
  <header>
    <div class="container">
      <section id="workoutTrackerLogo">
        <img
          src="../assets/imgs/Raptor Workout Tracker.png"
          alt="logo du site Workout Tracker"
        />
      </section>

      <section id="navSection">
        <RouterLink :to="{ name: 'home' }"> <p>Accueil</p></RouterLink>

        <RouterLink :to="{ name: 'dashboard' }"> <p>Programme</p></RouterLink>

        <RouterLink :to="{ name: 'workouts-history' }">
          <p>Historique</p></RouterLink
        >
      </section>

      <section id="profilSection">
        <div id="svgDiv" v-if="GlobalStore.userToken.value">
          <font-awesome-icon :icon="['fas', 'user']" />
          <font-awesome-icon :icon="['fas', 'sign-out-alt']" id="logOut" />
        </div>

        <RouterLink :to="{ name: 'login' }" v-else>
          <div><p>Se connecter</p></div></RouterLink
        >
      </section>
    </div>
  </header>
</template>

<style scoped>
a {
  background: none;
}

header {
  background-color: var(--main-bg);
  height: var(--header-height);
  border-bottom: solid 1px var(--purple-accent);
}

#navSection .router-link-active {
  box-shadow: 0 0 10px var(--purple-accent);
  font-weight: 600;
  transform: translateY(-2px);
  transition: 0.3s;
}

#navSection .router-link-active > p {
  color: var(--purple-accent);
}

header > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#workoutTrackerLogo {
  font-size: 30px;
  font-weight: bold;
  flex: 1;
  color: var(--purple-accent);
  display: flex;
  justify-content: flex-start;
}

img {
  height: 98px;
  width: 100px;
  object-fit: cover;
}

/* ----------------------------- */

#navSection {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex: 1;
}

#navSection a {
  transition: 0.3s;
}

#navSection a:hover:not(.router-link-active) {
  transform: translateY(-2px);
  font-weight: 600;
}

#navSection a:hover p {
  color: var(--purple-accent);
}

#navSection p {
  color: var(--main-text);
  transition: 0.3s;
}

/* ----------------------------- */

#profilSection {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

#profilSection a div {
  background-color: var(--purple-accent);
  min-width: fit-content;
  padding: 5px 10px;
  border-radius: 7px;
  font-size: 17px;
  border: solid 1px var(--main-bg);
  transition: 0.3s;
}

#profilSection div:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 10px var(--purple-accent);
  background-color: #8f6cf7;
}

#profilSection p {
  color: var(--main-bg);
  font-weight: 600;
}

#svgDiv {
  margin-right: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

svg {
  color: var(--purple-accent);
  font-size: 27px;
}
#logOut {
  font-size: 20px;
}
</style>
