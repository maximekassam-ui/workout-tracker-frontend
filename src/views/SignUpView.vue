<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { signUp } from "../services/api";

const router = useRouter();

const identifier = ref("");
const password = ref("");
const username = ref("");
const errorMessage = ref(null);
const isSubmitting = ref(false);

const handleSignUp = async () => {
  if (!identifier.value || !password.value || !username.value) {
    errorMessage.value = "Veuillez remplir tous les champs";
  } else {
    try {
      isSubmitting.value = true;

      const result = await signUp(
        identifier.value,
        password.value,
        username.value,
      );

      // console.log(result); jwt et infos user

      $cookies.set("userToken", result.jwt);

      router.push("/dashboard");

      return result;
    } catch (error) {
      errorMessage.value =
        error?.message || "Un problème est survenu, veuillez réessayer !";
    } finally {
      isSubmitting.value = false;
    }
  }
};
</script>

<template>
  <main>
    <div class="container">
      <form @submit.prevent="handleSignUp">
        <div class="logoDiv">
          <h1>Bonjour !</h1>

          <h4>Inscrivez-vous pour découvrir toutes nos fonctionnalités.</h4>

          <img
            src="../assets/imgs/Raptor Workout Tracker.png"
            alt="logo de Workout Tracker"
          />
        </div>

        <div id="infosDiv">
          <label for="username">Pseudo : </label>

          <input
            type="text"
            name="username"
            id="username"
            v-model="username"
            @input="errorMessage = ''"
          />

          <label for="identifier">Email : </label>

          <input
            type="email"
            name="identifier"
            id="identifier"
            v-model="identifier"
            @input="errorMessage = ''"
          />

          <label for="password">Mot de passe : </label>

          <input
            type="password"
            name="password"
            id="password"
            v-model="password"
            @input="errorMessage = ''"
          />

          <p id="errorMessage" v-if="errorMessage">{{ errorMessage }}</p>
          <p v-if="isSubmitting" id="isSubmitting">Inscription en cours..</p>
          <button v-else>S'inscrire</button>
        </div>

        <div id="loginDiv">
          <p>Vous avez déjà un compte ?</p>
          <RouterLink :to="{ name: 'login' }">Se connecter</RouterLink>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped>
main > div {
  display: flex;
  align-items: center;
  justify-content: center;
}

form {
  background-color: #161b22;
  border: 1px solid #30363d;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 680px;
  width: 500px;
  padding: 20px;
}

img {
  height: 100px;
  width: 100px;
  object-fit: cover;
  border-radius: 10px;
}
h1 {
  font-size: 35px;
  margin: 10px 0;
}
h4 {
  font-weight: 100;
}

/* ------------------------------ */

#infosDiv {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 1;
  padding: 15px;
  margin-top: -10px;
}

label {
  color: var(--secondary-text);
  margin-bottom: 10px;
}
input {
  border: solid 2px transparent;
  outline: none;
  width: 100%;
  font-size: 16px;
  min-width: 100%;
  background-color: white;
  display: flex;
  justify-content: flex-start;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 30px;
}

input:focus {
  border: 2px solid var(--purple-accent);
}

button {
  align-self: center;
  margin-top: 10px;
  padding: 10px;
  min-width: 200px;
  border-radius: 10px;
  background-color: var(--purple-accent);
  border: none;
  font-size: 16px;
  font-weight: bold;
  transition: 0.3s;
}

button:hover {
  transform: translateY(-2px);
  cursor: pointer;
  background-color: #8f6cf7;
}

#errorMessage,
#isSubmitting {
  color: var(--purple-accent);
  align-self: center;
  font-size: 16px;
}

/* ---------------------- */
#loginDiv {
  display: flex;
  flex-direction: column;
  align-items: center;
}
a {
  color: var(--main-text);
  font-weight: bold;
  padding: 0;
  text-decoration: underline;
}
a:hover {
  color: var(--purple-accent);
}

#loginDiv p {
  font-size: 16px;
}
</style>
