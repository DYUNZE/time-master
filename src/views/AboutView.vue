<script setup lang="ts">
  import { ref } from 'vue'

  const videoEl = ref<HTMLVideoElement>()
  const triggerEffect = async () => {
    if (!videoEl.value) return
    const video = videoEl.value
    video.currentTime = 0
    await video.play()
  }
</script>

<template>
  <div class="about">
    <button @click="triggerEffect">Click ME</button>
  </div>
</template>

<style>

.effect-video{
  position: fixed;
  top: 0;
  left: 0;
  /* width: 100vw; */
  height: 100vh;
  object-fit: contain;
  pointer-events: none;
}
</style>
