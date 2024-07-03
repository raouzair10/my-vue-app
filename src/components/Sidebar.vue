<template>
  <div class="sidebar">
    <h1 v-if="user">Welcome, {{ user.username }}</h1>
    <el-button v-if="user" type="primary" @click="handleLogout">Logout</el-button>
    <h2>Add New Task</h2>
    <el-input v-model="newTaskTitle" placeholder="Task Title"></el-input>
    <el-select v-model="newTaskPriority" placeholder="Select Priority">
      <el-option label="High" value="High"></el-option>
      <el-option label="Medium" value="Medium"></el-option>
      <el-option label="Low" value="Low"></el-option>
    </el-select>
    <el-button type="primary" @click="addTask">Add Task</el-button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const store = useStore()
const router = useRouter()

const user = computed(() => store.getters.user)
const newTaskTitle = ref('')
const newTaskPriority = ref('')

const handleLogout = () => {
  store.dispatch('logout')
  router.push('/login')
}

const addTask = async () => {
  if (newTaskTitle.value && newTaskPriority.value) {
    const currentDate = new Date()
    const uniqueId = 't-id' + (new Date()).getTime()
    const newTask = {
      id: uniqueId,
      title: newTaskTitle.value,
      priority: newTaskPriority.value,
      completed: false,
      userId: user.value.id,
      createdAt: currentDate,
      updatedAt: currentDate,
    }
    await store.dispatch('addTodo', newTask)
    ElMessage.success('Task added successfully')
    newTaskTitle.value = ''
    newTaskPriority.value = ''
  } else {
    ElMessage.error('Please fill in all fields')
  }
}
</script>

<style scoped>
.sidebar {
  height: 100vh;
  width: 250px;
  padding: 20px;
  background-color: #f7f7f7;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

h1, h2 {
  text-align: center;
}
</style>
