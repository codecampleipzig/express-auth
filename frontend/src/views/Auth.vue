<template>
  <div class="container flex mx-auto min-h-screen justify-center items-center py-8">
    <div class="w-screen max-w-lg mb-12 p-2">
      <header class="flex justify-center mb-6 text-4xl font-bold space-x-4">
        <h1
          class="cursor-pointer"
          :class="mode == 'Sign In' ? 'text-blue-400' :  'text-gray-200'"
          @click="mode = 'Sign In'"
        >Sign In</h1>
        <h1
          class="cursor-pointer"
          :class="mode == 'Sign Up' ? 'text-blue-400' :  'text-gray-200'"
          @click="mode = 'Sign Up'"
        >Sign Up</h1>
      </header>
      <form class="grid space-y-4" @submit.prevent="submit">
        <input class="p-2 bg-gray-100" type="text" v-model="form.email" placeholder="Email" />
        <input
          class="p-2 bg-gray-100"
          type="password"
          v-model="form.password"
          placeholder="Password"
        />
        <div class="flex justify-center pt-4">
          <input
            class="py-2 px-16 bg-blue-200 hover:bg-blue-100 rounded cursor-pointer text-blue-500 font-bold"
            type="submit"
            :value="mode"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: "",
        password: ""
      },
      mode: "Sign In"
    };
  },
  methods: {
    async submit() {
      if (this.form.email && this.form.password) {
        try {
          await this.$store.dispatch(this.mode == "Sign In" ? "signin" : "signup", this.form);
          this.$router.push({name: "Posts"})
        }
        catch(error) {
          console.error(error);
        }
      }
    }
  }
};
</script>

<style scoped>
</style>