<template>
  <div class="container max-w-screen-md mx-auto py-8 px-2">
    <header class="flex flex-col items-center mb-4">
      <h1 class="text-4xl font-bold text-center">Posts</h1>
      <router-link
        :to="{name: 'Posts'}"
        class="text-blue-400 hover:text-blue-600 font-bold"
      >Read</router-link>
    </header>
    <main>
      <form @submit.prevent="submit" class="grid gap-4 bg-gray-100 shadow-sm rounded p-6">
        <input class="bg-transparent focus:outline-none font-bold text-xl mb-2 text-gray-800" type="text" v-model="form.title" placeholder="Title">
        <textarea class="bg-transparent resize-none h-64 text-gray-600 focus:outline-none" @input="form.content = $event.target.value"
        placeholder="Write something..."></textarea>
        <div class="flex justify-end">
          <input class="block p-2 px-12  bg-blue-100 rounded
          cursor-pointer text-blue-400 hover:text-blue-600  font-bold"
          type="submit" value="Post">
        </div>
      </form>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        title: "",
        content: ""
      }
    }
  },
  methods: {
    async submit() {
      if (!this.form.title || !this.form.content) return;
      await this.$store.dispatch("createPost", this.form)
      this.$router.push({name: "Posts"})
    }
  },

};
</script>

<style scoped>

</style>
