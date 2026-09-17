<script setup>
import { ref, onMounted, inject } from "vue";
import { getCurrentUser } from "../services/api";
import { useRouter } from "vue-router";

const GlobalStore = inject("GlobalStore");
const router = useRouter();

const userInfos = ref(null);

onMounted(async () => {
  try {
    const response = await getCurrentUser(GlobalStore.userToken.value);

    // console.log(response);

    userInfos.value = response;

    console.log(userInfos.value);
  } catch (error) {
    console.log(error);
  }
});

const handleLogout = () => {
  GlobalStore.logout();

  router.push({ name: "home" });
};
</script>

<template>
  <main>
    <div class="container">
      <section v-if="!userInfos"><h4>Chargement en cours</h4></section>

      <section v-else>
        <h1>Mon profil</h1>

        <div id="userInfos">
          <h2>Pseudo : {{ userInfos.username }}</h2>

          <h2>Email : {{ userInfos.email }}</h2>
        </div>

        <button @click="handleLogout">Se déconnecter</button>
      </section>
    </div>
  </main>
</template>

<style scoped>
button {
  background-color: var(--purple-accent);
  min-width: fit-content;
  padding: 5px 10px;
  border-radius: 7px;
  font-size: 17px;
  border: solid 1px var(--main-bg);
}
</style>
