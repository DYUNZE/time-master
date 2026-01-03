<script setup lang='ts'>
import { ref, onMounted, onUnmounted, type Ref, watch } from 'vue';

// 定义Props并添加类型约束
const props = defineProps({
  width: {
    type: Number,
    default: 170,
    validator: (value: number) => value > 0
  },
  height: {
    type: Number,
    default: 170,
    validator: (value: number) => value > 0
  }
});

// 定义Canvas Ref类型
const clockRef: Ref<HTMLCanvasElement | null> = ref(null);
// 定时器类型
let timer: number | null = null;
let breathAnimationId: number | null = null;

/**
 * 绘制刻度辅助函数（移除数字，优化刻度长度）
 * @param ctx Canvas上下文
 * @param centerX 中心X
 * @param centerY 中心Y
 * @param radius 时钟半径
 */
const drawScales = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number
): void => {
  ctx.save();

  // 1. 绘制小时刻度（12个，粗且长，移除数字后加长一点）
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#333';
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    // 刻度起始点（靠近外框）
    const startX = centerX + Math.cos((i * 30) * Math.PI / 180) * (radius - 15);
    const startY = centerY + Math.sin((i * 30) * Math.PI / 180) * (radius - 15);
    // 刻度结束点（更靠近中心，移除数字后加长）
    const endX = centerX + Math.cos((i * 30) * Math.PI / 180) * (radius - 35);
    const endY = centerY + Math.sin((i * 30) * Math.PI / 180) * (radius - 35);
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }

  // 2. 绘制分钟刻度（60个，细且短，跳过小时刻度位置）
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#999';
  for (let i = 0; i < 60; i++) {
    // 跳过小时刻度的位置
    if (i % 5 === 0) continue;

    ctx.beginPath();
    const startX = centerX + Math.cos((i * 6) * Math.PI / 180) * (radius - 15);
    const startY = centerY + Math.sin((i * 6) * Math.PI / 180) * (radius - 15);
    const endX = centerX + Math.cos((i * 6) * Math.PI / 180) * (radius - 25);
    const endY = centerY + Math.sin((i * 6) * Math.PI / 180) * (radius - 25);
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }

  ctx.restore();
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

  // 阴影效果
  if (isSecond) {
    ctx.shadowBlur = 5;
    ctx.shadowColor = 'rgba(255,68,68,0.5)';
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  } else {
    ctx.shadowBlur = 2;
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
  }

  ctx.stroke();
  ctx.restore();
};

/**
 * 绘制时钟核心函数
 */
const drawClock = (): void => {
  if (!clockRef.value) return;

  const canvas = clockRef.value;
  const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
  if (!ctx) return;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 20; // 自适应半径

  // 1. 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2. 绘制时钟外框
  const gradient = ctx.createRadialGradient(
    centerX, centerY, radius * 0.8,
    centerX, centerY, radius
  );
  gradient.addColorStop(0, '#f9fafc');
  gradient.addColorStop(1, '#eef2f7');

  // 外框阴影
  ctx.shadowBlur = 8;
  ctx.shadowColor = 'rgba(0,0,0,0.1)';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();

  // 外框边框
  ctx.strokeStyle = '#e0e5ec';
  ctx.lineWidth = 6;
  ctx.stroke();

  // 内层细边框
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 3, 0, 2 * Math.PI);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 3. 绘制刻度（无数字）
  drawScales(ctx, centerX, centerY, radius);

  // 4. 获取当前时间
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();

  // 5. 绘制指针
  drawHand(ctx, centerX, centerY, hours * 30 + minutes * 0.5, radius * 0.5, 6, '#333', '#666'); // 时针
  drawHand(ctx, centerX, centerY, minutes * 6 + seconds * 0.1, radius * 0.7, 4, '#555', '#888'); // 分针
  drawHand(ctx, centerX, centerY, seconds * 6 + milliseconds * 0.006, radius * 0.8, 2, '#ff4444', '#ff8888', true); // 秒针

  // 6. 绘制时钟中心圆点
  ctx.beginPath();
  ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = '#e0e5ec';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 中心小圆点
  ctx.beginPath();
  ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
  ctx.fillStyle = '#333';
  ctx.fill();
};

/**
 * 时钟呼吸动效
 */
const breathAnimation = (): void => {
  if (!clockRef.value) return;
  const canvas = clockRef.value;
  const scale = 1 + Math.cos(Date.now() * 0.0008) * 0.015;
  canvas.style.transform = `scale(${scale})`;
  canvas.style.transition = 'transform 0.05s ease';
  breathAnimationId = requestAnimationFrame(breathAnimation);
};

// 监听宽高变化
watch([() => props.width, () => props.height], () => {
  drawClock();
});

// 组件挂载时初始化
onMounted(() => {
  drawClock();
  timer = window.setInterval(drawClock, 16);
  breathAnimation();
});

// 组件卸载时清除定时器和动画
onUnmounted(() => {
  if (timer) clearInterval(timer);
  if (breathAnimationId) cancelAnimationFrame(breathAnimationId);
});
</script>

<template>
  <div class="clock-container">
    <canvas ref="clockRef" :width="width" :height="height" class="clock-canvas"></canvas>
  </div>
</template>

<style scoped>
.clock-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border-radius: 50%;
}

.clock-canvas {
  border-radius: 50%;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05),
    0 2px 4px rgba(0, 0, 0, 0.08);
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}
</style>