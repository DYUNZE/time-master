<script setup lang='ts'>
import { ref, onMounted, onUnmounted, type Ref } from 'vue';

// 定义Props并添加类型约束
const props = defineProps({
  width: {
    type: Number,
    default: 150,
    validator: (value: number) => value > 0
  },
  height: {
    type: Number,
    default: 150,
    validator: (value: number) => value > 0
  }
});

// 定义Canvas Ref类型
const clockRef: Ref<HTMLCanvasElement | null> = ref(null);
// 定时器类型
let timer:any = null;
let breathAnimationId: number | null = null;

/**
 * 绘制时钟核心函数（完全移除刻度绘制）
 */
const drawClock = (): void => {
  if (!clockRef.value) return;
  
  const canvas = clockRef.value;
  const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
  if (!ctx) return;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 20; // 自适应半径

  // 1. 清空画布（彻底清空，无残留）
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2. 绘制时钟外框（渐变背景+双层边框，无刻度）
  const gradient = ctx.createRadialGradient(
    centerX, centerY, radius * 0.8,
    centerX, centerY, radius
  );
  gradient.addColorStop(0, '#f9fafc');
  gradient.addColorStop(1, '#eef2f7');
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();
  // 外框加细阴影
  ctx.strokeStyle = '#e0e5ec';
  ctx.lineWidth = 6;
  ctx.stroke();
  // 内层细边框
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 3, 0, 2 * Math.PI);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 3. 获取当前时间，计算角度（无刻度相关逻辑）
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // 4. 绘制指针（渐变+阴影，无刻度干扰）
  drawHand(ctx, centerX, centerY, hours * 30 + minutes * 0.5, radius * 0.5, 6, '#333', '#666'); // 时针
  drawHand(ctx, centerX, centerY, minutes * 6 + seconds * 0.1, radius * 0.7, 4, '#555', '#888'); // 分针
  drawHand(ctx, centerX, centerY, seconds * 6, radius * 0.8, 2, '#ff4444', '#ff8888', true); // 秒针

  // 5. 绘制时钟中心圆点
  ctx.beginPath();
  ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = '#e0e5ec';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
  ctx.fillStyle = '#333';
  ctx.fill();
};

/**
 * 绘制指针辅助函数
 * @param ctx Canvas上下文
 * @param centerX 时钟中心X坐标
 * @param centerY 时钟中心Y坐标
 * @param angle 指针旋转角度（角度制）
 * @param length 指针长度
 * @param width 指针宽度
 * @param color1 指针末端颜色
 * @param color2 指针根部颜色
 * @param isSecond 是否是秒针（加阴影）
 */
const drawHand = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  angle: number,
  length: number,
  width: number,
  color1: string,
  color2: string,
  isSecond = false
): void => {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(angle * Math.PI / 180);

  // 指针渐变
  const gradient = ctx.createLinearGradient(0, 0, 0, -length);
  gradient.addColorStop(0, color2);
  gradient.addColorStop(1, color1);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -length);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.stroke();

  // 秒针加轻微阴影
  if (isSecond) {
    ctx.shadowBlur = 3;
    ctx.shadowColor = 'rgba(255,68,68,0.3)';
  }

  ctx.restore();
};

/**
 * 时钟呼吸动效
 */
const breathAnimation = (): void => {
  if (!clockRef.value) return;
  const canvas = clockRef.value;
  const scale = 1 + Math.sin(Date.now() * 0.001) * 0.01;
  canvas.style.transform = `scale(${scale})`;
  breathAnimationId = requestAnimationFrame(breathAnimation);
};

// 组件挂载时初始化
onMounted(() => {
  drawClock();
  timer = setInterval(drawClock, 1000);
  breathAnimation();
});

// 组件卸载时清除定时器和动画
onUnmounted(() => {
  if (timer) clearInterval(timer);
  if (breathAnimationId) cancelAnimationFrame(breathAnimationId);
});
</script>

<template>
    <!-- 时钟Canvas容器，支持外部传宽高 -->
    <div class="clock-container">
        <canvas ref="clockRef" :width="width" :height="height" class="clock-canvas"></canvas>
    </div>
</template>

<style scoped>
.clock-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.clock-canvas {
  border: 1px solid #eee;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>