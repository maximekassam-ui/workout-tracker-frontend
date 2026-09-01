<script setup>
import { inject, onMounted, ref } from "vue";
import { getCurrentWorkout } from "../services/api";
import axios from "axios";
import { API_URL } from "../services/api";

const GlobalStore = inject("GlobalStore");
const currentWorkout = GlobalStore.currentWorkout;

const reps = ref(0);
const load = ref(0);
const completed = ref(true);
const errorMessage = ref("");
const isSubmiting = ref(false);

onMounted(async () => {
  try {
    const response = await getCurrentWorkout(GlobalStore.userToken.value);

    GlobalStore.currentWorkout.value = response;
    // console.log(response);
  } catch (error) {
    console.log(error.message);
  }
});

const handleSet = async () => {
  isSubmiting.value = true;

  if (
    GlobalStore.currentWorkout.value.pendingWorkoutExercise.sets.length ===
    GlobalStore.currentWorkout.value.pendingWorkoutExercise.program_exercise
      .target_sets
  ) {
    errorMessage.value = "Vous avez déjà effectué toutes vos séries";
  } else {
    if (reps.value === 0 || load.value === 0) {
      errorMessage.value = "Veuillez remplir tous les champs";
    } else {
      try {
        let setNumber =
          GlobalStore.currentWorkout.value.pendingWorkoutExercise.sets.length +
          1;

        const { data } = await axios.post(
          `${API_URL}/api/sets`,
          {
            set_number: setNumber,
            reps: reps.value,
            load: load.value,
            completed: completed.value,
            workoutExerciseId:
              GlobalStore.currentWorkout.value.pendingWorkoutExercise
                .documentId,
          },

          {
            headers: { Authorization: `Bearer ${GlobalStore.userToken.value}` },
          },
        );

        console.log(">>>>>>>>", data);
        GlobalStore.currentWorkout.value.pendingWorkoutExercise.sets.push(data);

        reps.value = 0;
        load.value = 0;
        errorMessage.value = "";
      } catch (error) {
        console.log(error.response.data);
      }
    }
  }
  isSubmiting.value = true;
};
</script>

<template>
  <main>
    <section id="title"><h1>Séance en cours</h1></section>

    <p v-if="!currentWorkout">Chargement de la séance...</p>

    <section v-else id="mainSection">
      <section class="exerciseName">
        <h2>
          {{ currentWorkout.pendingWorkoutExercise.exercise.name }}
        </h2>
        <p>
          Sets :
          {{
            currentWorkout.pendingWorkoutExercise.program_exercise.target_sets
          }}
          séries
        </p>
        <p>
          {{
            currentWorkout.pendingWorkoutExercise.program_exercise
              .target_reps_min
          }}
          -
          {{
            currentWorkout.pendingWorkoutExercise.program_exercise
              .target_reps_max
          }}
          répétitions
        </p>
        <p>
          {{
            currentWorkout.pendingWorkoutExercise.program_exercise.target_load
          }}
          kg
        </p>
      </section>

      <section class="seriesDone">
        <h2>Séries réalisées</h2>
        <div v-for="Sets in currentWorkout.pendingWorkoutExercise.sets">
          <p>Série n°{{ Sets.set_number }} :</p>
          <p v-if="Sets.completed === true">{{ Sets.reps }} reps</p>
          <font-awesome-icon :icon="['fas', 'window-minimize']" v-else />

          <p v-if="Sets.completed === true">{{ Sets.load }} kg</p>
          <font-awesome-icon :icon="['fas', 'window-minimize']" v-else />
        </div>
      </section>

      <section class="newSerie">
        <h2>Nouvelle série</h2>

        <form @submit.prevent="handleSet">
          <div>
            <label for="reps">Répétitions : </label
            ><input
              type="number"
              id="reps"
              v-model="reps"
              @input="errorMessage = ''"
            />
          </div>

          <div>
            <label for="load">Charge : </label
            ><input
              type="number"
              id="load"
              v-model="load"
              @input="errorMessage = ''"
            /><span>kg</span>
          </div>

          <p v-if="errorMessage">{{ errorMessage }}</p>
          <button :class="{ disabled: isSubmiting === true }">
            Valider la série
          </button>
        </form>
      </section>

      <div id="exerciseDone">
        <button>Terminer exercice</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  padding: 20px;
  height: calc(100vh - var(--footer-heigth));
}

#title {
  height: 60px;
  border-bottom: solid 1px var(--border);
  margin-bottom: 20px;
}

#mainSection {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 30px;
}
/* --------------------- */

.exerciseName {
  border-bottom: solid 1px var(--border);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

/* --------------------- */

.seriesDone {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-bottom: solid 1px var(--border);
  flex: 1;
}
.seriesDone > div {
  /* border: solid green 1px; */
  width: 80%;
  margin: 0 auto;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}
svg {
  margin-left: 15px;
}
svg:last-child {
  margin-left: 23px;
}
/* --------------------- */

.newSerie {
  /* border: solid red 2px; */
  display: flex;
  flex-direction: column;
  flex: 1;
  border-bottom: solid 1px var(--border);
  gap: 10px;
}
form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}
form > div {
  width: 50%;
  display: flex;
  justify-content: start;
}
form div:last-of-type {
  /* border: solid red 2px; */
}
label {
  display: block;
  width: 100px;
  margin-right: 10px;
}
input {
  width: 30px;
  text-align: center;
}
span {
  margin-left: 10px;
}
form > button {
  margin-top: 20px;
}
button:disabled {
  background-color: #e0e0e0;
  color: #9e9e9e;
  cursor: not-allowed;
  opacity: 0.6;
}
/* ---------------------- */
#exerciseDone {
  flex: 1;
}

/* --  */
/* Pour Chrome, Safari, Edge et Opera */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Pour Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
