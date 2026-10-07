<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, inject, computed } from "vue";
import { getWorkoutTemplate } from "../services/workoutTemplateApi.js";
import { deleteProgramExercise } from "../services/programExerciseApi.js";
import {
  getExercises,
  getExercisesWithMuscle,
} from "../services/exerciseApi.js";
import ExerciseCarousel from "../components/ExerciseCarousel.vue";

const route = useRoute();
// console.log(route.params); pour avoir les ID en params de workoutTemplate
const GlobalStore = inject("GlobalStore");
const router = useRouter();

const workoutTemplate = ref(null);
const exercisesList = ref([]);
const isAddingExercise = ref(false);
const successMessage = ref("");
const exercisesListWithMuscle = ref(null);

const objectCategory = {
  UPPER: "Upper",
  LOWER: "Lower",
  PUSH: "Push",
  PULL: "Pull",
  LEGS: "Legs",
  FULL_BODY: "Full body",
};

const filteredExercises = computed(() => {
  if (!workoutTemplate.value) {
    return [];
  }

  const workoutTemplateCategory =
    objectCategory[workoutTemplate.value.category];

  const result = exercisesList.value.filter((exercise) =>
    exercise.categories.some(
      (category) => category.name === workoutTemplateCategory,
    ),
  );
  // filter() : récupère les éléments qui correspondent à la condition
  // some() : verifie qu'au moins 1 element correspond a la condition
  // filter() récupère tous les exercices pour lesquels some() retourne true
  return result;
});

const exercisesWithMuscles = computed(() => {
  return filteredExercises.value.map((exercise) => {
    return {
      name: exercise.name,
      documentId: exercise.documentId,
      categories: exercise.categories,
      muscles: primaryAndSecondaryMuscle(exercise.documentId),
    };
  });
});

// map() : pour chaque exercice de mon tableau, transforme-le en un nouvel objet, puis mets tous ces nouveaux objets dans un nouveau tableau

const getExerciseMuscles = (exerciseDocumentId) => {
  let exerciseFound = "";
  // retrouver l'exercice correspondant dans exercisesListWithMuscle
  for (let i = 0; i < exercisesListWithMuscle.value.length; i++) {
    if (exercisesListWithMuscle.value[i].documentId === exerciseDocumentId) {
      exerciseFound = exercisesListWithMuscle.value[i];
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

  const secondaryMuscles = getExerciseMuscles(exerciseDocumentId).filter(
    (muscles) => muscles.role === "SECONDARY",
  );

  return { principal: primaryMuscle, secondaires: secondaryMuscles };
};

onMounted(async () => {
  try {
    const { data } = await getWorkoutTemplate(
      route.params.workoutTemplateDocumentId,
      GlobalStore.userToken.value,
    );

    workoutTemplate.value = data;
    console.log(workoutTemplate.value.program_exercises);

    successMessage.value = route.query.success;

    router.replace({ query: {} }); // Enlève le query présent dans l'url

    if (successMessage.value) {
      setTimeout(() => {
        successMessage.value = "";
      }, 3000); // Fait disparaitre successMessage apres 3s
    }

    const result = await getExercises(GlobalStore.userToken.value);

    exercisesList.value = result.data;

    const resultWithMuscle = await getExercisesWithMuscle(
      GlobalStore.userToken.value,
    ); // Pour avoir la liste des exo avec la relation muscle de populate

    exercisesListWithMuscle.value = resultWithMuscle.data;
  } catch (error) {
    console.log(error);
  }
});

const deleteExercise = async (programExerciseDocumentId) => {
  const isDeleting = window.confirm(
    "Voulez-vous vraiment supprimer cet exercice ?",
  );

  if (!isDeleting) {
    return;
  }

  try {
    await deleteProgramExercise(
      programExerciseDocumentId,
      GlobalStore.userToken.value,
    );

    const { data } = await getWorkoutTemplate(
      route.params.workoutTemplateDocumentId,
      GlobalStore.userToken.value,
    );

    workoutTemplate.value = data;
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <main>
    <div class="container">
      <p v-if="!workoutTemplate">Chargement en cours..</p>
      <section v-else id="workoutTemplate">
        <div id="workout">
          <h1>{{ workoutTemplate.name }}</h1>
          <h3>{{ workoutTemplate.category }}</h3>

          <p v-if="successMessage" id="successMessage">{{ successMessage }}</p>

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
          <RouterLink
            :to="{
              name: 'workout-exercise-config',
              params: {
                programDocumentId: route.params.programDocumentId,
                workoutTemplateDocumentId:
                  route.params.workoutTemplateDocumentId,
                exerciseDocumentId: exercise.exercise.documentId,
                programExerciseDocumentId: exercise.documentId,
              },
            }"
          >
            <h2>{{ exercise.exercise.name }}</h2>
            <div>
              <p>
                Nombre de {{ exercise.target_sets > 1 ? "séries" : "série" }} :
                <span>{{ exercise.target_sets }}</span>
              </p>

              <p>
                Entre <span>{{ exercise.target_reps_min }}</span> et

                <span>{{ exercise.target_reps_max }}</span> répétitions
              </p>

              <p>
                Avec un poids de <span>{{ exercise.target_load }}</span> kg
              </p>
            </div>
          </RouterLink>

          <font-awesome-icon
            :icon="['fas', 'trash']"
            class="deletButton"
            @click="deleteExercise(exercise.documentId)"
          />
        </div>

        <button @click="isAddingExercise = true">+ Ajouter un exercice</button>

        <ExerciseCarousel
          v-if="isAddingExercise"
          id="carouselSection"
          :exercisesWithMuscles="exercisesWithMuscles"
          :primaryAndSecondaryMuscle="primaryAndSecondaryMuscle"
          :programDocumentId="route.params.programDocumentId"
          :workoutTemplateDocumentId="route.params.workoutTemplateDocumentId"
        />
      </section>
    </div>
  </main>
</template>

<style scoped>
#workoutTemplate {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

#workoutTemplate > #workout {
  border: solid 1px var(--accent-border);
  border-radius: 10px;
  margin: 0 auto;
  height: auto;
  width: 100%;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

h1 {
  margin: 0;
  font-size: 32px;
  color: var(--main-text);
}
#workoutTemplate #workout h3 {
  margin: 0;
  color: var(--purple-accent);
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
#workoutTemplate #workout > p {
  max-width: 700px;
  align-self: center;
}
#workoutTemplate #workout p:last-child {
  color: var(--main-text);
  font-weight: bold;
}
#successMessage {
  padding: 8px 12px;
  border: 1px solid var(--purple-accent);
  border-radius: 6px;
  color: var(--purple-accent);
  font-weight: bold;
}

.exerciseCard {
  border: solid 1px var(--accent-border);
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  min-height: 180px;
  padding: 25px 60px 25px 30px;
  position: relative;
  align-self: center;
}
.exerciseCard:hover {
  border-color: var(--purple-accent);
  transform: translateY(-2px);
}
.exerciseCard a {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.exerciseCard a div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.exerciseCard h2 {
  font-size: 22px;
  margin-bottom: 20px;
  margin-top: 0;
}

.exerciseCard p {
  margin: 0;
  color: var(--secondary-text);
  font-size: 15px;
}
.exerciseCard span {
  color: var(--main-text);
  font-weight: bold;
  font-size: 16px;
}
button {
  background-color: var(--purple-accent);
  border: none;
  height: 40px;
  width: 250px;
  border-radius: 10px;
  margin-top: 20px;
  color: var(--main-text);
  font-size: 18px;
  font-weight: bold;
  transition: 0.3s;
  cursor: pointer;
}

button:hover {
  transform: translateY(-2px);
}
.exerciseCard .deletButton {
  color: var(--secondary-text);
  font-size: 18px;
  transition: 0.3s;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  right: 20px;
}
.exerciseCard .deletButton:hover {
  color: var(--main-text);
  transform: scale(1.1);
}

#carouselSection {
  display: flex;
  align-items: center;
  gap: 30px;
  width: 100%;
  padding: 0 40px;
}

/* Media Query ------------ */

@media (max-width: 1055px) {
  main {
    padding: 30px;
  }
}

@media (max-width: 500px) {
  #workoutTemplate {
    gap: 20px;
  }

  #workoutTemplate #workout {
    padding: 25px 20px;
    gap: 10px;
  }

  h1 {
    font-size: 26px;
  }

  #workoutTemplate #workout p {
    font-size: 14px;
  }

  .exerciseCard {
    width: calc(100% - 20px);
    padding: 20px 50px 20px 20px;
  }
  .exerciseCard h2 {
    font-size: 19px;
    padding-right: 15px;
  }
  button {
    width: 100%;
    max-width: 300px;
  }

  #carouselSection {
    padding: 0 10px;
    gap: 15px;
    width: 100%;
  }
}
@media (max-width: 360px) {
  .exerciseCard {
    padding: 20px 45px 20px 15px;
  }
}
</style>
