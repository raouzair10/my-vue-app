<template>
  <div class="wrapper-container">
    <div class="wrapper">
      <div class="title">Login</div>
      <div class="form-container">
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="field">
            <input type="text" v-model="form.username" placeholder="Username" required>
          </div>
          <div class="field">
            <input type="password" v-model="form.password" placeholder="Password" required>
          </div>
          <div class="field btn">
            <input type="submit" value="Login">
          </div>
          <div class="signup-link">Don't have an account? <RouterLink to="/signup">Signup!</RouterLink></div>
          <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const errorMessage = ref('')

const form = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  const result = await store.dispatch('login', form)
  if (result.success) {
    router.push('/')
  } else {
    errorMessage.value = result.message
  }
}
</script>

<style scoped>
@import '../assets/form.css';
</style>
