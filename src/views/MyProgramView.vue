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
          <p>{{ program.is_active }}</p>
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
.isActive {
  border: solid white 2px;
}
</style>
