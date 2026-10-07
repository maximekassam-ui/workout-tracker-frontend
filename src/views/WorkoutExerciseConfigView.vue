<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, inject, computed } from "vue";
import { getWorkoutTemplate } from "../services/workoutTemplateApi";
import {
  createProgramExercise,
  getProgramExercise,
  updateProgramExercise,
} from "../services/programExerciseApi";
import { getExercise, getExercisesWithMuscle } from "../services/exerciseApi";

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
const exercisesListWithMuscles = ref([]);
const programExercise = ref(null);

onMounted(async () => {
  try {
    const { data } = await getExercise(
      route.params.exerciseDocumentId,
      GlobalStore.userToken.value,
    );

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

    const resultExercisesListWithMuscles = await getExercisesWithMuscle(
      GlobalStore.userToken.value,
    );

    exercisesListWithMuscles.value = resultExercisesListWithMuscles.data;

    if (route.params.programExerciseDocumentId) {
      programExercise.value = await getProgramExercise(
        route.params.programExerciseDocumentId,
        GlobalStore.userToken.value,
      );

      numOfSets.value = programExercise.value.data.target_sets;
      minReps.value = programExercise.value.data.target_reps_min;
      maxReps.value = programExercise.value.data.target_reps_max;
      load.value = programExercise.value.data.target_load;
    }

    // console.log(programExercise.value.data);
  } catch (error) {
    console.log(error);
  }
});

const getExerciseMuscles = (exerciseDocumentId) => {
  let exerciseFound = "";
  // retrouver l'exercice correspondant dans exercisesListWithMuscle
  for (let i = 0; i < exercisesListWithMuscles.value.length; i++) {
    if (exercisesListWithMuscles.value[i].documentId === exerciseDocumentId) {
      exerciseFound = exercisesListWithMuscles.value[i];
    }
  }
  const mappedExerciseMuscle = exerciseFound.exercise_muscles.map(
    (exerciseMuscle) => ({
      name: exerciseMuscle.muscle.name,
      role: exerciseMuscle.role,
    }),
  );

  return mappedExerciseMuscle;
};

const primaryAndSecondaryMuscle = (exerciseDocumentId) => {
  const primaryMuscle = getExerciseMuscles(exerciseDocumentId).filter(
    (muscle) => muscle.role === "PRIMARY",
  )[0].name;

  const secondaryMuscle = getExerciseMuscles(exerciseDocumentId).filter(
    (muscle) => muscle.role === "SECONDARY",
  );

  return { primary: primaryMuscle, secondary: secondaryMuscle };
};

const muscles = computed(() => {
  if (!exercise.value || !exercisesListWithMuscles.value.length) {
    return null;
  }

  return primaryAndSecondaryMuscle(exercise.value.documentId);
});

const validateForm = async () => {
  isSubmitting.value = true;
  errorMessage.value = "";

  const isEditing = !!route.params.programExerciseDocumentId;

  try {
    if (numOfSets.value <= 0) {
      errorMessage.value = "Le nombre de séries doit être supérieur à 0 ";
    } else if (minReps.value <= 0 || maxReps.value <= 0) {
      errorMessage.value = "Le nombre de répétitions doit être supérieur à 0 ";
    } else if (maxReps.value < minReps.value) {
      errorMessage.value =
        "Le nombre maximum de répétitions doit être supérieur ou égal au minimum";
    } else if (load.value < 0) {
      errorMessage.value = "La charge ne peut pas être négative";
    } else {
      // console.log(numOfSets.value, minReps.value, maxReps.value, load.value);

      if (isEditing) {
        await updateProgramExercise(
          route.params.programExerciseDocumentId,
          numOfSets.value,
          minReps.value,
          maxReps.value,
          load.value,
          GlobalStore.userToken.value,
        );
        router.push({
          name: "workout-template",
          params: {
            workoutTemplateDocumentId: route.params.workoutTemplateDocumentId,
            programDocumentId: route.params.programDocumentId,
          },
          query: { success: "Exercice modifié avec succès" },
        });
      } else {
        const { data } = await createProgramExercise(
          numOfSets.value,
          minReps.value,
          maxReps.value,
          load.value,
          nextOrder.value,
          route.params.exerciseDocumentId,
          route.params.workoutTemplateDocumentId,
          GlobalStore.userToken.value,
        ); // console.log(data);
        router.push({
          name: "workout-template",
          params: {
            workoutTemplateDocumentId: route.params.workoutTemplateDocumentId,
            programDocumentId: route.params.programDocumentId,
          },
          query: { success: "Exercice ajouté avec succès" },
        });
      }
    }
  } catch (error) {
    console.log(error);
    errorMessage.value = isEditing
      ? "Une erreur est survenue lors de la modification de l'exercice."
      : "Une erreur est survenue lors de l'ajout de l'exercice.";
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
            <h2 v-if="muscles">Muscle principal : {{ muscles.primary }}</h2>
            <div v-if="muscles">
              <h2>
                {{
                  muscles.secondary.length > 1
                    ? "Muscles secondaires : "
                    : "Muscle secondaire : "
                }}
              </h2>
              <span
                v-for="secondaryMuscle in muscles.secondary"
                :key="secondaryMuscle.name"
              >
                {{ secondaryMuscle.name }}
              </span>
            </div>

            <label for="numOfSets">Nombre de séries : </label>
            <input
              type="number"
              id="numOfSets"
              min="1"
              step="1"
              inputmode="numeric"
              required
              v-model="numOfSets"
              @input="errorMessage = ''"
            />

            <label for="minReps">Nombre minimale de répétitions : </label>
            <input
              type="number"
              id="minReps"
              min="1"
              step="1"
              inputmode="numeric"
              required
              v-model="minReps"
              @input="errorMessage = ''"
            />

            <label for="maxReps">Nombre maximale de répétitions : </label>
            <input
              type="number"
              id="maxReps"
              min="1"
              step="1"
              inputmode="numeric"
              required
              v-model="maxReps"
              @input="errorMessage = ''"
            />

            <label for="load">Charge de travail en kilogramme : </label>
            <input
              type="number"
              id="load"
              min="0"
              step="0.25"
              inputmode="decimal"
              required
              v-model="load"
              @input="errorMessage = ''"
            />

            <p v-if="errorMessage" class="errorMessage">{{ errorMessage }}</p>
            <button :disabled="isSubmitting">
              {{
                !route.params.programExerciseDocumentId
                  ? !isSubmitting
                    ? "Ajouter l'exercice"
                    : "Ajout en cours..."
                  : !isSubmitting
                    ? "Modifier l'exercice"
                    : "Modification en cours..."
              }}
            </button>
          </form>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
span {
  margin-right: 8px;
}
</style>
