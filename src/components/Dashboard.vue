<template>
  <div class="dashboard-container">
    <h1 v-if="user">Welcome, {{ user.username }}</h1>
    <el-button v-if="user" type="primary" @click="handleLogout">Logout</el-button>
    <h2>Todo List</h2>
    <el-table :data="todos" style="width: 100%">
      <el-table-column prop="title" label="Title" width="180"></el-table-column>
      <el-table-column label="Completed" width="100">
        <template #default="scope">
          <el-checkbox v-model="scope.row.completed"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="Priority" width="120">
        <template #default="scope">
          <span :class="scope.row.priority">
            {{ scope.row.priority }}
          </span>
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
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'

const store = useStore()
const router = useRouter()

const user = computed(() => store.getters.user)
const todos = computed(() => store.getters.todos)

onMounted(async () => {
  if (user.value) {
    await store.dispatch('fetchTodos', user.value.id)
  } else {
    console.log('User not authenticated')
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
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  max-width: 800px;
  margin: auto;
}

h1, h2 {
  text-align: center;
}

.el-button {
  display: block;
  margin: 10px auto;
}

.High {
  color: red;
  font-weight: bold;
}

.Medium {
  color: orange;
}

.Low {
  color: green;
}
</style>
