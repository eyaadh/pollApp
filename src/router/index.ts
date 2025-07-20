import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/poll/:id/manage",
      name: "manage-poll",
      component: () => import("../views/ManagePollView.vue"),
    },
    {
      path: "/poll/:id/vote",
      name: "vote",
      component: () => import("../views/VoteView.vue"),
    },
    {
      path: "/poll/:id/results",
      name: "results",
      component: () => import("../views/ResultsView.vue"),
    },
  ],
});

export default router;
