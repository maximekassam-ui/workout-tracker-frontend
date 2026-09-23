import { createRouter, createWebHistory } from "vue-router";

import { getUserToken } from "../providers";

import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import Dashboard from "../views/DashboardView.vue";
import CurrentWorkoutView from "../views/CurrentWorkoutView.vue";
import WorkoutsHistoryView from "../views/WorkoutsHistoryView.vue";
import SignUpView from "../views/SignUpView.vue";
import ProfilView from "../views/ProfilView.vue";
import CreateProgramView from "../views/CreateProgramView.vue";
import MyProgramView from "../views/MyProgramView.vue";
import ProgressView from "../views/ProgressView.vue";
import ExercicesListView from "../views/ExercicesListView.vue";
import StatistiquesView from "../views/StatistiquesView.vue";
import GoalsView from "../views/GoalsView.vue";
import ProgramDetailView from "../views/ProgramDetailView.vue";

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
    {
      path: "/create-program",
      name: "create-program",
      component: CreateProgramView,
      meta: { requireAuth: true },
    },
    {
      path: "/my-program",
      name: "my-program",
      component: MyProgramView,
      meta: { requireAuth: true },
    },
    {
      path: "/my-program/:documentId",
      name: "program-detail",
      component: ProgramDetailView,
      meta: { requireAuth: true },
    },
    {
      path: "/progress",
      name: "progress",
      component: ProgressView,
      meta: { requireAuth: true },
    },
    {
      path: "/exercises-list",
      name: "exercises-list",
      component: ExercicesListView,
    },
    {
      path: "/statistics",
      name: "statistics",
      component: StatistiquesView,
      meta: { requireAuth: true },
    },
    {
      path: "/goals",
      name: "goals",
      component: GoalsView,
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
