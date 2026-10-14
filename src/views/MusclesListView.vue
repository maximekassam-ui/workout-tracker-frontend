<script setup>
import { ref, onMounted } from "vue";
import { getMuscles, API_URL } from "../services/api";

const musclesList = ref([]);

onMounted(async () => {
  try {
    const { data } = await getMuscles();

    musclesList.value = data;
    console.log(musclesList.value);
  } catch (error) {
    console.log(error);
  }
});

const getMuscleImageUrl = (muscle) => {
  const imageUrl = muscle.startsWith("http") ? muscle : `${API_URL}${muscle}`;
  return imageUrl;
};
</script>

<template>
  <main>
    <div class="container">
      <p v-if="musclesList.length === 0">Chargement en cours ...</p>
      <section v-else>
        <div id="musclesHeader">
          <h1>Tous les muscles que tu peux travailler</h1>
          <h4>(Clique dessus pour découvrir comment les travailler)</h4>
        </div>

        <div id="musclesGrid">
          <div
            v-for="muscle in musclesList"
            :key="muscle.documentId"
            class="muscleCard"
          >
            <h3>{{ muscle.name }}</h3>

            <img
              v-if="muscle.image?.url"
              :src="getMuscleImageUrl(muscle.image.url)"
              :alt="muscle.name"
            />
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
#musclesHeader {
  border: solid 1px var(--purple-accent);
  border-radius: 10px;
  padding: 20px;
}
h1 {
  font-size: 40px;
}

img {
  height: 150px;
  width: 150px;
  border-radius: 10px;
}
</style>
