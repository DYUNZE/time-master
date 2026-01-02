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

  <video ref="videoEl" class="effect-video" 
  preload="auto" 
  playsinline 
  webkit-playsinline
  muted >
    <source src="@/assets/video/tran_l.webm" type="video/webm">你的浏览器不支持视频播放
  </video>
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
