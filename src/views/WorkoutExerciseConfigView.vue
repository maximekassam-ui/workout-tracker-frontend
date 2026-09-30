<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, inject } from "vue";
import {
  getExercise,
  getWorkoutTemplate,
  createProgramExercise,
} from "../services/api";

const route = useRoute();
// console.log(route.params); pour avoir les ID en params de workoutTemplate
const router = useRouter();

const GlobalStore = inject("GlobalStore");

const exercise = ref(null);
const numOfSets = ref(0);
const minReps = ref(0);
const maxReps = ref(0);
const load = ref(0);
const errorMessage = ref("");
const isSubmitting = ref(false);
const nextOrder = ref(1);

onMounted(async () => {
  try {
    const { data } = await getExercise(
      route.params.exerciseDocumentId,
      GlobalStore.userToken.value,
    );

    // console.log(data);
    exercise.value = data;

    const responseWorkoutTemplate = await getWorkoutTemplate(
      route.params.workoutTemplateDocumentId,
      GlobalStore.userToken.value,
    );

    const programExercises = responseWorkoutTemplate.data.program_exercises;
    let lastOrder = 0;

    for (let i = 0; i < programExercises.length; i++) {
      if (programExercises[i].order > lastOrder) {
        lastOrder = programExercises[i].order;
      }
    }
    nextOrder.value = lastOrder + 1;
  } catch (error) {
    console.log(error);
  }
});

const validateForm = async () => {
  isSubmitting.value = true;
  errorMessage.value = "";
  try {
    if (numOfSets.value <= 0) {
      errorMessage.value = "Le nombre de séries doit être supérieur à 0 ";
    } else if (minReps.value <= 0) {
      errorMessage.value =
        "Le nombre minimum de répétitions doit être supérieur à 0 ";
    } else if (maxReps.value < minReps.value) {
      errorMessage.value =
        "Le nombre maximum de répétitions doit être supérieur ou égal au minimum";
    } else if (load.value < 0) {
      errorMessage.value = "La charge ne peut pas être négative";
    } else {
      // console.log(numOfSets.value, minReps.value, maxReps.value, load.value);

      const { data } = await createProgramExercise(
        numOfSets.value,
        minReps.value,
        maxReps.value,
        load.value,
        nextOrder.value,
        route.params.exerciseDocumentId,
        route.params.workoutTemplateDocumentId,
        GlobalStore.userToken.value,
      );

      // console.log(data);
      router.push({
        name: "workout-template",
        params: {
          workoutTemplateDocumentId: route.params.workoutTemplateDocumentId,
          programDocumentId: route.params.programDocumentId,
        },
        query: { success: "Exercice ajouté avec succès" },
      });
    }
  } catch (error) {
    console.log(error);
  }
  isSubmitting.value = false;
};
</script>

<template>
  <main>
    <div class="container">
      <p v-if="!exercise">Chargement en cours..</p>
      <section v-else>
        <div>
          <form @submit.prevent="validateForm" class="form">
            <h1>{{ exercise.name }}</h1>

            <label for="numOfSets">Nombre de séries : </label>
            <input
              type="number"
              id="numOfSets"
              v-model="numOfSets"
              @input="errorMessage = ''"
            />

            <label for="minReps">Nombre minimale de répétitions : </label>
            <input
              type="number"
              id="minReps"
              v-model="minReps"
              @input="errorMessage = ''"
            />

            <label for="maxReps">Nombre maximale de répétitions : </label>
            <input
              type="number"
              id="maxReps"
              v-model="maxReps"
              @input="errorMessage = ''"
            />

            <label for="load">Charge de travail en kilogramme : </label>
            <input
              type="number"
              id="load"
              v-model="load"
              @input="errorMessage = ''"
            />

            <p v-if="errorMessage" class="errorMessage">{{ errorMessage }}</p>
            <button>Ajouter l'exercice</button>
          </form>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped></style>
