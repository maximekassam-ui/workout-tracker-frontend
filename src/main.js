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
  faBookOpen,
  faBullseye,
  faChartBar,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faCircle,
  faClipboardList,
  faClock,
  faDumbbell,
  faEye,
  faEyeSlash,
  faLayerGroup,
  faMale,
  faPlusCircle,
  faRoute,
  faSignOutAlt,
  faSync,
  faTasks,
  faTimes,
  faTrash,
  faUser,
  faWindowMinimize,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

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
  faChevronDown,
  faCircle,
  faChevronLeft,
  faChevronRight,
  faTrash,
  faBookOpen,
  faTasks,
  faHeart,
  faLayerGroup,
  faSync,
  faClock,
  faRoute,
  faMale,
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
