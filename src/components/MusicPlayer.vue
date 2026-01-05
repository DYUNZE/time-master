<script setup lang='ts'>
import 'aplayer/dist/APlayer.min.css'
import Aplayer, { type AplayerAudio } from 'aplayer'
import { ref, onMounted,onBeforeUnmount } from 'vue'

let player:Aplayer | null = null
const aplayerEl = ref<HTMLElement | null>(null)

const songList:[AplayerAudio] = [
    {
        name:"着迷",
        artist:"迷心",
        url:"https://m704.music.126.net/20260105213902/8ad3c2311cfba70f0b3b0dc4824ca10a/jdyyaac/obj/w5rDlsOJwrLDjj7CmsOj/30452435110/ef34/5b7f/dbd9/e380c22cc53a90bd3a0b90c1e6628329.m4a?vuutv=XnDHQG0vnHVb9IFy6yTegPC+zLOMyjsjJ8O1+U8/ICMbg/hutzVWAcfGk5kP7BNs1x33FM+W5dUsU83CGGekGxlGRKOPG/8qMQw0oORHAcc=&authSecret=0000019b8e4b107403770a3b22d80371&cdntag=bWFyaz1vc193ZWIscXVhbGl0eV9leGhpZ2g"
    }
]

onMounted(()=>{
    if (!aplayerEl.value) return

    player = new Aplayer({
        container: aplayerEl.value,
        fixed: true,
        audio: songList,
    })
})
onBeforeUnmount(()=>{
    if (player){
        player.destroy()
        player = null
    }
})


</script>

<template>
    <div ref="aplayerEl" id="aplayer-container"></div>
</template>

<style scoped></style>