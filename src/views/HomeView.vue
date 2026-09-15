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
      </section>

      <section id="quickAccess">
        <RouterLink>
          <font-awesome-icon :icon="['fas', 'plus-circle']" />

          <h4>Créer un programme</h4>
          <p>Construis ton programme et organise tes séances</p></RouterLink
        >

        <RouterLink>
          <font-awesome-icon :icon="['fas', 'clipboard-list']" />

          <h4>Mon programme</h4>
          <p>Consulte ton programme et retrouve tes séances</p></RouterLink
        >

        <RouterLink>
          <font-awesome-icon :icon="['fas', 'arrow-alt-circle-up']" />

          <h4>Mes progrès</h4>
          <p>Suis ton évolution et tes performances</p></RouterLink
        >

        <RouterLink>
          <font-awesome-icon :icon="['fas', 'dumbbell']" />

          <h4>Mes exercices</h4>
          <p>Explore les exercices et les muscles ciblés</p></RouterLink
        >

        <RouterLink>
          <font-awesome-icon :icon="['fas', 'chart-bar']" />

          <h4>Mes statistiques</h4>
          <p>Analyse tes performances et tes entraînements</p>
        </RouterLink>

        <RouterLink>
          <font-awesome-icon :icon="['fas', 'bullseye']" />

          <h4>Mes objectifs</h4>
          <p>Fixe tes objectifs et suis ta progression</p></RouterLink
        >
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
  height: 500px;
  max-width: 1050px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  background-image: url("../assets/imgs/Photo background WT.png");
  background-size: cover;
  background-position: top;
  margin-bottom: 50px;
}

#hero a {
  align-self: center;
  margin-top: 30px;
  color: var(--main-bg);
  font-weight: bold;
  font-size: 18px;
  background-color: var(--purple-accent);
  min-width: fit-content;
  padding: 5px 10px;
  border-radius: 7px;
  font-size: 17px;
  box-shadow: 0 0 10px 5px var(--main-text);
  transition: 0.3s;
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
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#quickAccess svg {
  color: var(--purple-accent);
  font-size: 40px;
}

#quickAccess a:hover {
  background-color: #8b5cf6;
  border: solid 2px #8b5cf6;
  transform: translateY(-2px);
}
#quickAccess h4 {
  color: var(--main-text);
  font-size: 20px;
}

#quickAccess a:hover p,
#quickAccess a:hover svg {
  color: var(--main-bg);
}

/* Media Query ------------------ */

@media (max-width: 1050px) {
  #quickAccess {
    grid-template-columns: auto auto;
  }
}

@media (max-width: 800px) {
  h1 {
    font-size: 28px;
  }

  h2 {
    font-size: 16px;
  }

  #hero {
    max-height: 500px;
    background-size: contain;
    background-repeat: no-repeat;
  }
}

@media (max-width: 700px) {
  #hero a {
    margin-top: 90px;
    font-size: 14px;
  }
}
@media (max-width: 500px) {
  main {
    padding: 5px;
  }
  #hero {
    height: 250px;
    margin-bottom: 0;
  }
  #hero a {
    margin-top: 50px;
    font-size: 10px;
    padding: 3px 3px;
  }
  #quickAccess {
    grid-template-columns: auto;
  }
  h1 {
    font-size: 16px;
    margin-bottom: 20px;
  }
  h2 {
    font-size: 8px;
  }
}
</style>
