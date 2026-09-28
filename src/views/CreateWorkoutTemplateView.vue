<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, inject } from "vue";
import { createWorkoutTemplate } from "../services/api";

const route = useRoute();
const router = useRouter();
const GlobalStore = inject("GlobalStore");

console.log(route.params.documentId);

const workoutName = ref("");
const category = ref("");
const description = ref("");
const errorMessage = ref("");

const handleSubmit = async () => {
  //   console.log(
  //     workoutName.value,
  //     category.value,
  //     description.value,
  //     route.params.documentId,
  //   );

  if (!workoutName.value || !category.value) {
    errorMessage.value = "Veuillez remplir les champs obligatoires";
  } else {
    const response = await createWorkoutTemplate(
      workoutName.value,
      category.value,
      description.value,
      route.params.documentId,
      GlobalStore.userToken.value,
    );

    console.log(response);

    router.push({
      name: "program-detail",
      params: { documentId: route.params.documentId },
    });
  }
};
</script>

<template>
  <main>
    <div class="container">
      <form @submit.prevent="handleSubmit">
        <h1>Créer ta séance</h1>

        <div>
          <label for="workoutName">Nom de la séance </label> <sup>*</sup>
        </div>

        <input
          type="text"
          id="workoutName"
          v-model="workoutName"
          @input="errorMessage = ''"
        />

        <div><label for="category">Catégorie </label><sup>*</sup></div>

        <div id="selectDiv">
          <select
            name="category"
            id="category"
            v-model="category"
            @change="errorMessage = ''"
          >
            <option value="">--Veuillez choisir une option--</option>
            <option value="UPPER">Upper</option>
            <option value="LOWER">Lower</option>
            <option value="PUSH">Push</option>
            <option value="PULL">Pull</option>
            <option value="LEGS">Legs</option>
            <option value="FULL_BODY">Full body</option>
          </select>

          <font-awesome-icon :icon="['fas', 'chevron-down']" />
        </div>

        <label for="description">Description : </label>
        <textarea
          name="description"
          id="description"
          cols="40"
          rows="5"
          v-model="description"
        ></textarea>

        <p v-if="errorMessage" id="errorMessage">{{ errorMessage }}</p>

        <button>Créer la séance</button>
      </form>
    </div>
  </main>
</template>

<style scoped>
form {
  border: solid 1px var(--accent-border);
  border-radius: 10px;
  margin: 0 auto;
  max-width: 600px;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
h1 {
  margin: 0 0 45px;
}

input,
textarea {
  width: 100%;
  background-color: var(--accent-border);
  border: solid 2px transparent;
  border-radius: 10px;
  color: var(--main-text);
  padding: 10px;
  outline: none;
  margin-bottom: 20px;
  font-size: 16px;
}
select {
  appearance: none;
  width: 100%;
  height: 100%;
  background-color: var(--accent-border);
  border: none;
  color: var(--main-text);
  font-size: 16px;
  outline: none;
  padding: 10px;
  border-radius: 10px;
}
input {
  height: 40px;
}

input:focus,
#selectDiv:focus-within,
textarea:focus {
  border: solid 2px var(--purple-accent);
}
textarea {
  resize: vertical;
}
#selectDiv {
  background-color: var(--accent-border);
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border: solid 2px transparent;
  border-radius: 10px;
  position: relative;
}

svg {
  color: var(--main-text);
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
form > div:not(#selectDiv) {
  display: flex;
  width: 100%;
  gap: 5px;
}
label {
  color: var(--main-text);
  align-self: flex-start;
  margin-left: 5px;
}
sup {
  color: var(--purple-accent);
}

button {
  background-color: var(--purple-accent);
  border: none;
  height: 40px;
  width: 250px;
  border-radius: 10px;
  margin-top: 20px;
  color: var(--main-text);
  font-size: 18px;
  font-weight: bold;
  transition: 0.3s;
}
button:hover {
  cursor: pointer;
  transform: translateY(-2px);
}
#errorMessage {
  font-size: 14px;
  color: var(--purple-accent);
}

/* Media Query ---------- */
@media (max-width: 600px) {
  .container {
    padding: 20px;
  }
}
@media (max-width: 450px) {
  button {
    width: 175px;
  }
}
</style>
