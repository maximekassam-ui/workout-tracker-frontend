import { createApp, ref } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { getUserToken, logout } from "./providers";

import VueCookies from "vue-cookies";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
  faArrowAltCircleUp,
  faArrowLeft,
  faBars,
  faBullseye,
  faChartBar,
  faClipboardList,
  faDumbbell,
  faEye,
  faEyeSlash,
  faPlusCircle,
  faSignOutAlt,
  faTimes,
  faUser,
  faWindowMinimize,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faWindowMinimize,
  faUser,
  faPlusCircle,
  faClipboardList,
  faArrowAltCircleUp,
  faDumbbell,
  faChartBar,
  faBullseye,
  faBars,
  faSignOutAlt,
  faTimes,
  faEye,
  faEyeSlash,
  faArrowLeft,
);

const app = createApp(App);

app.use(VueCookies);
app.use(router);

const Token = getUserToken();

const userToken = ref(Token || "");
const currentWorkout = ref(null);

const logoutUser = () => {
  logout();
  userToken.value = "";
};

app.provide("GlobalStore", {
  userToken: userToken,
  currentWorkout,
  logout: logoutUser,
});

app.component("font-awesome-icon", FontAwesomeIcon).mount("#app");
