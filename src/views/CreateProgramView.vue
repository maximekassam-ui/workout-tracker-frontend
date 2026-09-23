<script setup>
import { ref, inject } from "vue";
import { createProgram, getCurrentUser } from "../services/api";

const GlobalStore = inject("GlobalStore");

const programName = ref("");
const description = ref("");

const handleSubmit = async () => {
  const isActive = true;

  await createProgram(
    programName.value,
    description.value,
    isActive,
    GlobalStore.userToken.value,
  );
};
</script>

<template>
  <main>
    <div class="container">
      <form @submit.prevent="handleSubmit">
        <h1>Crée ton programme</h1>

        <label for="programName">Nom du programme : </label
        ><input
          type="text"
          name="programName"
          id="programName"
          v-model="programName"
        />

        <label for="description">Description du programme : </label
        ><textarea
          name="description"
          id="description"
          v-model="description"
          rows="10"
          cols="40"
        ></textarea>

        <button>Enregistrer</button>
      </form>
    </div>
  </main>
</template>

<style scoped></style>
