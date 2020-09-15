import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import router from "../router";

Vue.use(Vuex);

let lastUsedId = 0;

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      paths: ["user", "jwt", "posts"]
    })
  ],
  state: {
    user: { email: "" },
    jwt: null,
    posts: [],
    notifications: []
  },
  mutations: {
    PUSH_NOTIFICATION(state, notification) {
      state.notifications.push(notification);
    },
    REMOVE_NOTIFICATION(state, id) {
      state.notifications = state.notifications.filter(
        notification => notification.id != id
      );
    },
    SET_POSTS(state, posts) {
      state.posts = posts;
    },
    SET_AUTH_DATA(state, { user, jwt }) {
      state.user = user;
      state.jwt = jwt;
    },
    LOGOUT(state) {
      state.user = null;
      state.jwt = null;
      state.posts = [];
    }
  },
  actions: {
    async fetchPosts({ dispatch, commit, state }) {
      try {
        const body = await (
          await fetch("http://localhost:3000/posts", {
            headers: {
              Authorization: `Bearer ${state.jwt}`
            }
          })
        ).json();

        if (body.error) {
          throw new Error(body.error);
        }

        commit("SET_POSTS", body);
      } catch (error) {
        dispatch("pushNotification", "Sorry, couldn't get latest posts...");
      }
    },
    async createPost({ dispatch, state }, post) {
      try {
        const body = await (
          await fetch("http://localhost:3000/posts", {
            method: "POST",
            body: JSON.stringify(post),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${state.jwt}`
            }
          })
        ).json();

        if (body.error) {
          throw new Error(body.error);
        }
      } catch (error) {
        dispatch(
          "pushNotification",
          "Sorry, couldn't create post. Try again later"
        );
      }
    },
    async signin({ commit, dispatch }, payload) {
      try {
        const body = await (
          await fetch("http://localhost:3000/auth/signin", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }
          })
        ).json();

        if (body.error) {
          throw new Error(body.error);
        }

        commit("SET_AUTH_DATA", body);
      } catch (error) {
        dispatch(
          "pushNotification",
          "Login failed, please check your email and password"
        );
        throw error;
      }
    },
    async signup({ commit, dispatch }, payload) {
      try {
        const body = await (
          await fetch("http://localhost:3000/auth/signup", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json"
            }
          })
        ).json();

        if (body.error) {
          throw new Error(body.error);
        }

        commit("SET_AUTH_DATA", body);
      } catch (error) {
        dispatch(
          "pushNotification",
          "Signup failed, please check your email and password"
        );
        throw error;
      }
    },
    logout({ commit }) {
      commit("LOGOUT");
      router.push({ name: "Auth" });
    },
    pushNotification({ commit }, text) {
      const notification = {
        id: ++lastUsedId,
        text
      };
      commit("PUSH_NOTIFICATION", notification);
      setTimeout(() => {
        commit("REMOVE_NOTIFICATION", notification.id);
      }, 5000);
    }
  },
  modules: {}
});
