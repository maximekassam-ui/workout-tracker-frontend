<script setup>
import { RouterLink } from "vue-router";

const props = defineProps({
  exercisesWithMuscles: Array,
});
</script>

<template>
  <div>
    <div id="carouselDiv2" class="container">
      <div
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
      </div>
    </div>
  </div>
</template>

<style scoped>
#carouselDiv2 {
  border: solid 1px var(--accent-border);
  border-radius: 10px;
  width: 850px;
  height: 300px;
  padding: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: nowrap;
  overflow-x: scroll;
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
</style>
