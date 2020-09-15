<template>
  <div class="container max-w-screen-md mx-auto py-8 px-2">
    <header class="flex flex-col items-center mb-4">
      <h1 class="text-4xl font-bold text-center">Posts</h1>
      <router-link
        :to="{ name: 'CreatePost' }"
        class="text-blue-400 hover:text-blue-600 font-bold"
        >Write</router-link
      >
    </header>
    <main class="card-grid">
      <div
        class="bg-gray-100 shadow-sm rounded p-6"
        v-for="post in posts"
        :key="post.id"
      >
        <h2 class="font-bold text-xl mb-2 text-gray-800">{{ post.title }}</h2>
        <p class="text-gray-600">{{ post.content }}</p>
        <footer class="mt-4 text-gray-500">
          <p class="mb-1">
            by
            <span class="text-gray-700">{{ post.userEmail }}</span>
          </p>
          <p class="text-sm">{{ formatDate(post.createdAt) }}</p>
        </footer>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  computed: {
    posts() {
      return this.$store.state.posts
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  },
  mounted() {
    this.$store.dispatch("fetchPosts");
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString + " UTC").toLocaleString();
    }
  }
};
</script>

<style scoped>
.card-grid {
  display: grid;
  gap: 1rem;
}
</style>
