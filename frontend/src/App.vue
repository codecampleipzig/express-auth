<template>
  <div id="app">
    <button v-if="$store.state.user" class="absolute right-0 top-0 sm:m-4  text-gray-400 sm:text-blue-400 hover:text-blue-600
    sm:bg-blue-100 font-bold  rounded py-2 px-4"
    @click="$store.dispatch('logout')">Logout</button>
    <router-view />
    <div class="fixed w-full top-0 flex justify-center">
      <div class="p-2 bg-red-200 border border-red-300 text-red-800 container
      m-4" @click="$store.commit('REMOVE_NOTIFICATION', notification.id)" v-for="notification in $store.state.notifications"
      :key="notification.id">
        {{ notification.text }}
      </div>
    </div>
  </div>
</template>

<style></style>
