<script setup>
import { inject, onMounted } from "vue";
import { getCurrentWorkout } from "../services/api";

const GlobalStore = inject("GlobalStore");
const currentWorkout = GlobalStore.currentWorkout;

onMounted(async () => {
  try {
    const response = await getCurrentWorkout(GlobalStore.userToken.value);

    GlobalStore.currentWorkout.value = response;
    console.log(response);
  } catch (error) {
    console.log(error.message);
  }
});
</script>

<template>
  <main>
    <h1>Séance en cours 💪</h1>
    <p v-if="!currentWorkout">Chargement de la séance...</p>
    <div v-else>
      <h2>
        Exercice : {{ currentWorkout.pendingWorkoutExercise.exercise.name }}
      </h2>
      <p>
        Sets :
        {{ currentWorkout.pendingWorkoutExercise.program_exercise.target_sets }}
      </p>

      <div
        v-for="Sets in currentWorkout.pendingWorkoutExercise.sets"
        :class="{ completed: Sets.completed === true }"
      >
        <p>Série n°{{ Sets.set_number }} :</p>
        <p>{{ Sets.reps }} répétitions</p>
        <p>Avec un poids de {{ Sets.load }} kg</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.completed {
  color: green;
}
</style>
