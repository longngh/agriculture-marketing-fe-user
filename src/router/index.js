import Vue from "vue";
import VueRouter from "vue-router";

// import alert from "@/plugins/alert";

Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/home/pages/home.vue"),
  },
  {
    path: "/product",
    name: "Product",
    component: () => import("../views/product/pages/list-product.vue"),
  },
  {
    path: "/product/:code",
    name: "Product Detail",
    component: () => import("../views/product/pages/product-detail.vue"),
  },
  {
    path: "/news",
    name: "List New",
    component: () => import("../views/news/pages/list-news.vue"),
  },
  {
    path: "/news/:code",
    name: "News Detail",
    component: () => import("../views/news/pages/news-detail.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

// router.beforeEach((to, from, next) => {
//   const user = userStore();
//   if (to.meta && to.meta.requiresAuth && !user.isConnected) {
//     alert.error("You need to login before accessing this site!");
//     next("/login");
//   }
//   if (to.meta && to.meta.requiresPartnerAuth && !user.isPartner) {
//     alert.error("Only Partner is allowed!");
//     next("/dashboard");
//   }
//   if (to.meta && to.meta.requiresMaintainerAuth && !user.isMaintainer) {
//     alert.error("Only Partner is allowed!");
//     next("/dashboard");
//   }
//   next();
// });

export default router;
