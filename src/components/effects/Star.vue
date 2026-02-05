<script setup lang='ts'>
import { ref } from 'vue'

const particlesOptions = ref({
    background: {
        color: {
            // 容器背景色
            value: 'transparent'
        }
    },
    // 帧率限制
    fpsLimit: 120,
    // 交互行为配置
    interactivity: {
        events: {
            onClick: {
                enable: true,
                mode: 'push'       // 或 'repulse(排斥)', 'bubble(变大)'...
            },
            onHover: {
                enable: true,
                mode: 'repulse'
            },
            resize: true
        },
        modes: {
            push: {
                // 每次添加的粒子数量
                quantity: 4
            },
            repulse: {
                // 悬浮排斥的有效距离
                distance: 200,
                // 排斥效果的持续时间
                duration: 0.4
            }
        }
    },
    particles: {
        // 粒子颜色
        color: {
            value: '#ffffff'
        },
        // 粒子之间的连线配置
        links: {
            color: '#ffffff',
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1
        },
        // 粒子运动配置
        move: {
            // none=无固定方向,可选up/down/left/right
            direction: 'none',
            enable: true,
            outModes: {
                default: 'bounce'
            },
            random: false,
            speed: 2,
            straight: false
        },
        // 粒子数量配置
        number: {
            density: {
                enable: true,
                area: 800
            },
            // 初始总数
            value: 80
        },
        opacity: {
            value: 0.5
        },
        shape: {
            type: 'circle'   // 可选：circle, triangle, polygon, star, image...
        },
        size: {
            // 粒子大小范围
            value: { min: 1, max: 5 }
        }
    },
    // 开启视网膜屏适配：自动调整粒子密度，避免高清屏粒子显示模糊
    detectRetina: true
})
</script>

<template>
    <div class="particles-container">
        <vue-particles id="tsparticles" :options="particlesOptions" />
    </div>
</template>

<style scoped>
.particles-container {
    position: fixed;
    inset: 0;
    z-index: -1;
    /* 做背景用就放最底层 */
}
</style>