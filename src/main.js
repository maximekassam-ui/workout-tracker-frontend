import { createApp, ref } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { getUserToken } from "./providers";

import VueCookies from "vue-cookies";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
  faArrowAltCircleUp,
  faBullseye,
  faChartBar,
  faClipboardList,
  faDoorOpen,
  faDumbbell,
  faPlusCircle,
  faSignOutAlt,
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

  faSignOutAlt,
);

const app = createApp(App);

app.use(VueCookies);
app.use(router);

const Token = getUserToken();

const userToken = ref(Token || "");
const currentWorkout = ref(null);

app.provide("GlobalStore", { userToken: userToken, currentWorkout });

app.component("font-awesome-icon", FontAwesomeIcon).mount("#app");
