<script setup>
import { onMounted, inject, ref } from "vue";
import axios from "axios";

import { getWorkoutHistory } from "../services/api";

const GlobalStore = inject("GlobalStore");
const allWorkoutHistory = ref([]);
const choosenWorkoutId = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const response = await getWorkoutHistory(GlobalStore.userToken.value);

    allWorkoutHistory.value = response;
    isLoading.value = false;

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
    <section v-if="isLoading">
      <p>Chargement en cours ...</p>
    </section>

    <section v-else-if="allWorkoutHistory.length === 0" id="noWorkout">
      <h3>Vous n'avez aucune séance terminée</h3>
    </section>

    <section v-else class="allWorkouts">
      <div
        v-for="workout in allWorkoutHistory"
        :key="workout.documentId"
        @click="handleWorkoutClick(workout)"
        class="workoutCard"
      >
        <div class="openWorkout">
          <h1>{{ workout.workout_template.name }}</h1>

          <div
            class="openIcon"
            :class="{ closeIcon: choosenWorkoutId === workout.documentId }"
          >
            <p>+</p>
          </div>
        </div>

        <div class="workoutInfos">
          <span
            >Le {{ new Date(workout.completed_at).toLocaleDateString() }}</span
          >
          <span>Durée : {{ workout.duration }} min</span>
        </div>

        <div
          v-if="
            choosenWorkoutId === workout.documentId &&
            workout.workout_exercises.length > 0
          "
          class="workoutExercises"
        >
          <div v-for="workout_exercises in workout.workout_exercises">
            <h3>{{ workout_exercises.exercise.name }}</h3>
            <h4 v-if="workout_exercises.sets.length > 0">
              {{ workout_exercises.sets.length }}
              {{ workout_exercises.sets.length > 1 ? "Séries" : "Série" }} :
            </h4>

            <div v-if="workout_exercises.sets.length > 0">
              <div v-for="sets in workout_exercises.sets">
                <p>
                  Série n°{{ sets.set_number }} : {{ sets.reps }} reps à
                  {{ sets.load }} kg
                </p>
              </div>
            </div>

            <p v-else>Aucune série enregistrée..</p>
          </div>
        </div>
        <div
          v-else-if="
            choosenWorkoutId === workout.documentId &&
            workout.workout_exercises.length === 0
          "
          class="workoutExercises"
          id="noWorkoutExercises"
        >
          <p>Aucun exercice dans cette séance..</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.allWorkouts {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.openWorkout {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.openWorkout div {
  position: absolute;
  right: 5px;
  top: 5px;
}
.openWorkout p {
  font-size: 25px;
  color: var(--main-text);
  font-weight: 400;
}
.openIcon {
  transition: transform 0.3s ease;
}
.closeIcon {
  transform: rotate(45deg);
}

#noWorkout {
  background-color: #161b22;
  border: solid 1px #30363d;
  border-radius: 15px;
  padding: 20px;
}

.workoutCard {
  background: var(--bcg-secondary);
  width: 500px;
  border: 1px solid var(--accent-border);
  border-radius: 15px;
  padding: 20px;
  margin: 0 auto;
  transition: 0.3s;
}
.workoutCard:hover {
  cursor: pointer;
  transform: translateY(-2px);
  box-shadow: 0 0 10px var(--purple-accent);
}

.workoutInfos {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.workoutExercises {
  border-top: solid 1px var(--accent-border);
  margin-top: 20px;
}
#noWorkoutExercises {
  padding: 30px 0;
}
p {
  font-size: 14px;
}
h4 {
  font-size: 16px;
  margin-bottom: 5px;
}
</style>
