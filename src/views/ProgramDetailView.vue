<script setup>
import { useRoute } from "vue-router";
import { getProgram } from "../services/api";
import { inject, onMounted, ref } from "vue";

const route = useRoute();
// console.log(route.params.documentId);
const GlobalStore = inject("GlobalStore");

const program = ref(null);

onMounted(async () => {
  try {
    const { data } = await getProgram(
      route.params.documentId,
      GlobalStore.userToken.value,
    );

    console.log(data);

    program.value = data;
  } catch (error) {}
});
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
              <p v-if="program.is_active === true">Actif</p>
              <p v-else>Inactif</p>
            </div>
          </div>
        </section>

        <section id="workoutsSection">
          <div>
            <h2>Mes séances</h2>
            <p>Ajouter une séance</p>
          </div>

          <div v-if="program.workout_templates.length === 0" id="noWorkouts">
            <h3>Aucune séance n'a encore été créée.</h3>

            <p>Créer une séance</p>
          </div>

          <div v-else id="allWorkouts">
            <div v-for="workout in program.workout_templates">
              <div class="workoutCard">
                <h3>{{ workout.name }}</h3>
                <h4>{{ workout.category }}</h4>
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
              </div>
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
  padding: 10px 30px 30px 30px;
  margin-bottom: 50px;
  border-bottom: solid 1px var(--secondary-text);
}

#titleSection > a {
  color: var(--main-text);
  display: inline-block;
  justify-self: flex-start;
  align-self: flex-start;
  margin-bottom: 70px;
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
  border: 1px solid var(--purple-accent);
  border-radius: 20px;
  padding: 8px 18px;
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

#workoutsSection > div:first-child p {
  border: 1px solid var(--purple-accent);
  border-radius: 10px;
  padding: 10px 20px;
  cursor: pointer;
}

#allWorkouts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.workoutCard {
  border: 1px solid var(--purple-accent);
  border-radius: 15px;
  padding: 25px;
  min-height: 200px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  transition: 0.2s;
}

.workoutCard:hover {
  transform: translateY(-3px);
}

.workoutCard h3 {
  margin: 0;
  font-size: 1.5rem;
  padding: 5px 12px;
  border-radius: 20px;
  background-color: var(--purple-accent);
}
#noWorkouts {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.workoutCard h4:first-of-type {
  display: inline-block;
  margin: 15px 0;

  color: var(--main-text);
}

.workoutCard h4:nth-of-type(2) {
  margin: 0;
  color: var(--secondary-text);
  font-weight: normal;
}

.workoutCard h4:last-child {
  margin: 20px 0 0;
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
}
</style>
