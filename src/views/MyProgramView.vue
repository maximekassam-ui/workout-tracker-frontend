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

    // console.log(userInfos);
    allMyPrograms.value = userInfos.programs.filter(
      (program, index, programs) =>
        index ===
        programs.findIndex((p) => p.documentId === program.documentId),
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
        <div
          v-for="program in allMyPrograms"
          :class="{ isActive: program.is_active === true }"
        >
          <h2>{{ program.name }}</h2>
          <p v-if="program.description">{{ program.description }}</p>
          <p>{{ program.is_active }}</p>
        </div>
      </section>

      <div v-else>
        <h2>Aucun programme créé</h2>
        <RouterLink><div>Créer un programme</div></RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
.isActive {
  border: solid white 2px;
}
</style>
