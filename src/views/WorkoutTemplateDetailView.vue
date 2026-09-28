<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref, inject } from "vue";
import { getWorkoutTemplate, getExercises } from "../services/api";

const route = useRoute();
console.log(route.params);
const GlobalStore = inject("GlobalStore");
const workoutTemplate = ref(null);
const exercisesList = ref([]);
const isAddingExercise = ref(false);

onMounted(async () => {
  try {
    const { data } = await getWorkoutTemplate(
      route.params.workoutTemplateDocumentId,
      GlobalStore.userToken.value,
    );

    // console.log(data);
    workoutTemplate.value = data;

    const result = await getExercises(GlobalStore.userToken.value);

    exercisesList.value = result.data;

    console.log(exercisesList.value);
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <main>
    <div class="container">
      <p v-if="!workoutTemplate">Chargement en cours..</p>
      <section v-else>
        <div>
          <h1>{{ workoutTemplate.name }}</h1>
          <h3>{{ workoutTemplate.category }}</h3>
          <p>{{ workoutTemplate.description }}</p>
          <p v-if="workoutTemplate.program_exercises.length > 0">
            {{ workoutTemplate.program_exercises.length }}
            {{
              workoutTemplate.program_exercises.length > 1
                ? "exercices"
                : "exercice"
            }}
          </p>
        </div>

        <div
          class="exerciseCard"
          v-for="exercise in workoutTemplate.program_exercises"
        >
          <h2>{{ exercise.exercise.name }}</h2>
          <div>
            <p>
              {{ exercise.target_sets }}
              {{ exercise.target_sets > 1 ? "séries" : "série" }}
              <font-awesome-icon :icon="['fas', 'circle']" />
              {{ exercise.target_reps_min }} -

              {{ exercise.target_reps_max }} reps
              <font-awesome-icon :icon="['fas', 'circle']" />

              {{ exercise.target_load }} kg
            </p>
          </div>
        </div>

        <button @click="isAddingExercise = true">+ Ajouter un exercice</button>

        <section v-if="isAddingExercise">
          <div v-for="exercisesList in exercisesList">
            <h3>{{ exercisesList.name }}</h3>
          </div>
        </section>
      </section>
    </div>
  </main>
</template>

<style scoped>
.exerciseCard svg {
  color: var(--main-text);
  font-size: 4px;
}
</style>
