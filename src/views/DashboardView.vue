<script setup>
import { getCurrentWorkout } from "../services/workoutApi";
import { onMounted, inject, ref } from "vue";
import { RouterLink } from "vue-router";

const GlobalStore = inject("GlobalStore");
const currentWorkout = GlobalStore.currentWorkout;

const isLoading = ref(true);

onMounted(async () => {
  try {
    const response = await getCurrentWorkout(GlobalStore.userToken.value);

    GlobalStore.currentWorkout.value = response;
    console.log(response);

    console.log(GlobalStore.currentWorkout.value);
  } catch (error) {
    console.log(error.message);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <main>
    <div class="container">
      <p v-if="isLoading">Chargement en cours ...</p>

      <p v-else-if="!currentWorkout">Aucune séance en cours</p>

      <div v-else>
        <RouterLink :to="{ name: 'current-workout' }">
          <div>
            <p>Reprendre la séance en cours</p>
          </div>
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
