<script setup>
import { ref, inject } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { signUp } from "../services/api";

const router = useRouter();
const route = useRoute();
const GlobalStore = inject("GlobalStore");

const identifier = ref("");
const password = ref("");
const username = ref("");
const errorMessage = ref(null);
const isSubmitting = ref(false);
const isPasswordVisible = ref(false);

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
      GlobalStore.userToken.value = result.jwt;

      router.push({ name: route.query.redirect || "dashboard" });
    } catch (error) {
      if (error.message === "Email or Username are already taken") {
        errorMessage.value = "L'email ou le pseudo sont déjà pris";
      } else {
        errorMessage.value =
          error?.message || "Un problème est survenu, veuillez réessayer !";
      }
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

          <div id="passwordDiv">
            <input
              :type="isPasswordVisible ? 'text' : 'password'"
              name="password"
              id="password"
              v-model="password"
              @input="errorMessage = ''"
            />

            <div>
              <font-awesome-icon
                :icon="['fas', 'eye']"
                @click="isPasswordVisible = false"
                v-if="isPasswordVisible"
              />

              <font-awesome-icon
                :icon="['fas', 'eye-slash']"
                @click="isPasswordVisible = true"
                v-else
              />
            </div>
          </div>

          <p id="errorMessage" v-if="errorMessage">{{ errorMessage }}</p>
          <p v-if="isSubmitting" id="isSubmitting">Inscription en cours..</p>
          <button v-else>S'inscrire</button>
        </div>

        <div id="loginDiv">
          <p>Vous avez déjà un compte ?</p>
          <RouterLink
            :to="{ name: 'login', query: { redirect: route.query.redirect } }"
            >Se connecter</RouterLink
          >
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
  margin-bottom: 20px;
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
  background-color: white;
  display: flex;
  justify-content: flex-start;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 25px;
}

input:focus:not(#password) {
  border: 2px solid var(--purple-accent);
}

#passwordDiv {
  margin-bottom: 20px;
  width: 100%;
  height: fit-content;
  display: flex;
  align-items: center;
  border: 2px solid transparent;
  border-radius: 10px;
  overflow: hidden;
}

#passwordDiv:focus-within {
  border: 2px solid var(--purple-accent);
}

#password {
  flex: 1;
  width: auto;
  margin-bottom: 0;
  border-radius: 0;
}

#passwordDiv div {
  width: 45px;
  flex: none;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-left: solid 1px var(--secondary-text);
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

/* Media Query ------------- */

@media (max-width: 500px) {
  main {
    padding: 20px 15px;
  }
}

@media (max-width: 350px) {
  img {
    height: 70px;
    width: 70px;
  }

  #errorMessage {
    font-size: 12px;
  }
}
</style>
