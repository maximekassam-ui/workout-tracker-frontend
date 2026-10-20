<script setup>
import { ref, onMounted, inject } from "vue";
import { getExercisesWithMuscle } from "../services/exerciseApi";
import { API_URL } from "../services/api";

const GlobalStore = inject("GlobalStore");

const exerciseList = ref([]);
const isLoading = ref(true);
const errorMessage = ref("");

onMounted(async () => {
  try {
    const { data } = await getExercisesWithMuscle(GlobalStore.userToken.value);

    console.log(data);
    exerciseList.value = data;
  } catch (error) {
    console.log(error);
    errorMessage.value =
      "Impossible de charger les exercices. Veuillez réessayer plus tard.";
  } finally {
    isLoading.value = false;
  }
});

const getExerciseImageUrl = (exercise) => {
  const imageUrl = exercise.startsWith("http")
    ? exercise
    : `${API_URL}${exercise}`;
  return imageUrl;
};
</script>

<template>
  <main>
    <section class="container">
      <p v-if="isLoading">Chargement des exercices...</p>
      <p v-else-if="errorMessage">{{ errorMessage }}</p>

      <div v-else id="exercisesListDiv">
        <h1>Explorer les exercices</h1>
        <div v-for="exercise in exerciseList" :key="exercise.documentId">
          <h3>{{ exercise.name }}</h3>

          <img
            v-if="exercise.image.length > 0"
            :src="getExerciseImageUrl(exercise.image[0].url)"
            alt=""
          />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
img {
  height: 200px;
}
</style>
