<script setup>
import { ref, onMounted } from "vue";
import { getMuscles, API_URL } from "../services/api";
import { RouterLink } from "vue-router";

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
          <RouterLink
            :to="{
              name: 'muscles-detail',
              params: { muscleDocumentId: muscle.documentId },
            }"
            v-for="muscle in musclesList"
            :key="muscle.documentId"
            class="muscleCard"
          >
            <img
              v-if="muscle.image?.url"
              :src="getMuscleImageUrl(muscle.image.url)"
              :alt="muscle.name"
            />

            <h3>{{ muscle.name }}</h3>

            <p
              class="zoneMuscle"
              :class="{
                upper: muscle.zone === 'Haut du corps',
                lower: muscle.zone === 'Bas du corps',
                abs: muscle.zone === 'Abdominaux',
              }"
            >
              {{ muscle.zone }}
            </p>
          </RouterLink>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
#musclesHeader {
  border: solid 1px var(--accent-border);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 70px;
}
h1 {
  font-size: 40px;
}

#musclesGrid {
  border: solid 1px var(--purple-accent);
  border-radius: 10px;
  padding: 30px 50px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
}

.muscleCard {
  border: solid 1px var(--accent-border);
  border-radius: 10px;
  height: 400px;
  width: 400px;
  padding: 25px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
h3 {
  font-size: 18px;
}

img {
  height: 200px;
  width: 200px;
  border-radius: 10px;
}

.zoneMuscle {
  display: inline-block;
  padding: 4px 12px;
  border: 1px solid;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}
.upper {
  background-color: #8b5cf622;
  border-color: #8b5cf6;
  color: #a78bfa;
}

.lower {
  background-color: #16a34a22;
  border-color: #16a34a;
  color: #4ade80;
}

.abs {
  background-color: #f59e0b22;
  border-color: #f59e0b;
  color: #fbbf24;
}
</style>
