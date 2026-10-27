<script setup>
import { getCurrentWorkout, startWorkout } from "../services/workoutApi";
import { getCurrentUser } from "../services/api";
import { onMounted, inject, ref, computed } from "vue";
import { RouterLink, useRouter } from "vue-router";

const GlobalStore = inject("GlobalStore");
const currentWorkout = GlobalStore.currentWorkout;
const router = useRouter();

const isLoading = ref(true);
const mainProgram = ref(null);
const selectedWorkoutTemplateId = ref(null);
const showStartConfirmation = ref(false);
const errorMessage = ref("");
const isSubmitting = ref(false);
const loadError = ref("");

const selectWorkoutTemplate = (documentId) => {
  selectedWorkoutTemplateId.value = documentId;
  showStartConfirmation.value = true;
};

const selectedWorkoutTemplate = computed(() => {
  if (mainProgram.value) {
    return mainProgram.value.workout_templates.find(
      (workoutTemplate) =>
        workoutTemplate.documentId === selectedWorkoutTemplateId.value,
    );
  }
  return null;
});

const handleStartWorkout = async (documentId) => {
  try {
    errorMessage.value = "";
    isSubmitting.value = true;

    await startWorkout(GlobalStore.userToken.value, documentId);

    const newWorkout = await getCurrentWorkout(GlobalStore.userToken.value);
    GlobalStore.currentWorkout.value = newWorkout;

    router.push({ name: "current-workout" });
  } catch (error) {
    errorMessage.value =
      error.message ||
      "Une erreur est survenue lors du démarrage de la séance.";
  } finally {
    isSubmitting.value = false;
  }
};

const loadDashboard = async () => {
  loadError.value = "";
  isLoading.value = true;
  try {
    try {
      const response = await getCurrentWorkout(GlobalStore.userToken.value);

      GlobalStore.currentWorkout.value = response;
    } catch (error) {
      loadError.value =
        "Impossible de récupérer ta séance en cours. Réessaie dans un instant.";
      console.log(error.message);
    }
    try {
      const currentUser = await getCurrentUser(GlobalStore.userToken.value);

      const activeProgram = currentUser.programs.find(
        (program) => program.is_active === true,
      );

      mainProgram.value = activeProgram;
    } catch (error) {
      if (!loadError.value) {
        loadError.value =
          "Impossible de charger ton programme. Réessaie dans un instant";
      }

      console.log(error.message);
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  loadDashboard();
});
</script>

<template>
  <main>
    <div class="container">
      <section class="titleSection">
        <h1>Ton espace entraînement</h1>
        <p>Planifie. Entraîne-toi. Progresse.</p>
      </section>

      <p v-if="isLoading">Chargement en cours ...</p>

      <div v-else-if="loadError" id="loadError">
        <p>{{ loadError }}</p>
        <button @click="loadDashboard">Réessayer</button>
      </div>

      <div v-else>
        <section v-if="currentWorkout">
          <RouterLink :to="{ name: 'current-workout' }" class="resumeWorkout">
            <div>
              <p>Reprendre la séance en cours</p>
            </div>
          </RouterLink>
        </section>

        <section v-else>
          <div v-if="mainProgram" id="activeProgram" class="workoutGrid">
            <h2 class="programTitle">{{ mainProgram.name }}</h2>
            <button
              type="button"
              v-for="workoutTemplate in mainProgram.workout_templates"
              :key="workoutTemplate.documentId"
              @click="selectWorkoutTemplate(workoutTemplate.documentId)"
              class="workoutCard"
            >
              <h3>{{ workoutTemplate.name }}</h3>
              <p id="categoryP">{{ workoutTemplate.category }}</p>
              <p>{{ workoutTemplate.description }}</p>
            </button>

            <div
              v-if="showStartConfirmation && selectedWorkoutTemplate"
              class="startConfirmation"
            >
              <h2>Démarrer une séance</h2>
              <p>
                Souhaites-tu démarrer la séance
                <strong>{{ selectedWorkoutTemplate.name }}</strong> ?
              </p>

              <p v-if="errorMessage" id="errorMessage">{{ errorMessage }}</p>

              <div id="buttonsDiv">
                <button
                  @click="
                    handleStartWorkout(selectedWorkoutTemplate.documentId)
                  "
                  class="startButton"
                  :disabled="isSubmitting"
                >
                  {{ !isSubmitting ? "Démarrer" : "Démarrage en cours…" }}
                </button>
                <button
                  @click="
                    showStartConfirmation = false;
                    errorMessage = '';
                  "
                  class="cancelButton"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>

          <div v-else>
            <p>
              Tu n'as pas encore de programme actif. Crée ou active un programme
              pour commencer tes entraînements.
            </p>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
.titleSection {
  margin-bottom: 36px;
}

.titleSection h1 {
  margin-bottom: 8px;
  color: var(--main-text);
  font-size: 2rem;
  font-weight: 700;
}

.titleSection p {
  margin: 0;
  color: var(--secondary-text);
  font-size: 1rem;
  line-height: 1.6;
}

.resumeWorkout {
  display: block;
  padding: 20px;
  color: var(--main-text);
  background-color: var(--bgc-secondary);
  border: 1px solid var(--accent-border);
  border-radius: 12px;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.resumeWorkout:hover {
  border-color: var(--purple-accent);
  transform: translateY(-2px);
}

.resumeWorkout p {
  margin: 0;
  font-weight: 600;
}

.programTitle {
  margin: 0 0 20px;
  color: var(--main-text);
  font-size: 1.5rem;
  font-weight: 600;
}

.programTitle,
.startConfirmation {
  grid-column: 1 / -1;
}

/* Grille des séances */
.workoutGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

/* Cartes des séances */
.workoutCard {
  padding: 20px;
  background-color: var(--bgc-secondary);
  border: 1px solid var(--accent-border);
  border-radius: 12px;
  width: 100%;

  cursor: pointer;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.workoutCard:hover {
  border-color: var(--purple-accent);
  transform: translateY(-2px);
}

.workoutCard h3 {
  margin: 0 0 12px;
  color: var(--main-text);
  font-size: 1.125rem;
  font-weight: 600;
}

.workoutCard p {
  margin: 0;
  color: var(--secondary-text);
  font-size: 0.875rem;
  text-transform: capitalize;
}

#categoryP {
  margin-bottom: 10px;
}

.workoutCard:focus-visible {
  outline: 2px solid var(--purple-accent);
  outline-offset: 3px;
}

.startConfirmation {
  margin-top: 24px;
  padding: 24px;
  background-color: var(--bgc-secondary);
  border: 1px solid var(--accent-border);
  border-radius: 12px;
}

.startConfirmation h2 {
  margin: 0 0 16px;
  color: var(--main-text);
  font-size: 1.25rem;
}

.startConfirmation p {
  margin: 0 0 16px;
  color: var(--secondary-text);
  line-height: 1.6;
}

.startConfirmation strong {
  color: var(--main-text);
}

#buttonsDiv {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.startButton {
  padding: 10px 18px;
  color: var(--main-text);
  background-color: var(--purple-accent);
  border: 1px solid var(--purple-accent);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.startButton:hover {
  opacity: 0.85;
}
.startButton:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancelButton {
  padding: 10px 18px;
  color: var(--main-text);
  background-color: transparent;
  border: 1px solid var(--accent-border);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.cancelButton:hover {
  background-color: var(--main-bg);
  border-color: var(--purple-accent);
}

#errorMessage {
  margin: 0 0 16px;
  padding: 12px 14px;
  color: #fca5a5;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.35);
  border-radius: 8px;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Media Query ---------------- */
@media (max-width: 1050px) {
  .container {
    padding: 0 20px;
  }
}

@media (max-width: 640px) {
  .workoutGrid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 400px) {
  .titleSection h1 {
    font-size: 1.75rem;
  }
}
</style>
