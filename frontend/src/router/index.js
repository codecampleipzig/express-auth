import Vue from "vue";
import VueRouter from "vue-router";
import Posts from "../views/Posts.vue";
import CreatePost from "../views/CreatePost.vue";
import Auth from "../views/Auth.vue";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Posts",
    component: Posts
  },
  {
    path: "/posts/new",
    name: "CreatePost",
    component: CreatePost,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/auth",
    name: "Auth",
    component: Auth
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
