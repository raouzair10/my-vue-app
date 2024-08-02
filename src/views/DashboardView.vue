<template>
  <div class="dashboard">
    <Sidebar />
    <TodoList />
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue'
import TodoList from '../components/TodoList.vue'
import { onMounted, onBeforeUnmount } from 'vue'
import store from '../store'

const logout = async () => {
  await store.dispatch('logout')
}

onMounted(() => {
  window.addEventListener('beforeunload', logout)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', logout)
})
</script>

<style scoped>
.dashboard {
  height: 100%;
  display: flex;
  background-color: #435585;
}
</style>
