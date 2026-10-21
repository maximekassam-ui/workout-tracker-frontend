<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  exercisesWithMuscles: Array,
  programDocumentId: String,
  workoutTemplateDocumentId: String,
});

const carousel = ref(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(true);

const updateArrows = () => {
  const el = carousel.value;
  if (el.scrollWidth <= el.clientWidth) {
    canScrollRight.value = false;
    canScrollLeft.value = false;
    return;
  }
  if (el.scrollLeft > 0) {
    canScrollLeft.value = true;
  } else if (el.scrollLeft === 0) {
    canScrollLeft.value = false;
  }
  if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
    canScrollRight.value = false;
  } else if (el.scrollLeft + el.clientWidth < el.scrollWidth - 1) {
    canScrollRight.value = true;
  }
};

const scrollRight = () => {
  carousel.value.scrollLeft = carousel.value.scrollLeft + 273;
};

const scrollLeft = () => {
  carousel.value.scrollLeft = carousel.value.scrollLeft - 273;
};

onMounted(() => {
  updateArrows();
  console.log(props);
});
</script>

<template>
  <div id="carouselWrapper">
    <div class="iconDiv">
      <Transition>
        <font-awesome-icon
          :icon="['fas', 'chevron-left']"
          @click="scrollLeft"
          v-show="canScrollLeft === true"
        />
      </Transition>
    </div>

    <div
      id="carouselDiv2"
      class="container"
      ref="carousel"
      @scroll="updateArrows"
    >
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
          <div v-if="exercise.muscles.secondaires.length > 1">
            <p>Secondaires :</p>
            <div>
              <span
                v-for="muscleName in exercise.muscles.secondaires"
                :key="muscleName.name"
                >{{ muscleName.name }} -
              </span>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>

    <div class="iconDiv">
      <font-awesome-icon
        :icon="['fas', 'chevron-right']"
        @click="scrollRight"
        v-show="canScrollRight === true"
      />
    </div>
  </div>
</template>

<style scoped>
#carouselWrapper {
  display: flex;
  align-items: center;
  gap: 30px;
}

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
  border: solid 1px var(--accent-border);
  background-color: var(--bgc-secondary);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  width: 250px;

  transition:
    transform 0.3s,
    border-color 0.3s;
}
.carouselCard:hover {
  border-color: var(--purple-accent);
  transform: translateY(-2px);
}
.carouselCard h2 {
  font-size: 20px;
  margin-bottom: 20px;
}
.muscleRole {
  height: 35%;
}
.muscleRole p {
  font-size: 12px;
}

.muscleRole span {
  font-size: 10px;
  line-height: 0.5;
}
.muscleRole > p:first-child {
  font-weight: 700;
  color: var(--purple-accent);
}
.muscleRole > div {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.muscleRole > div p {
  margin-bottom: -2px;
}
svg {
  color: var(--purple-accent);
  font-size: 24px;
}
.iconDiv {
  width: 35px;
  flex-shrink: 0;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

/* Media Query ----------- */
@media (max-width: 400px) {
  .carouselCard {
    width: 200px;
  }
}
</style>
