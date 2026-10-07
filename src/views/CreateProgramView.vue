<script setup>
import { ref, inject } from "vue";
import { createProgram } from "../services/programApi";
import { useRouter } from "vue-router";

const GlobalStore = inject("GlobalStore");
const router = useRouter();

const programName = ref("");
const description = ref("");
const errorMessage = ref("");
const isSubmitting = ref(false);

const handleSubmit = async () => {
  if (!programName.value) {
    return (errorMessage.value = "Veuillez donner un nom à votre séance");
  }
  errorMessage.value = "";
  isSubmitting.value = true;
  try {
    const isActive = true;

    const program = await createProgram(
      programName.value,
      description.value,
      isActive,
      GlobalStore.userToken.value,
    );

    console.log("Programme créé :", program);

    router.push({
      name: "program-detail",
      params: { programDocumentId: program.documentId },
    });
  } catch (error) {
    errorMessage.value = "Un problème est survenu, veuillez réessayer";
    console.log(error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <main>
    <div class="container">
      <form @submit.prevent="handleSubmit" class="form">
        <h1>Crée ton programme</h1>

        <label for="programName">Nom du programme : </label
        ><input
          type="text"
          name="programName"
          id="programName"
          v-model="programName"
          @input="errorMessage = ''"
        />

        <label for="description">Description du programme : </label
        ><textarea
          name="description"
          id="description"
          v-model="description"
          rows="10"
          cols="40"
        ></textarea>

        <p v-if="errorMessage" class="errorMessage">{{ errorMessage }}</p>

        <button :disabled="isSubmitting">
          {{ !isSubmitting ? "Enregistrer" : "Création en cours..." }}
        </button>
      </form>
    </div>
  </main>
</template>

<style scoped>
.container {
  max-width: 700px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 30px;
  color: var(--main-text);
  text-align: center;
}
textarea {
  resize: vertical;
}

/* Media Query ------------- */

@media (max-width: 500px) {
  main {
    padding: 20px 10px;
  }

  form {
    padding: 20px;
  }

  h1 {
    font-size: 24px;
  }
  textarea {
    height: 150px;
  }
  input,
  textarea,
  button {
    font-size: 15px;
  }
}
</style>
