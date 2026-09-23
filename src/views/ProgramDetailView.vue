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
          <RouterLink :to="{ name: 'my-program' }"
            >Retour à mes programmes</RouterLink
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

          <div v-if="program.workout_templates.length === 0">
            <h3>Aucune séance n'a encore été créée.</h3>

            <p>Créer une séance</p>
          </div>

          <div v-else>
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

<style scoped></style>
