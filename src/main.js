import { createApp, ref } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { getUserToken } from "./providers";

import VueCookies from "vue-cookies";

const app = createApp(App);

app.use(VueCookies);
app.use(router);

const Token = getUserToken();

const userToken = ref(Token || "");
const currentWorkout = ref(null);

app.provide("GlobalStore", { userToken: userToken, currentWorkout });

app.mount("#app");
