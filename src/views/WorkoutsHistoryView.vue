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

const handleWorkoutClick = (workout) => {
  if (choosenWorkoutId.value === workout.documentId) {
    choosenWorkoutId.value = null;
  } else {
    choosenWorkoutId.value = workout.documentId;
  }
};
</script>

<template>
  <main class="container">
    <section v-if="!allWorkoutHistory">
      <p>Chargement en cours ...</p>
    </section>

    <section v-else>
      <div
        v-for="workout in allWorkoutHistory"
        :key="workout.documentId"
        @click="handleWorkoutClick(workout)"
        id="workout"
      >
        <h1>{{ workout.workout_template.name }}</h1>
        <span>{{ new Date(workout.completed_at).toLocaleDateString() }}</span>
        <p>{{ workout.duration }} min</p>

        <div v-if="choosenWorkoutId === workout.documentId">
          <div v-for="workout_exercises in workout.workout_exercises">
            <h3>{{ workout_exercises.exercise.name }}</h3>
            <h4 v-if="workout_exercises.sets.length > 0">
              {{ workout_exercises.sets.length }} sets
            </h4>

            <div v-if="workout_exercises.sets.length > 0">
              <div v-for="sets in workout_exercises.sets">
                <p>
                  Serie n°{{ sets.set_number }} : {{ sets.reps }} reps à
                  {{ sets.load }} kg
                </p>
              </div>
            </div>

            <p v-else>Aucune série enregistrée</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped></style>
