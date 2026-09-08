<script setup>
import { onMounted, inject, ref } from "vue";
import axios from "axios";

import { getWorkoutHistory } from "../services/api";

const GlobalStore = inject("GlobalStore");
const allWorkoutHistory = ref([]);
const choosenWorkoutId = ref(null);

onMounted(async () => {
  try {
    const response = await getWorkoutHistory(GlobalStore.userToken.value);

    allWorkoutHistory.value = response;

    console.log(allWorkoutHistory.value);
  } catch (error) {
    console.log("catch >>>>", error);
  }
});
</script>

<template>
  <main>
    <section v-if="!allWorkoutHistory">
      <p>Chargement en cours ...</p>
    </section>

    <section v-else>
      <div
        v-for="workout in allWorkoutHistory"
        :key="workout.documentId"
        @click="choosenWorkoutId = workout.documentId"
      >
        <h1>{{ workout.workout_template.name }}</h1>
        <span>{{ new Date(workout.completed_at).toLocaleDateString() }}</span>
        <p>{{ workout.duration }} min</p>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
