<script setup>
import { onMounted, ref, inject } from "vue";

import { getCurrentUser, getMyPrograms } from "../services/api";

const GlobalStore = inject("GlobalStore");

const allProgram = ref([]);

const userInfos = getCurrentUser(GlobalStore.userToken.value);
console.log(userInfos);

// onMounted(async () => {
//   try {
//     console.log("hello");

//     const response = await getMyPrograms(GlobalStore.userToken.value);
//   } catch (error) {
//     console.log(error.message);
//   }
// });
</script>

<template>
  <main>
    <div class="container">
      <h1>Mes programmes</h1>
      <h2>Page en cours de création</h2>
    </div>
  </main>
</template>

<style scoped></style>
