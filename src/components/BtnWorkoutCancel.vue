<script setup>
const emits = defineEmits({ stopWorkout: null });
</script>

<template>
  <div id="endWorkout">
    <button @click="$emit('stopWorkout')">Arrêter la séance</button>
  </div>
</template>

<style scoped></style>
