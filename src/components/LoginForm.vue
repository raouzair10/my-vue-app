<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>Login</h2>
      <el-form @submit.prevent="handleLogin">
        <el-form-item label="Username">
          <el-input v-model="form.username" placeholder="Enter your username"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="form.password" type="password" placeholder="Enter your password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :disabled="isDisabled">Login</el-button>
        </el-form-item>
        <el-form-item>
          <RouterLink to="/signup">Don't have an account? Signup</RouterLink>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const isDisabled = ref(true)

const form = reactive({
  username: '',
  password: ''
})
const router = useRouter()

watch([() => form.username, () => form.password], ([username, password]) => {
  isDisabled.value = (username === '' || password === '')
})

const apiUrl = 'http://localhost:3000/users/'

const handleLogin = async () => {
  try {
    const response = await axios.get(`${apiUrl}?username=${form.username}`)
    const users = response.data
    if (users.length > 0) {
      const user = users.find(user => user.password === form.password)
      if (user){
        router.push('/')
      }
      else {
        alert('Invalid password!')
      }
    } else {
      alert('User does not exist!')
    }
    
  } catch (error) {
    alert('Error signing up: ' + error.message);
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-card {
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
