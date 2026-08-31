<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../services/api";

const router = useRouter();

const identifier = ref("");
const password = ref("");

const handleLogin = async () => {
  const result = await login(identifier.value, password.value);

  // console.log(result); jwt et infis user

  $cookies.set("userToken", result.jwt);

  router.push("/dashboard");

  return result;
};
</script>

<template>
  <main>
    <div>
      <form @submit.prevent="handleLogin">
        <label for="identifier"></label
        ><input
          type="email"
          name="identifier"
          id="identifier"
          placeholder="Email"
          v-model="identifier"
        />

        <label for="password"></label
        ><input
          type="password"
          name="password"
          id="password"
          placeholder="Mot de passe"
          v-model="password"
        />

        <button>Se connecter</button>
      </form>
    </div>
  </main>
</template>

<style scoped></style>
