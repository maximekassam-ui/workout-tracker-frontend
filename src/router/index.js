import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import Dashboard from "../views/DashboardView.vue";
import CurrentWorkoutView from "../views/CurrentWorkoutView.vue";
import WorkoutsHistoryView from "../views/WorkoutsHistoryView.vue";

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
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
    },
    {
      path: "/current-workout",
      name: "current-workout",
      component: CurrentWorkoutView,
    },
    {
      path: "/workouts-history",
      name: "workouts-history",
      component: WorkoutsHistoryView,
    },
  ],
});

export default router;
