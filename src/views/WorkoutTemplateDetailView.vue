<script setup>
import { RouterLink, useRoute, useRouter } from "vue-router";
import { onMounted, ref, inject, computed } from "vue";
import {
  getWorkoutTemplate,
  getExercises,
  getExercisesWithMuscle,
} from "../services/api";
import ExerciseCarousel from "../components/ExerciseCarousel.vue";

const route = useRoute();
// console.log(route.params); pour avoir les ID en params de workoutTemplate
const GlobalStore = inject("GlobalStore");
const router = useRouter();

const workoutTemplate = ref(null);
const exercisesList = ref([]);
const isAddingExercise = ref(false);
const selectedExercise = ref(null);
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

  //   console.log("Catégorie template :", workoutTemplateCategory);
  //   console.log("Exercices :", exercisesList.value[0]);

  const result = exercisesList.value.filter((exercise) =>
    exercise.categories.some(
      (category) => category.name === workoutTemplateCategory,
    ),
  );

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

    // console.log(data);
    workoutTemplate.value = data;
    successMessage.value = route.query.success;

    router.replace({ query: {} }); // Enlève le query présent dans l'url

    if (successMessage.value) {
      setTimeout(() => {
        successMessage.value = "";
      }, 3000); // Fait disparaitre successMessage apres 3s
    }

    const result = await getExercises(GlobalStore.userToken.value);

    exercisesList.value = result.data;
    // console.log(">>", exercisesList.value[0].exercise_muscles);

    const resultWithMuscle = await getExercisesWithMuscle(
      GlobalStore.userToken.value,
    ); // Pour avoir la liste des exo avec la relation muscle de populate

    exercisesListWithMuscle.value = resultWithMuscle.data;
    // console.log(">>>", exercisesListWithMuscle.value);

    console.log(
      primaryAndSecondaryMuscle(exercisesListWithMuscle.value[0].documentId),
    );
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <main>
    <div class="container">
      <p v-if="!workoutTemplate">Chargement en cours..</p>
      <section v-else id="workoutTemplate">
        <div>
          <h1>{{ workoutTemplate.name }}</h1>
          <h3>{{ workoutTemplate.category }}</h3>

          <p v-if="successMessage">{{ successMessage }}</p>

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
        </div>

        <button @click="isAddingExercise = true">+ Ajouter un exercice</button>

        <ExerciseCarousel
          v-if="isAddingExercise"
          id="carouselSection"
          :exercisesWithMuscles="exercisesWithMuscles"
          :primaryAndSecondaryMuscle="primaryAndSecondaryMuscle"
        />

        <!-- <section v-if="isAddingExercise" class="carouselSection">
          <div class="carouselDiv">
            <div
              v-for="exercise in exercisesWithMuscles"
              @click="selectedExercise = exercise"
            >
              <RouterLink
                :to="{
                  name: 'workout-exercise-config',
                  params: {
                    programDocumentId: route.params.programDocumentId,
                    workoutTemplateDocumentId:
                      route.params.workoutTemplateDocumentId,

                    exerciseDocumentId: exercise.documentId,
                  },
                }"
              >
                <h3>{{ exercise.name }}</h3>
                <div>
                  <p>
                    Principal :
                    {{ exercise.muscles.principal }}
                  </p>

                  <div>
                    <p>Secondaires :</p>
                    <span
                      v-for="(muscleName, index) in exercise.muscles
                        .secondaires"
                    >
                      {{ muscleName.name }}

                      <font-awesome-icon
                        :icon="['fas', 'circle']"
                        v-if="
                          index !==
                          primaryAndSecondaryMuscle(exercise.documentId)
                            .secondaires.length -
                            1
                        "
                      />
                    </span>
                  </div>
                </div>
              </RouterLink>
            </div>
          </div>
        </section> -->
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

#workoutTemplate > div:not(#carouselSection) {
  border: solid 1px var(--accent-border);
  border-radius: 10px;
  margin: 0 auto;
  max-width: 600px;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
}

#workoutTemplate > div:first-child {
  border-color: var(--main-text);
  width: 100%;
}

#workoutTemplate > div:not(:first-child, #carouselSection) {
  height: 250px;
  width: 300px;
  padding: 30px;
}

.exerciseCard > div {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 7px;
  padding-left: 30px;
}
.exerciseCard h2 {
  font-size: 22px;
  margin-bottom: 20px;
}
.exerciseCard span {
  color: var(--main-text);
  font-weight: bold;
  font-size: 18px;
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
</style>
