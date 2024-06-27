<template>
  <div class="signup-container">
    <el-card class="signup-card">
      <h2>Signup</h2>
      <el-form @submit.prevent="handleSignup">
        <el-form-item label="Username">
          <el-input v-model="form.username" placeholder="Enter your username"></el-input>
          <p v-show="show_user_msg">User with this username already exists!</p>
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="form.password" type="password" placeholder="Enter your password"></el-input>
        </el-form-item>
        <el-form-item label="Confirm Password">
          <el-input v-model="form.confirmPassword" type="password" placeholder="Confirm your password"></el-input>
          <p v-show="show_pass_msg">Passwords do not match!</p>
          <p v-show="show_confirm_msg">Both passwords match!</p>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :disabled="isDisabled">Signup</el-button>
        </el-form-item>
        <el-form-item>
          <RouterLink to="/login">Already have an account? Login</RouterLink>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const show_user_msg = ref(false)
const show_pass_msg = ref(false)
const show_confirm_msg = ref(false)
const isDisabled = ref(true)
const form = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})
const apiUrl = 'http://localhost:3000/users'
const router = useRouter()

const handleSignup = async () => {
  try {
    const response = await axios.post(apiUrl, {
      username: form.username,
      password: form.password
    })
    console.log('Server response:', response.data)
    router.push('/')
  } catch (error) {
    alert('Error signing up: ' + error.message);
  }
}

watch(() => form.username, async (username) => {
  if (username !== ''){
    try {
      const response = await axios.get(`${apiUrl}?username=${username}`)
      show_user_msg.value = response.data.length > 0
    } catch (error) {}
  }
})

watch([() => form.password, () => form.confirmPassword], ([password, confirmPassword]) => {
  if (password !== '' || confirmPassword !== '') {
    show_pass_msg.value = password !== confirmPassword
    show_confirm_msg.value = password === confirmPassword
  }
  else {
    show_pass_msg.value = false
  }
})

watch([() => form.username, () => form.password, () => form.confirmPassword, show_user_msg, show_pass_msg], ([username, password, confirmPassword, user_msg, pass_msg]) => {
  isDisabled.value = (username === '' || password === '' || confirmPassword === '' || user_msg || pass_msg)
})

</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.signup-card {
  width: 400px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

el-form-item {
  margin-bottom: 20px;
}

el-form-item:last-child {
  margin-bottom: 0;
}
</style>
