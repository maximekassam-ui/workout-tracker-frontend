<script setup>
import { onMounted, ref, inject } from "vue";
import { RouterLink } from "vue-router";

import { getCurrentUser } from "../services/api";

const GlobalStore = inject("GlobalStore");

const allMyPrograms = ref([]);

const loadUserInfos = async () => {
  try {
    const currentUser = await getCurrentUser(GlobalStore.userToken.value);
    return currentUser;
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  try {
    const userInfos = await loadUserInfos();

    console.log(userInfos);
    allMyPrograms.value = userInfos.programs.filter(
      (program, index, programs) =>
        index ===
        programs.findIndex((p) => p.documentId === program.documentId),
      // evite les doublon de programme
    );

    console.log(allMyPrograms.value);
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <main>
    <div class="container">
      <h1>Mes programmes</h1>
      <section v-if="allMyPrograms.length > 0">
        <RouterLink
          v-for="program in allMyPrograms"
          :class="{ isActive: program.is_active === true }"
          :to="{
            name: 'program-detail',
            params: { documentId: program.documentId },
          }"
        >
          <div>
            <h2>{{ program.name }}</h2>
            <span v-if="program.is_active === true">Actif</span>
            <span v-else>Inactif</span>
          </div>

          <p v-if="program.description">{{ program.description }}</p>

          <p v-if="program.workout_templates.length > 0">
            {{ program.workout_templates.length }}
            {{ program.workout_templates.length > 1 ? "séances" : "séance" }}
          </p>
        </RouterLink>
      </section>

      <div v-else>
        <h2>Aucun programme créé</h2>
        <RouterLink :to="{ name: 'create-program' }"
          ><div>Créer un programme</div></RouterLink
        >
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  padding: 30px;
}

.container > h1 {
  margin: 0 0 80px;
  font-size: 2.5rem;
  text-align: center;
}

.container > section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.container > section > a {
  min-height: 200px;
  padding: 25px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  border: 1px solid var(--secondary-text);
  border-radius: 15px;

  color: var(--main-text);
  text-decoration: none;

  transition: 0.2s;
}

.container > section > a:hover {
  transform: translateY(-3px);
  border-color: var(--purple-accent);
}

/* Programme actif --------- */

.container > section > a.isActive {
  border: 2px solid var(--purple-accent);
}

.container > section > a > div {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.container > section h2 {
  margin: 0;
  font-size: 1.5rem;
}

.container > section span {
  padding: 6px 12px;
  border: 1px solid var(--purple-accent);
  border-radius: 20px;

  font-size: 0.85rem;
}

.container > section > a > p {
  margin: 20px 0 0;

  color: var(--secondary-text);
  line-height: 1.5;
}

/* Aucun programme ---------- */

.container > div:last-child {
  min-height: 300px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 20px;

  text-align: center;
}

.container > div:last-child h2 {
  margin: 0;
}

.container > div:last-child a {
  padding: 10px 20px;

  border: 1px solid var(--purple-accent);
  border-radius: 10px;

  color: var(--main-text);
  text-decoration: none;

  transition: 0.2s;
}

.container > div:last-child a:hover {
  background-color: var(--purple-accent);
}

/* Media Query ------------------ */

@media (max-width: 700px) {
  .container > section {
    grid-template-columns: 1fr;
  }

  .container > section > a > div {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
