<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { getMuscle, API_URL } from "../services/api";

const route = useRoute();

const muscleId = route.params.muscleDocumentId;
const muscleInfos = ref(null);

onMounted(async () => {
  try {
    const { data } = await getMuscle(muscleId);

    muscleInfos.value = data;
    // console.log(muscleInfos.value);
  } catch (error) {
    console.log(error);
  }
});

const getMuscleImageUrl = (muscle) => {
  const imageUrl = muscle.startsWith("http") ? muscle : `${API_URL}${muscle}`;
  return imageUrl;
};

const getExerciseImageUrl = (exercise) => {
  const imageUrl = exercise.startsWith("http")
    ? exercise
    : `${API_URL}${exercise}`;
  return imageUrl;
};

const exerciseWithPrimaryRole = computed(() => {
  if (!muscleInfos.value) {
    return [];
  } else {
    const filteredExerciseMuscles = muscleInfos.value.exercise_muscles.filter(
      (exercise) => exercise.role === "PRIMARY",
    );
    console.log(filteredExerciseMuscles);

    return filteredExerciseMuscles;
  }
});

const categories = ["Push", "Pull", "Legs", "Upper", "Lower", "Full body"];

const orderedCategories = (categoriesArray) => {
  return [...categoriesArray].sort(function (a, b) {
    if (categories.indexOf(a.name) === -1) {
      return 1;
    } else if (categories.indexOf(b.name) === -1) {
      return -1;
    } else {
      return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
  });
};
</script>

<template>
  <main>
    <div class="container">
      <p v-if="!muscleInfos">Chargement en cours ...</p>
      <section v-else>
        <div class="muscleDiv">
          <h1>{{ muscleInfos.name }}</h1>

          <img
            id="muscleImg"
            v-if="muscleInfos.image?.url"
            :src="getMuscleImageUrl(muscleInfos.image.url)"
            :alt="muscleInfos.name"
          />

          <p>{{ muscleInfos.description }}</p>
        </div>

        <div class="exercisesDiv">
          <p>Comment les travailler :</p>
          <div v-if="exerciseWithPrimaryRole.length > 0">
            <div
              v-for="exercise in exerciseWithPrimaryRole"
              :key="exercise.documentId"
            >
              <div class="exerciseCard">
                <img
                  class="exerciseImg"
                  v-if="exercise.exercise.image.length > 0"
                  :src="getExerciseImageUrl(exercise.exercise.image[0].url)"
                  alt=""
                />

                <div class="infosExercise">
                  <h3>{{ exercise.exercise.name }}</h3>

                  <div class="categoriesDiv">
                    <p
                      v-for="categorie in orderedCategories(
                        exercise.exercise.categories,
                      )"
                      :class="{
                        ppl:
                          categorie.name === 'Push' ||
                          categorie.name === 'Pull' ||
                          categorie.name === 'Legs',
                        upperLower:
                          categorie.name === 'Upper' ||
                          categorie.name === 'Lower',
                        fullBody: categorie.name === 'Full body',
                      }"
                    >
                      {{ categorie.name }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else id="noExercise">
            <p>Aucun exercice principal associé à ce muscle</p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
section {
  border: solid var(--accent-border) 1px;
  border-radius: 15px;
  padding: 20px;
  display: grid;
  grid-template-columns: 3fr 2fr;
}

.muscleDiv {
  border-right: solid var(--accent-border) 1px;
  padding-right: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.muscleDiv p {
  border: solid 1px var(--accent-border);
  background-color: var(--bgc-secondary);
  border-radius: 10px;
  padding: 15px;
}

#muscleImg {
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
}

.exercisesDiv > div {
  color: var(--main-text);
  padding-left: 30px;
  padding-top: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 30px;
}

.exerciseCard {
  border: solid 1px var(--accent-border);
  background-color: var(--bgc-secondary);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.exerciseCard:hover {
  border-color: var(--purple-accent);
}

.exerciseImg {
  height: 150px;
  width: 150px;
  object-fit: cover;
  border-radius: 10px;
}
h3 {
  font-weight: 500;
  font-size: 16px;
}

#noExercise {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#noExercise p {
  border: solid 1px var(--accent-border);
  background-color: var(--bgc-secondary);
  border-radius: 10px;
  padding: 15px;
  color: var(--main-text);
}

.infosExercise {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.infosExercise p {
  display: inline-block;
  border: 1px solid;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 500;
  width: 90px;
}

.categoriesDiv {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ppl {
  background-color: #8b5cf622;
  border-color: #8b5cf6;
  color: #a78bfa;
}

.upperLower {
  background-color: #16a34a22;
  border-color: #16a34a;
  color: #4ade80;
}

.fullBody {
  background-color: #f59e0b22;
  border-color: #f59e0b;
  color: #fbbf24;
}

/* Media Query ----------- */

@media (max-width: 1000px) {
  main {
    padding: 20px;
  }
  h1 {
    font-size: 36px;
  }
  #muscleImg {
    height: 280px;
  }
  .muscleDiv p {
    font-size: 14px;
  }
  .muscleDiv {
    padding: 10px;
  }
}

@media (max-width: 800px) {
  section {
    display: flex;
    flex-direction: column;
  }
  .muscleDiv {
    border-right: none;
    border-bottom: solid var(--accent-border) 1px;
    width: 100%;
    padding-bottom: 30px;
  }
  .exercisesList {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .exercisesDiv > p {
    margin-top: 20px;
  }
  .exercisesDiv > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding-left: 0;
    gap: 10px;
  }
  h3 {
    font-size: 14px;
  }
  .infosExercise p {
    width: 60px;
  }
}

@media (max-width: 650px) {
  .exercisesDiv > div {
    display: flex;
    flex-direction: column;
  }
  .exercisesDiv > div > div {
    width: 80%;
  }
  .exerciseCard {
    width: 100%;
  }
  .infosExercise {
    flex: 1;
    justify-content: center;
  }
  .categoriesDiv {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
@media (max-width: 600px) {
  .exercisesDiv > div > div {
    width: 100%;
  }
  .categoriesDiv {
    justify-content: center;
  }
}
@media (max-width: 370px) {
  h1 {
    font-size: 26px;
  }
  #muscleImg {
    height: 240px;
  }
  .exerciseImg {
    height: 120px;
    width: 120px;
  }
}
</style>
