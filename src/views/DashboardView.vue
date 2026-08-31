<script setup>
import { getCurrentWorkout } from "../services/api";
import { onMounted, inject, ref } from "vue";
import { RouterLink } from "vue-router";

const GlobalStore = inject("GlobalStore");
const currentWorkout = GlobalStore.currentWorkout;

onMounted(async () => {
  try {
    const response = await getCurrentWorkout(GlobalStore.userToken.value);

    GlobalStore.currentWorkout.value = response;
  } catch (error) {
    console.log(error.message);
  }
});
</script>

<template>
  <main>
    <p v-if="!GlobalStore.currentWorkout">Chargement en cours ...</p>
    <div v-else>
      <p v-if="!currentWorkout">Aucune séance en cours</p>

      <div v-else>
        <RouterLink :to="{ name: 'current-workout' }"
          ><div><p>Reprendre la séance en cours</p></div></RouterLink
        >
      </div>
    </div>
  </main>
</template>

<style scoped></style>
