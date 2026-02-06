<template>
  <div class="canvas-clock-container" ref="clockContainer">
    <!-- Canvas 画布，宽高由容器控制 -->
    <canvas ref="clockCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted} from 'vue'

// 定义 Canvas 相关引用
const clockCanvas = ref<HTMLCanvasElement | null>(null)
const clockContainer = ref<HTMLDivElement | null>(null)
// 动画帧标识，用于销毁时清除
let animationFrameId: number = 0

// 初始化 Canvas 并开始绘制时钟
const initClock = () => {
  const canvas = clockCanvas.value
  const container = clockContainer.value
  if (!canvas || !container) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // ========== 高清渲染核心：设备像素比适配 ==========
  const dpr = window.devicePixelRatio || 1
  // 获取容器的实际宽高（取正方形，保证时钟是正圆）
  const size = Math.min(container.clientWidth, container.clientHeight)
  // 设置 Canvas 实际宽高（物理像素）= 容器宽高 * 设备像素比
  canvas.width = size * dpr
  canvas.height = size * dpr
  // 设置 Canvas 显示宽高（CSS 像素）= 容器宽高
  canvas.style.width = `${size}px`
  canvas.style.height = `${size}px`
  // 画布缩放，适配高清屏
  ctx.scale(dpr, dpr)

  // 绘制时钟的核心方法
  const drawClock = () => {
    // 每次绘制前清空画布（避免重影）
    ctx.clearRect(0, 0, size, size)
    // 圆心坐标（画布中心）
    const centerX = size / 2
    const centerY = size / 2
    // 时钟半径（留边距，避免超出容器）
    const radius = size / 2 - 10

    // 1. 绘制表盘外圆
    drawDial(ctx, centerX, centerY, radius)
    // 2. 绘制表盘刻度（60个小刻度，12个大刻度）
    drawScale(ctx, centerX, centerY, radius)
    // 3. 绘制表盘数字（1-12）
    drawNumber(ctx, centerX, centerY, radius)
    // 4. 获取当前时间，绘制三根指针
    drawPointers(ctx, centerX, centerY, radius)

    // 帧动画循环，保证走时流畅
    animationFrameId = requestAnimationFrame(drawClock)
  }

  drawClock()
}

// 绘制表盘外圆
const drawDial = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number
) => {
  ctx.save() // 保存当前绘图状态
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.strokeStyle = '#2c3e50' // 表盘边框颜色
  ctx.lineWidth = 4 // 表盘边框宽度
  ctx.stroke()
  ctx.fillStyle = '#ffffff' // 表盘背景色
  ctx.fill()
  ctx.restore() // 恢复绘图状态
}

// 绘制表盘刻度
const drawScale = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number
) => {
  ctx.save()
  for (let i = 0; i < 60; i++) {
    ctx.beginPath()
    // 刻度旋转角度（6度/个，360/60）
    const angle = (i * 6 * Math.PI) / 180
    // 刻度起点（外圆）和终点（内圆）
    const startX = x + Math.cos(angle) * r
    const startY = y + Math.sin(angle) * r
    // 大刻度（12/24/36/48/60）长一点，小刻度短一点
    const endR = i % 5 === 0 ? r - 20 : r - 10
    const endX = x + Math.cos(angle) * endR
    const endY = y + Math.sin(angle) * endR

    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    // 大刻度颜色深、线宽粗，小刻度反之
    ctx.strokeStyle = i % 5 === 0 ? '#2c3e50' : '#bdc3c7'
    ctx.lineWidth = i % 5 === 0 ? 3 : 1
    ctx.stroke()
  }
  ctx.restore()
}

// 绘制表盘数字（1-12）
const drawNumber = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number
) => {
  ctx.save()
  ctx.font = `${r / 8}px 'Microsoft YaHei', sans-serif` // 字体大小随半径自适应
  ctx.fillStyle = '#2c3e50' // 数字颜色
  ctx.textAlign = 'center' // 水平居中
  ctx.textBaseline = 'middle' // 垂直居中

  for (let i = 1; i <= 12; i++) {
    // 数字旋转角度
    const angle = ((i * 30 - 90) * Math.PI) / 180 // 减90度，让12点在正上方
    // 数字绘制位置（比刻度更靠内）
    const numX = x + Math.cos(angle) * (r - 30)
    const numY = y + Math.sin(angle) * (r - 30)
    ctx.fillText(i.toString(), numX, numY)
  }
  ctx.restore()
}

// 绘制时针、分针、秒针
const drawPointers = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number
) => {
  const now = new Date()
  const hours = now.getHours() % 12 // 转12小时制
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  const milliseconds = now.getMilliseconds() // 毫秒，让秒针走时更顺滑

  // ========== 计算各指针旋转角度（弧度） ==========
  // 秒针：6度/秒 + 毫秒补间（360度/60秒=6度/秒）
  const secondAngle = ((seconds + milliseconds / 1000) * 6 - 90) * Math.PI / 180
  // 分针：6度/分 + 秒针补间（360度/60分=6度/分）
  const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * Math.PI / 180
  // 时针：30度/小时 + 分针补间（360度/12小时=30度/小时）
  const hourAngle = ((hours + minutes / 60) * 30 - 90) * Math.PI / 180

  // 绘制秒针（细长，红色）
  drawPointer(ctx, x, y, secondAngle, r * 0.85, 1, '#e74c3c', true)
  // 绘制分针（中等，深灰）
  drawPointer(ctx, x, y, minuteAngle, r * 0.7, 2, '#2c3e50', false)
  // 绘制时针（短粗，深灰）
  drawPointer(ctx, x, y, hourAngle, r * 0.5, 4, '#2c3e50', false)
  // 绘制指针中心圆点
  drawCenterDot(ctx, x, y, 6)
}

// 通用绘制指针方法
// @param isSecond：是否是秒针（秒针需要带尾部）
const drawPointer = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  length: number,
  width: number,
  color: string,
  isSecond: boolean
) => {
  ctx.save()
  ctx.beginPath()
  ctx.lineWidth = width
  ctx.strokeStyle = color
  ctx.lineCap = 'round' // 指针端点圆角，更美观

  // 秒针绘制：带尾部（向反方向延伸一点），其他指针只向前
  if (isSecond) {
    // 秒针尾部起点
    const startX = x - Math.cos(angle) * length * 0.2
    const startY = y - Math.sin(angle) * length * 0.2
    ctx.moveTo(startX, startY)
  } else {
    ctx.moveTo(x, y) // 非秒针从圆心开始
  }
  // 指针终点
  const endX = x + Math.cos(angle) * length
  const endY = y + Math.sin(angle) * length
  ctx.lineTo(endX, endY)
  ctx.stroke()
  ctx.restore()
}

// 绘制指针中心圆点
const drawCenterDot = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
) => {
  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, size, 0, 2 * Math.PI)
  ctx.fillStyle = '#e74c3c'
  ctx.fill()
  ctx.strokeStyle = '#2c3e50'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.restore()
}

// 生命周期：挂载后初始化时钟
onMounted(() => {
  initClock()
  // 监听窗口大小变化，重新初始化时钟（自适应）
  window.addEventListener('resize', initClock)
})

// 生命周期：销毁前清除动画和监听，避免内存泄漏
onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', initClock)
})
</script>

<style scoped>
/* 时钟容器，可自定义宽高，时钟会自适应为正方形 */
.canvas-clock-container {
  width: 180px;
  height: 180px;
  margin: 0 auto;
  /* 居中画布，避免容器内边距影响 */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>