<script setup>
import { ref, onMounted, inject } from "vue";
import { getCurrentUser, updateUserProfil } from "../services/api";
import { useRouter } from "vue-router";

const GlobalStore = inject("GlobalStore");
const router = useRouter();

const userInfos = ref(null);
const isEditing = ref(false);
const editedUsername = ref("");
const editedEmail = ref("");
const errorMessage = ref("");
const successMessage = ref("");

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

const handleEdit = () => {
  editedUsername.value = userInfos.value.username;
  editedEmail.value = userInfos.value.email;
  errorMessage.value = "";
  successMessage.value = "";

  isEditing.value = true;
};

const handleCancel = () => {
  editedUsername.value = "";
  editedEmail.value = "";
  errorMessage.value = "";
  successMessage.value = "";

  isEditing.value = false;
};

const handleSave = async () => {
  const cleanedUsername = editedUsername.value.trim();
  const cleanedEmail = editedEmail.value.trim();
  errorMessage.value = "";
  successMessage.value = "";

  if (!cleanedUsername || cleanedUsername.length < 3) {
    errorMessage.value = "Le pseudo doit contenir au moins 3 caractères";
    return;
  }
  if (!cleanedEmail) {
    errorMessage.value = "L'email n'est pas valide";
    return;
  }
  if (
    !cleanedEmail.includes("@") ||
    !cleanedEmail.includes(".") ||
    cleanedEmail[0] === "@" ||
    cleanedEmail.endsWith(".")
  ) {
    errorMessage.value = "L'email n'est pas valide";
    return;
  }

  try {
    const response = await updateUserProfil(
      GlobalStore.userToken.value,
      cleanedUsername,
      cleanedEmail,
    );
    console.log(response);

    userInfos.value.username = response.username;
    userInfos.value.email = response.email;
    isEditing.value = false;
    successMessage.value = "Votre profil a été mis à jour avec succès.";
  } catch (error) {
    console.log(error);
    errorMessage.value = error.message;
  }
};
</script>

<template>
  <main>
    <div class="container">
      <section v-if="!userInfos"><h4>Chargement en cours</h4></section>

      <section v-else>
        <h1>Mon profil</h1>

        <p v-if="successMessage">{{ successMessage }}</p>

        <div id="userInfos" v-if="!isEditing">
          <h2>Pseudo : {{ userInfos.username }}</h2>

          <h2>Email : {{ userInfos.email }}</h2>

          <button @click="handleEdit" class="mainButton">
            Modifier mes informations
          </button>
        </div>

        <div v-else>
          <form @submit.prevent="handleSave" class="form">
            <label for="editedUsername">Pseudo : </label>
            <input
              type="text"
              id="editedUsername"
              v-model="editedUsername"
              placeholder="Saisissez votre pseudo"
            />

            <label for="editedEmail">Email : </label>
            <input
              type="email"
              id="editedEmail"
              v-model="editedEmail"
              placeholder="Saisissez votre email"
            />
            <p v-if="errorMessage">{{ errorMessage }}</p>

            <button type="submit" class="mainButton">Enregistrer</button>
            <button type="button" @click="handleCancel" class="cancelButton">
              Annuler
            </button>
          </form>
        </div>

        <button @click="handleLogout" class="logoutButton">
          Se déconnecter
        </button>
      </section>
    </div>
  </main>
</template>

<style scoped>
.container {
  width: min(100% - 32px, 1050px);
}

#userInfos button {
  margin-top: 12px;
}

#userInfos {
  background-color: var(--bgc-secondary);
  border: 1px solid var(--accent-border);
  border-radius: 10px;
  padding: 30px;
  margin: 0 auto 30px;
  max-width: 600px;
}
#userInfos h2 {
  margin-bottom: 20px;
}
form.form {
  border: 1px solid var(--accent-border);
  background-color: var(--bgc-secondary);
  margin-bottom: 30px;
}

form.form label {
  width: 100%;
  text-align: left;
}

form.form input {
  margin-bottom: 10px;
}

form.form input:focus {
  border-color: var(--purple-accent);
}

button {
  background-color: var(--purple-accent);
  min-width: fit-content;
  padding: 5px 10px;
  border-radius: 7px;
  font-size: 17px;
  border: solid 1px var(--main-bg);
}

.mainButton {
  background-color: var(--purple-accent);
  color: var(--main-text);
  cursor: pointer;
}

.cancelButton {
  background-color: transparent;
  color: var(--main-text);
  border: 1px solid var(--accent-border);
  cursor: pointer;
  margin-left: 8px;
}

.logoutButton {
  background-color: transparent;
  color: var(--secondary-text);
  border: 1px solid var(--accent-border);
  cursor: pointer;
}
.mainButton,
.cancelButton,
.logoutButton {
  min-height: 40px;
  padding: 8px 16px;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.mainButton:hover,
.cancelButton:hover,
.logoutButton:hover {
  transform: translateY(-2px);
}

/* Media Query --------- */
@media (max-width: 600px) {
  #userInfos {
    padding: 20px;
  }

  form.form {
    padding: 24px 18px;
  }

  .cancelButton {
    margin-left: 0;
    margin-top: 10px;
  }
}
</style>
