<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  exercisesWithMuscles: Array,
  programDocumentId: String,
  workoutTemplateDocumentId: String,
});

const carousel = ref(null);

const scrollRight = () => {
  carousel.value.scrollLeft = carousel.value.scrollLeft + 300;
};

const scrollLeft = () => {
  carousel.value.scrollLeft = carousel.value.scrollLeft - 300;
};

onMounted(async () => {
  console.log(props);
});
</script>

<template>
  <div>
    <font-awesome-icon :icon="['fas', 'chevron-left']" @click="scrollLeft" />
    <div id="carouselDiv2" class="container" ref="carousel">
      <RouterLink
        :to="{
          name: 'workout-exercise-config',
          params: {
            programDocumentId: props.programDocumentId,
            workoutTemplateDocumentId: props.workoutTemplateDocumentId,
            exerciseDocumentId: exercise.documentId,
          },
        }"
        class="carouselCard"
        v-for="exercise in props.exercisesWithMuscles"
        :key="exercise.documentId"
      >
        <h2>{{ exercise.name }}</h2>
        <div class="muscleRole">
          <p>
            Principal :
            {{ exercise.muscles.principal }}
          </p>
          <div>
            <p>Secondaires :</p>
            <span
              v-for="muscleName in exercise.muscles.secondaires"
              :key="muscleName.name"
              >{{ muscleName.name }} -
            </span>
          </div>
        </div>
      </RouterLink>
    </div>
    <font-awesome-icon :icon="['fas', 'chevron-right']" @click="scrollRight" />
  </div>
</template>

<style scoped>
#carouselDiv2 {
  border: solid 1px var(--accent-border);
  border-radius: 10px;
  flex: 1;
  min-width: 0;
  height: 300px;
  padding: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: nowrap;
  overflow-x: scroll;
  scroll-behavior: smooth;
}

#carouselDiv2::-webkit-scrollbar {
  display: none;
}

.carouselCard {
  border: solid 1px var(--purple-accent);
  border-radius: 10px;
  padding: 10px;
  flex-shrink: 0;
  width: 250px;
}
.carouselCard h2 {
  font-size: 22px;
  margin-bottom: 20px;
}
.muscleRole p,
.muscleRole span {
  font-size: 10px;
}
svg {
  color: var(--purple-accent);
  font-size: 24px;
}
</style>
