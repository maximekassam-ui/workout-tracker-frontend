import { createRouter, createWebHistory } from "vue-router";

import { getUserToken } from "../providers";

import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import Dashboard from "../views/DashboardView.vue";
import CurrentWorkoutView from "../views/CurrentWorkoutView.vue";
import WorkoutsHistoryView from "../views/WorkoutsHistoryView.vue";
import SignUpView from "../views/SignUpView.vue";
import ProfilView from "../views/ProfilView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
      meta: { requireAuth: true },
    },
    {
      path: "/current-workout",
      name: "current-workout",
      component: CurrentWorkoutView,
      meta: { requireAuth: true },
    },
    {
      path: "/workouts-history",
      name: "workouts-history",
      component: WorkoutsHistoryView,
      meta: { requireAuth: true },
    },
    {
      path: "/sign-up",
      name: "sign-up",
      component: SignUpView,
      meta: { guestOnly: true },
    },
    {
      path: "/profil",
      name: "profil",
      component: ProfilView,
      meta: { requireAuth: true },
    },
  ],
});

router.beforeEach((to, from) => {
  const token = getUserToken();

  if (to.meta.requireAuth && !token) {
    return { name: "login", query: { redirect: to.name } };
  } else if (to.meta.guestOnly && token) {
    return { name: "dashboard" };
  }
});

export default router;
