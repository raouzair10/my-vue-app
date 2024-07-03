<template>
  <div class="wrapper-container">
    <div class="wrapper">
      <div class="title">Signup</div>
      <div class="form-container">
        <form @submit.prevent="handleSignup" class="signup-form">
          <div class="field">
            <input type="text" v-model="form.username" placeholder="Username" required>
          </div>
          <div class="field">
            <input type="password" v-model="form.password" placeholder="Password" required>
          </div>
          <div class="field">
            <input type="password" v-model="form.confirmPassword" placeholder="Confirm password" required>
            <div v-if="form.password !== form.confirmPassword" class="error">Passwords do not match</div>
          </div>
          <div class="field btn">
            <input type="submit" value="Signup">
          </div>
          <div class="signup-link">Already have an account? <RouterLink to="/login">Login!</RouterLink></div>
          <div v-if="usernameTaken" class="error">Username is already taken</div>
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
const usernameTaken = ref(false)
const form = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

const handleSignup = async () => {
  usernameTaken.value = false
  if (form.password !== form.confirmPassword) {
    return
  }
  const result = await store.dispatch('signup', form)
  if (result.success) {
    router.push('/')
  } else if (result.message === 'Username is already taken') {
    usernameTaken.value = true
  } else {
    console.log(result.message)
  }
}
</script>

<style scoped>
@import '../assets/form.css';
</style>
