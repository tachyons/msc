import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/Login";
import SpeechSampler from "@/views/SpeechSampler";
import store from "@/store";
import firebase from "firebase/app";

Vue.use(Router);

let router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: "/record",
      name: "Record",
      component: SpeechSampler,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (currentUser) {
    console.log(`${currentUser.displayName} Logged in`);
    store.commit("setUser", currentUser);
    store.commit("setIsAuthenticated", true);
    requiresAuth = false;
  }
  if (requiresAuth) {
    if (!currentUser) {
      next("login");
    } else {
      next("record");
    }
  } else {
    next();
  }
});

export default router;
