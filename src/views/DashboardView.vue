<template>
  <div class="dashboard">
    <Sidebar />
    <TodoList />
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue'
import TodoList from '../components/TodoList.vue'
</script>

<style scoped>
.dashboard {
  height: 100vh;
  display: flex;
  background-color: #435585;
}
</style>
