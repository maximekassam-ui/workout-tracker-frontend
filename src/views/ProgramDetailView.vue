<script setup>
import { useRoute } from "vue-router";
import { getProgram } from "../services/programApi";
import { deleteWorkoutTemplate } from "../services/workoutTemplateApi";
import { inject, onMounted, ref } from "vue";

const route = useRoute();
// console.log(route.params.programDocumentId);
const GlobalStore = inject("GlobalStore");

const program = ref(null);

onMounted(async () => {
  try {
    // console.log("Program ID :", route.params.programDocumentId);

    const response = await getProgram(
      route.params.programDocumentId,
      GlobalStore.userToken.value,
    );

    // console.log(response);

    program.value = response;
  } catch (error) {
    console.log(error);
  }
});

const deleteWorkout = async (workoutDocumentId) => {
  const isDeleting = window.confirm(
    "Voulez-vous vraiment supprimer cet séance ?",
  );

  if (!isDeleting) {
    return;
  }
  try {
    await deleteWorkoutTemplate(workoutDocumentId, GlobalStore.userToken.value);

    const response = await getProgram(
      route.params.programDocumentId,
      GlobalStore.userToken.value,
    );

    program.value = response;
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <main>
    <div class="container">
      <p v-if="!program">Chargement en cours</p>

      <section v-else>
        <section id="titleSection">
          <RouterLink :to="{ name: 'my-program' }">
            <font-awesome-icon :icon="['fas', 'arrow-left']" />
            Retour à mes programmes</RouterLink
          >

          <div>
            <div>
              <h1>{{ program.name }}</h1>
              <h3>{{ program.description }}</h3>
            </div>

            <div>
              <p v-if="program.is_active === true" class="statusActive">
                Actif
              </p>
              <p v-else class="statusInactive">Inactif</p>
            </div>
          </div>
        </section>

        <section id="workoutsSection">
          <div>
            <h2>Mes séances</h2>
            <RouterLink
              :to="{
                name: 'create-workout',
                params: { programDocumentId: program.documentId },
              }"
              v-if="program.workout_templates.length !== 0"
              >Ajouter une séance</RouterLink
            >
          </div>

          <div v-if="program.workout_templates.length === 0" id="noWorkouts">
            <h3>Aucune séance n'a encore été créée.</h3>

            <RouterLink
              :to="{
                name: 'create-workout',
                params: { programDocumentId: program.documentId },
              }"
              >Créer une séance</RouterLink
            >
          </div>

          <div v-else id="allWorkouts">
            <div
              v-for="workout in program.workout_templates"
              class="workoutCardDiv"
            >
              <RouterLink
                class="workoutCard"
                :to="{
                  name: 'workout-template',
                  params: {
                    programDocumentId: program.documentId,
                    workoutTemplateDocumentId: workout.documentId,
                  },
                }"
              >
                <h3>{{ workout.name }}</h3>
                <h4
                  :class="{
                    ppl:
                      workout.category === 'Push' ||
                      workout.category === 'Pull' ||
                      workout.category === 'Legs',
                    upperLower:
                      workout.category === 'Upper' ||
                      workout.category === 'Lower',
                    fullBody: workout.category === 'Full body',
                  }"
                >
                  {{ workout.category }}
                </h4>
                <h4>{{ workout.description }}</h4>

                <h4 v-if="workout.program_exercises.length === 0">
                  <p>Ajouter des exercices</p>
                </h4>

                <h4 v-else>
                  {{ workout.program_exercises.length }}
                  {{
                    workout.program_exercises.length === 1
                      ? "exercice"
                      : "exercices"
                  }}
                </h4>
              </RouterLink>

              <font-awesome-icon
                :icon="['fas', 'trash']"
                class="deletButton"
                @click="deleteWorkout(workout.documentId)"
              />
            </div>
          </div>
        </section>
      </section>
    </div>
  </main>
</template>

<style scoped>
#titleSection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 45px 30px 30px 30px;
  margin-bottom: 50px;
  border-bottom: solid 1px var(--secondary-text);
}

#titleSection > a {
  color: var(--main-text);
  display: inline-block;
  justify-self: flex-start;
  align-self: flex-start;
  position: fixed;
  top: var(--header-height);
  left: 0;
  z-index: 0;
  width: 100%;
  background-color: var(--main-bg);
  border-bottom: 1px solid var(--accent-border);
  border-radius: 0;
  width: 100%;
  padding: 12px 30px;
  margin-bottom: 0;
}

#titleSection > div {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

#titleSection h1 {
  margin: 0 0 10px;
  font-size: 2.5rem;
}

#titleSection h3 {
  margin: 0;
  color: var(--secondary-text);
  font-weight: normal;
}

#titleSection p {
  border-radius: 20px;
  padding: 8px 18px;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
}

.statusActive {
  color: #4ade80;
  border: 1px solid #4ade80;
  background-color: rgba(74, 222, 128, 0.1);
}

.statusInactive {
  color: var(--secondary-text);
  border: 1px solid var(--accent-border);
  background-color: var(--bgc-secondary);
}

/* ------------------------- */

#workoutsSection {
  padding: 30px;
}

#workoutsSection > div:first-child {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

#workoutsSection h2 {
  margin: 0;
  font-size: 2rem;
}

#workoutsSection > div:first-child a,
#noWorkouts a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--purple-accent);
  border-radius: 10px;
  padding: 10px 20px;
  background-color: var(--purple-accent);
  color: var(--main-text);
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

#workoutsSection > div:first-child a:hover,
#noWorkouts a:hover {
  background-color: #7c4fe0;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.2);
}

#allWorkouts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.workoutCard {
  background-color: var(--bgc-secondary);
  border: 1px solid var(--accent-border);
  border-radius: 15px;
  padding: 25px;
  min-height: 200px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.workoutCard:hover {
  transform: translateY(-3px);
  border-color: var(--purple-accent);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.12);
}

.workoutCard h3 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  padding: 0;
  border-radius: 0;
  background-color: transparent;
  color: var(--main-text);
  padding-bottom: 15px;
  border-bottom: 1px solid var(--accent-border);
}
#noWorkouts {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#noWorkouts h3 {
  margin-bottom: 70px;
}

.workoutCard h4:first-of-type {
  display: inline-block;
  align-self: flex-start;
  margin: 15px 0;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid;
  background-color: #8b5cf622;
  color: #a78bfa;
  border-color: #8b5cf6;
}

.workoutCard h4:nth-of-type(2) {
  margin: 0;
  color: var(--secondary-text);
  font-weight: normal;
  font-size: 0.95rem;
  line-height: 1.5;
}

.workoutCard h4:last-child {
  margin: 20px 0 0;
  padding-top: 15px;
  border-top: 1px solid var(--accent-border);
  color: var(--main-text);
  font-size: 0.9rem;
  font-weight: 500;
}

.workoutCardDiv {
  position: relative;
}

.deletButton {
  color: var(--secondary-text);
  font-size: 16px;
  border-radius: 8px;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
  cursor: pointer;
  position: absolute;
  bottom: 16px;
  right: 16px;
}
.deletButton:hover {
  color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.1);
}

/* Media Query ------------- */

@media (max-width: 700px) {
  #allWorkouts {
    grid-template-columns: 1fr;
  }

  #titleSection > div {
    flex-direction: column;
    align-items: flex-start;
  }
  #titleSection {
    padding: 10px 15px 25px;
    margin-bottom: 25px;
  }

  #titleSection > a {
    margin-bottom: 30px;
  }

  #titleSection h1 {
    font-size: 2rem;
    overflow-wrap: anywhere;
  }

  #titleSection > div {
    gap: 15px;
  }

  #workoutsSection {
    padding: 20px 15px;
  }
}

@media (max-width: 420px) {
  #workoutsSection h2 {
    font-size: 1.5rem;
  }

  #workoutsSection > div:first-child a {
    font-size: 14px;
    padding: 8px 12px;
  }
}
</style>
