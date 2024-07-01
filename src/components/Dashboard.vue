<template>
  <div>
    <h1 v-if="user">Welcome, {{ user.username }}</h1>
    <button v-if="user" @click="handleLogout">Logout</button>
    <h2>Todo List</h2>
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <span>{{ todo.title }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const user = computed(() => store.getters.user)
const todos = computed(() => store.getters.todos)

onMounted(async () => {
  await store.dispatch('fetchTodos', user.value.id)
})

const handleLogout = () => {
  store.dispatch('logout')
  router.push('/login')
}
</script>

<style scoped>

</style>
