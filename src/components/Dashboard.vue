<template>
  <div class="dashboard">
    <div class="dashboard-container">
      <h1 v-if="user">Welcome, {{ user.username }}</h1>
      <el-button v-if="user" type="primary" @click="handleLogout">Logout</el-button>
      <h2>Todo List</h2>
      <el-table :data="todos" :row-class-name="rowClassName" style="width: 100%">
        <el-table-column width="120">
          <template #default="scope">
            <el-button type="danger" size="small" @click="deleteTodo(scope.row.id)">x</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="Tasks" width="180"></el-table-column>
        <el-table-column label="Status" width="100">
          <template #default="scope">
            <el-checkbox v-model="scope.row.completed" size="large" @change="updateTask(scope.row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="Priority" width="120">
          <template #default="scope">
            <el-select v-model="scope.row.priority" @change="updateTask(scope.row)">
              <el-option label="High" value="High"></el-option>
              <el-option label="Medium" value="Medium"></el-option>
              <el-option label="Low" value="Low"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="Created At" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="Updated At" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.updatedAt) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { ElMessage } from 'element-plus'

const store = useStore()
const router = useRouter()

const user = computed(() => store.getters.user)
const todos = computed(() => store.getters.todos)

onMounted(async () => {
  if (user.value) {
    await store.dispatch('fetchTodos', user.value.id)
  } else {
    ElMessage.error('User not authenticated')
    router.push('/login')
  }
})

const handleLogout = () => {
  store.dispatch('logout')
  router.push('/login')
}

const formatDate = (dateStr) => {
  return format(new Date(dateStr), 'PPpp')
}

const deleteTodo = async (id) => {
  await store.dispatch('deleteTodo', id)
  ElMessage.success('Task deleted successfully')
}

const updateTask = async (todo) => {
  todo.updatedAt = new Date()
  await store.dispatch('updateTodo', todo)
  ElMessage.success('Task updated successfully')
}

const rowClassName = ({ row }) => {
  return row.priority
}
</script>

<style scoped>
.dashboard {
  height: 100%;
  margin: -8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: -webkit-linear-gradient(left, #003366, #004080, #0059b3, #0073e6);
}
.dashboard-container {
  padding: 20px;
  max-width: 1000px;
  margin: auto;
}

h1, h2 {
  text-align: center;
}

.el-button {
  display: block;
  margin: 10px auto;
}

:deep(.High) {
  background-color: rgba(255, 0, 0, 0.2);
}

:deep(.Medium) {
  background-color: rgba(255, 165, 0, 0.2);
}

:deep(.Low) {
  background-color: rgba(0, 128, 0, 0.2);
}
</style>
