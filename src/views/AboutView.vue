<script setup lang="ts">
  const triggerEffect = () => {
    alert('hello world')
  }
</script>

<template>
  <div>
    123213
    <button class="about" @click="triggerEffect">Click ME~</button>
  </div>
</template>

<style scoped>
  .about:hover{
    background-color: brown;
  }
  .about:active{
    background-color: bisque;
  }
</style>
