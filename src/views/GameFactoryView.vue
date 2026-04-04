<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Download,
  Upload,
  Plus,
  Delete,
  MagicStick,
  Connection,
} from '@element-plus/icons-vue'

// ==================== 类型定义 ====================
interface StoryChoice {
  id: string
  text: string
  targetId: string | null
}

interface StoryNode {
  id: string
  title: string
  content: string
  x: number
  y: number
  color: string
  choices: StoryChoice[]
}

interface GameProject {
  name: string
  nodes: StoryNode[]
}

// ==================== 工具函数 ====================
const genId = () => Math.random().toString(36).slice(2, 9)

const doodleColors = [
  '#E8A87C',
  '#85C1E9',
  '#F9E79F',
  '#D7BDE2',
  '#A9DFBF',
  '#F5B7B1',
]

// ==================== 响应式数据 ====================
const project = ref<GameProject>({
  name: '未命名冒险',
  nodes: [
    {
      id: 'start',
      title: '起始章节',
      content: '你醒来时发现自己在一个陌生的房间里，四周弥漫着淡淡的墨水香味……',
      x: 80,
      y: 60,
      color: '#E8A87C',
      choices: [
        { id: genId(), text: '查看窗户', targetId: 'window' },
        { id: genId(), text: '打开大门', targetId: 'door' },
      ],
    },
    {
      id: 'window',
      title: '窗外的世界',
      content: '窗外是一片漂浮在云海之上的涂鸦森林，树木由彩色线条构成。',
      x: 400,
      y: 60,
      color: '#85C1E9',
      choices: [
        { id: genId(), text: '跳出去', targetId: null },
      ],
    },
    {
      id: 'door',
      title: '漫长的走廊',
      content: '门后是一条似乎没有尽头的走廊，墙壁上挂满了未完成的故事草图。',
      x: 240,
      y: 300,
      color: '#D7BDE2',
      choices: [
        { id: genId(), text: '继续走', targetId: null },
        { id: genId(), text: '返回', targetId: 'start' },
      ],
    },
  ],
})

const selectedNodeId = ref<string | null>('start')
const fileInputRef = ref<HTMLInputElement | null>(null)

const selectedNode = computed(() =>
  project.value.nodes.find((n) => n.id === selectedNodeId.value) || null
)

// ==================== 画布状态（平移+缩放） ====================
const canvasRef = ref<HTMLDivElement | null>(null)
const canvasState = ref({ x: 0, y: 0, scale: 1 })
const MIN_SCALE = 0.3
const MAX_SCALE = 2.5

const canvasTranslateStyle = computed(() => ({
  transform: `translate(${canvasState.value.x}px, ${canvasState.value.y}px)`,
}))

const zoomIn = () => {
  canvasState.value.scale = Math.min(MAX_SCALE, canvasState.value.scale * 1.15)
}
const zoomOut = () => {
  canvasState.value.scale = Math.max(MIN_SCALE, canvasState.value.scale / 1.15)
}
const resetZoom = () => {
  canvasState.value.scale = 1
  canvasState.value.x = 0
  canvasState.value.y = 0
}

const onWheel = (e: WheelEvent) => {
  e.preventDefault()
  const factor = e.deltaY < 0 ? 1.1 : 0.9
  const oldScale = canvasState.value.scale
  const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, oldScale * factor))
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top
  canvasState.value.x = mouseX - (mouseX - canvasState.value.x) * (newScale / oldScale)
  canvasState.value.y = mouseY - (mouseY - canvasState.value.y) * (newScale / oldScale)
  canvasState.value.scale = newScale
}

// ==================== 事件坐标辅助 ====================
const getClientPos = (e: MouseEvent | TouchEvent) => {
  const touch = 'touches' in e ? e.touches[0] : undefined
  if (touch) return { x: touch.clientX, y: touch.clientY }
  const changed = 'changedTouches' in e ? e.changedTouches[0] : undefined
  if (changed) return { x: changed.clientX, y: changed.clientY }
  return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY }
}

// ==================== 画布平移 ====================
const panState = ref({ isPanning: false, startX: 0, startY: 0, originX: 0, originY: 0 })

const startPan = (e: MouseEvent | TouchEvent) => {
  const target = e.target as HTMLElement
  if (target.closest('.game-factory__node, .game-factory__node-link-handle, .game-factory__node-link-hit')) return
  const pos = getClientPos(e)
  panState.value = {
    isPanning: true,
    startX: pos.x,
    startY: pos.y,
    originX: canvasState.value.x,
    originY: canvasState.value.y,
  }
  window.addEventListener('mousemove', onPanMove)
  window.addEventListener('mouseup', onPanEnd)
  window.addEventListener('touchmove', onPanMove as EventListener, { passive: false })
  window.addEventListener('touchend', onPanEnd as EventListener)
}

const onPanMove = (e: MouseEvent | TouchEvent) => {
  if (!panState.value.isPanning) return
  if ('touches' in e) e.preventDefault()
  const pos = getClientPos(e)
  canvasState.value.x = panState.value.originX + (pos.x - panState.value.startX)
  canvasState.value.y = panState.value.originY + (pos.y - panState.value.startY)
}

const onPanEnd = () => {
  panState.value.isPanning = false
  window.removeEventListener('mousemove', onPanMove)
  window.removeEventListener('mouseup', onPanEnd)
  window.removeEventListener('touchmove', onPanMove as EventListener)
  window.removeEventListener('touchend', onPanEnd as EventListener)
}

// ==================== 坐标转换 ====================
const screenToCanvas = (sx: number, sy: number) => {
  return {
    x: (sx - canvasState.value.x) / canvasState.value.scale,
    y: (sy - canvasState.value.y) / canvasState.value.scale,
  }
}

// ==================== 连线计算（视觉坐标） ====================
const connections = computed(() => {
  const s = canvasState.value.scale
  const lines: {
    x1: number
    y1: number
    x2: number
    y2: number
    color: string
  }[] = []
  project.value.nodes.forEach((node) => {
    node.choices.forEach((choice) => {
      if (!choice.targetId) return
      const target = project.value.nodes.find((n) => n.id === choice.targetId)
      if (!target) return
      lines.push({
        x1: (node.x + 110) * s,
        y1: (node.y + 45) * s,
        x2: (target.x + 110) * s,
        y2: (target.y + 45) * s,
        color: node.color,
      })
    })
  })
  return lines
})

// ==================== 节点操作 ====================
const addNode = () => {
  const color = doodleColors[project.value.nodes.length % doodleColors.length] || '#E8A87C'
  const cx = canvasRef.value ? canvasRef.value.clientWidth / 2 : 300
  const cy = canvasRef.value ? canvasRef.value.clientHeight / 2 : 200
  const pos = screenToCanvas(cx, cy)
  const newNode: StoryNode = {
    id: genId(),
    title: '新节点',
    content: '在这里写下你的故事……',
    x: pos.x - 110,
    y: pos.y - 45,
    color,
    choices: [],
  }
  project.value.nodes.push(newNode)
  selectedNodeId.value = newNode.id
}

const deleteNode = (id: string) => {
  const idx = project.value.nodes.findIndex((n) => n.id === id)
  if (idx === -1) return
  project.value.nodes.forEach((n) => {
    n.choices.forEach((c) => {
      if (c.targetId === id) c.targetId = null
    })
  })
  project.value.nodes.splice(idx, 1)
  if (selectedNodeId.value === id) {
    selectedNodeId.value = project.value.nodes[0]?.id || null
  }
}

const addChoice = () => {
  if (!selectedNode.value) return
  selectedNode.value.choices.push({
    id: genId(),
    text: '新选项',
    targetId: null,
  })
}

const removeChoice = (choiceId: string) => {
  if (!selectedNode.value) return
  selectedNode.value.choices = selectedNode.value.choices.filter(
    (c) => c.id !== choiceId
  )
}

// ==================== 节点拖拽 ====================
const dragState = ref<{
  nodeId: string | null
  startX: number
  startY: number
  originX: number
  originY: number
}>({ nodeId: null, startX: 0, startY: 0, originX: 0, originY: 0 })

const startNodeDrag = (e: MouseEvent | TouchEvent, node: StoryNode) => {
  selectedNodeId.value = node.id
  const pos = getClientPos(e)
  dragState.value = {
    nodeId: node.id,
    startX: pos.x,
    startY: pos.y,
    originX: node.x,
    originY: node.y,
  }
  window.addEventListener('mousemove', onNodeDragMove)
  window.addEventListener('mouseup', onNodeDragEnd)
  window.addEventListener('touchmove', onNodeDragMove as EventListener, { passive: false })
  window.addEventListener('touchend', onNodeDragEnd as EventListener)
}

const onNodeDragMove = (e: MouseEvent | TouchEvent) => {
  if (!dragState.value.nodeId) return
  if ('touches' in e) e.preventDefault()
  const pos = getClientPos(e)
  const dx = (pos.x - dragState.value.startX) / canvasState.value.scale
  const dy = (pos.y - dragState.value.startY) / canvasState.value.scale
  const node = project.value.nodes.find((n) => n.id === dragState.value.nodeId)
  if (!node) return
  node.x = Math.max(0, dragState.value.originX + dx)
  node.y = Math.max(0, dragState.value.originY + dy)
}

const onNodeDragEnd = () => {
  dragState.value.nodeId = null
  window.removeEventListener('mousemove', onNodeDragMove)
  window.removeEventListener('mouseup', onNodeDragEnd)
  window.removeEventListener('touchmove', onNodeDragMove as EventListener)
  window.removeEventListener('touchend', onNodeDragEnd as EventListener)
}

// ==================== 手动连线 ====================
const linkState = ref<{
  fromId: string | null
  x1: number
  y1: number
  x2: number
  y2: number
}>({ fromId: null, x1: 0, y1: 0, x2: 0, y2: 0 })

const startLink = (e: MouseEvent | TouchEvent, node: StoryNode) => {
  e.stopPropagation()
  e.preventDefault()
  selectedNodeId.value = node.id
  const s = canvasState.value.scale
  const pos = getClientPos(e)
  const canvasPos = screenToCanvas(pos.x, pos.y)
  linkState.value = {
    fromId: node.id,
    x1: canvasPos.x * s,
    y1: canvasPos.y * s,
    x2: canvasPos.x * s,
    y2: canvasPos.y * s,
  }
  window.addEventListener('mousemove', onLinkMove)
  window.addEventListener('mouseup', onLinkEnd)
  window.addEventListener('touchmove', onLinkMove as EventListener, { passive: false })
  window.addEventListener('touchend', onLinkEnd as EventListener)
}

const onLinkMove = (e: MouseEvent | TouchEvent) => {
  if (!linkState.value.fromId) return
  if ('touches' in e) e.preventDefault()
  const pos = getClientPos(e)
  const canvasPos = screenToCanvas(pos.x, pos.y)
  const s = canvasState.value.scale
  linkState.value.x2 = canvasPos.x * s
  linkState.value.y2 = canvasPos.y * s
}

const onLinkEnd = (e: MouseEvent | TouchEvent) => {
  const fromId = linkState.value.fromId
  if (fromId) {
    const fromNode = project.value.nodes.find((n) => n.id === fromId)
    if (fromNode) {
      const pos = getClientPos(e)
      const targetEl = document.elementFromPoint(pos.x, pos.y) as HTMLElement | null
      const nodeEl = targetEl?.closest('.game-factory__node') as HTMLElement | null
      const toId = nodeEl?.dataset.nodeId
      if (toId && toId !== fromNode.id) {
        fromNode.choices.push({
          id: genId(),
          text: '跳转',
          targetId: toId,
        })
      }
    }
  }
  linkState.value.fromId = null
  window.removeEventListener('mousemove', onLinkMove)
  window.removeEventListener('mouseup', onLinkEnd)
  window.removeEventListener('touchmove', onLinkMove as EventListener)
  window.removeEventListener('touchend', onLinkEnd as EventListener)
}

// ==================== 导入导出 ====================
const exportProject = () => {
  const blob = new Blob([JSON.stringify(project.value, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${project.value.name}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const triggerImport = () => {
  fileInputRef.value?.click()
}

const importProject = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result as string) as GameProject
      if (data.nodes && Array.isArray(data.nodes)) {
        project.value = data
        selectedNodeId.value = data.nodes[0]?.id || null
      }
    } catch {
      // ignore invalid file
    }
    target.value = ''
  }
  reader.readAsText(file)
}

// ==================== 自动布局 ====================
const autoLayout = () => {
  project.value.nodes.forEach((node, idx) => {
    node.x = 60 + (idx % 3) * 260
    node.y = 60 + Math.floor(idx / 3) * 200
  })
  resetZoom()
}

watch(project, () => {
  // 保证响应式更新
}, { deep: true })
</script>

<template>
  <div class="game-factory">
    <!-- 顶部工具栏 -->
    <header class="game-factory__toolbar">
      <div class="game-factory__brand">
        <MagicStick class="game-factory__brand-icon" />
        <span class="game-factory__brand-text">Game Factory</span>
      </div>
      <div class="game-factory__actions">
        <button class="game-factory__btn game-factory__btn--blue" @click="autoLayout">
          <Connection class="icon" />
          <span>自动布局</span>
        </button>
        <button class="game-factory__btn game-factory__btn--yellow" @click="exportProject">
          <Download class="icon" />
          <span>导出</span>
        </button>
        <button class="game-factory__btn game-factory__btn--green" @click="triggerImport">
          <Upload class="icon" />
          <span>导入</span>
        </button>
        <button class="game-factory__btn game-factory__btn--pink" @click="addNode">
          <Plus class="icon" />
          <span>新建节点</span>
        </button>
      </div>
      <div class="game-factory__zoom-controls">
        <button class="game-factory__zoom-btn" @click="zoomOut">−</button>
        <span class="game-factory__zoom-value">{{ Math.round(canvasState.scale * 100) }}%</span>
        <button class="game-factory__zoom-btn" @click="zoomIn">+</button>
        <button class="game-factory__zoom-btn game-factory__zoom-btn--reset" @click="resetZoom">⟲</button>
      </div>
      <input
        ref="fileInputRef"
        type="file"
        accept=".json"
        class="game-factory__file-input"
        @change="importProject"
      />
    </header>

    <!-- 工作区 -->
    <div class="game-factory__workspace">
      <!-- 故事画布 -->
      <div
        ref="canvasRef"
        class="game-factory__canvas"
        :class="{ 'game-factory__canvas--panning': panState.isPanning }"
        @mousedown="startPan"
        @touchstart="startPan"
        @wheel="onWheel"
      >
        <div class="game-factory__canvas-inner" :style="canvasTranslateStyle">
          <!-- SVG 连线层 -->
          <svg class="game-factory__svg-layer">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#8C7B70" />
              </marker>
            </defs>
            <path
              v-for="(line, idx) in connections"
              :key="idx"
              class="game-factory__connection"
              :d="`M ${line.x1} ${line.y1} Q ${(line.x1 + line.x2) / 2} ${line.y1 - 30 * canvasState.scale} ${line.x2} ${line.y2}`"
              :stroke="line.color"
              fill="none"
              marker-end="url(#arrowhead)"
            />
            <path
              v-if="linkState.fromId"
              class="game-factory__connection game-factory__connection--linking"
              :d="`M ${linkState.x1} ${linkState.y1} Q ${(linkState.x1 + linkState.x2) / 2} ${linkState.y1 - 30 * canvasState.scale} ${linkState.x2} ${linkState.y2}`"
              stroke="#8C7B70"
              fill="none"
              marker-end="none"
            />
          </svg>

          <!-- 节点层 -->
          <div
            v-for="node in project.nodes"
            :key="node.id"
            class="game-factory__node"
            :class="{ 'game-factory__node--active': selectedNodeId === node.id }"
            :data-node-id="node.id"
            :style="{ left: `${node.x * canvasState.scale}px`, top: `${node.y * canvasState.scale}px`, '--node-color': node.color }"
            @mousedown.stop="startNodeDrag($event, node)"
            @touchstart.stop="startNodeDrag($event, node)"
          >
            <div class="game-factory__node-header">
              <h3 class="game-factory__node-title">{{ node.title }}</h3>
              <Delete
                class="game-factory__node-delete"
                @mousedown.stop
                @click.stop="deleteNode(node.id)"
              />
            </div>
            <p class="game-factory__node-preview">{{ node.content.slice(0, 36) }}…</p>
            <div class="game-factory__node-choices">
              <span
                v-for="c in node.choices.slice(0, 2)"
                :key="c.id"
                class="game-factory__node-choice-dot"
                :class="{ 'game-factory__node-choice-dot--empty': !c.targetId }"
              />
              <span v-if="node.choices.length > 2" class="game-factory__node-choice-more">+</span>
            </div>
            <span
              class="game-factory__node-link-handle"
              @mousedown.stop="startLink($event, node)"
              @touchstart.stop="startLink($event, node)"
            />
            <span
              class="game-factory__node-link-hit"
              @touchstart.stop="startLink($event, node)"
            />
          </div>
        </div>
      </div>

      <!-- 属性编辑面板 -->
      <aside v-if="selectedNode" class="game-factory__editor">
        <h3 class="game-factory__editor-title">✏️ 节点编辑</h3>

        <div class="game-factory__field">
          <label class="game-factory__label">节点标题</label>
          <input v-model="selectedNode.title" class="game-factory__input" />
        </div>

        <div class="game-factory__field">
          <label class="game-factory__label">故事内容</label>
          <textarea
            v-model="selectedNode.content"
            class="game-factory__textarea"
            rows="5"
          />
        </div>

        <div class="game-factory__field">
          <label class="game-factory__label">涂鸦颜色</label>
          <div class="game-factory__color-picker">
            <span
              v-for="c in doodleColors"
              :key="c"
              class="game-factory__color-swatch"
              :class="{ 'game-factory__color-swatch--active': selectedNode.color === c }"
              :style="{ background: c }"
              @click="selectedNode.color = c"
            />
          </div>
        </div>

        <div class="game-factory__field">
          <div class="game-factory__choices-header">
            <label class="game-factory__label">分支选项</label>
            <button class="game-factory__mini-btn" @click="addChoice">+ 添加</button>
          </div>
          <div class="game-factory__choices-list">
            <div
              v-for="choice in selectedNode.choices"
              :key="choice.id"
              class="game-factory__choice-item"
            >
              <input v-model="choice.text" class="game-factory__choice-input" placeholder="选项文案" />
              <select v-model="choice.targetId" class="game-factory__choice-select">
                <option :value="null">无跳转</option>
                <option
                  v-for="n in project.nodes.filter((n) => n.id !== selectedNodeId)"
                  :key="n.id"
                  :value="n.id"
                >
                  {{ n.title }}
                </option>
              </select>
              <span class="game-factory__choice-remove" @click="removeChoice(choice.id)">×</span>
            </div>
            <p v-if="!selectedNode.choices.length" class="game-factory__empty-hint">
              暂无分支，点击上方按钮添加
            </p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@mixin doodle-box($borderColor: #5C4F4A, $rotate: -1deg) {
  border: calc(2px * var(--sf)) solid $borderColor;
  border-radius: calc(255px * var(--sf)) calc(15px * var(--sf)) calc(225px * var(--sf)) calc(15px * var(--sf)) / calc(15px * var(--sf)) calc(225px * var(--sf)) calc(15px * var(--sf)) calc(255px * var(--sf));
  transform: rotate($rotate);
  background: #FFFCF8;
  box-shadow: calc(3px * var(--sf)) calc(4px * var(--sf)) 0 rgba($borderColor, 0.12);
}

@mixin doodle-btn($bg, $border) {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: 2px solid $border;
  border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
  background: $bg;
  color: #fff;
  cursor: pointer;
  transform: rotate(-1deg);
  box-shadow: 2px 3px 0 rgba($border, 0.25);
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: rotate(0deg) translateY(-1px);
    box-shadow: 3px 5px 0 rgba($border, 0.3);
  }

  &:active {
    transform: rotate(0deg) translateY(1px);
    box-shadow: 1px 2px 0 rgba($border, 0.25);
  }

  .icon {
    width: 16px;
    height: 16px;
  }
}

.game-factory {
  --sf: v-bind('canvasState.scale');

  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  color: var(--color-text);
  font-family: 'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', cursive, sans-serif;

  &__toolbar {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.9rem 1.25rem;
    margin-bottom: 0.5rem;
    background: #FFFCF8;
    border: 2px dashed #E0D8D0;
    border-radius: 12px;

    @media (max-width: 768px) {
      flex-wrap: wrap;
      padding: 0.75rem 1rem;
    }
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.25rem;
    font-weight: bold;
    color: #5C4F4A;
    transform: rotate(-1deg);

    &-icon {
      width: 22px;
      height: 22px;
      color: #E8A87C;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  &__btn {
    &--yellow {
      @include doodle-btn(#F4D03F, #D4AC0D);
    }
    &--green {
      @include doodle-btn(#82E0AA, #27AE60);
    }
    &--blue {
      @include doodle-btn(#85C1E9, #2E86C1);
    }
    &--pink {
      @include doodle-btn(#F5B7B1, #E74C3C);
    }

    @media (max-width: 576px) {
      padding: 0.5rem 0.8rem;
      font-size: 0.85rem;

      span {
        display: none;
      }

      .icon {
        width: 18px;
        height: 18px;
      }
    }
  }

  &__zoom-controls {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    margin-left: auto;
  }

  &__zoom-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 600;
    border: 2px solid #E0D8D0;
    border-radius: 8px;
    background: #FFFCF8;
    color: #5C4F4A;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      border-color: #E8A87C;
      color: #E8A87C;
    }

    &--reset {
      font-size: 0.9rem;
    }
  }

  &__zoom-value {
    min-width: 48px;
    text-align: center;
    font-size: 0.85rem;
    font-weight: 600;
    color: #8C7B70;
  }

  &__file-input {
    display: none;
  }

  &__workspace {
    flex: 1;
    display: flex;
    gap: 1rem;
    min-height: 0;
    overflow: hidden;

    @media (max-width: 992px) {
      flex-direction: column;
    }
  }

  &__canvas {
    position: relative;
    flex: 1;
    min-width: 0;
    background-image:
      radial-gradient(#E0D8D0 1px, transparent 1px),
      radial-gradient(#E0D8D0 1px, transparent 1px);
    background-size: calc(24px * var(--sf)) calc(24px * var(--sf));
    background-position: 0 0, calc(12px * var(--sf)) calc(12px * var(--sf));
    background-color: #FFFCF8;
    border: 2px solid #E0D8D0;
    border-radius: 14px;
    overflow: hidden;
    cursor: grab;

    &--panning {
      cursor: grabbing;
    }

    @media (max-width: 992px) {
      min-height: 320px;
    }
  }

  &__canvas-inner {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    transform-origin: 0 0;
    will-change: transform;
    backface-visibility: hidden;
  }

  &__svg-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    overflow: visible;
  }

  &__connection {
    stroke-width: calc(3px * var(--sf));
    stroke-dasharray: calc(8px * var(--sf)) calc(6px * var(--sf));
    opacity: 0.85;
    cursor: default;
  }

  &__connection--linking {
    stroke-dasharray: calc(6px * var(--sf)) calc(4px * var(--sf));
    opacity: 0.7;
    stroke: #8C7B70;
    cursor: default;
  }

  &__node {
    position: absolute;
    width: calc(220px * var(--sf));
    padding: calc(1rem * var(--sf));
    cursor: default;
    user-select: none;
    z-index: 2;
    @include doodle-box(#5C4F4A, -1deg);
    backface-visibility: hidden;

    &:nth-child(odd) {
      transform: rotate(1deg);
    }

    &--active {
      border-color: var(--node-color, #E8A87C);
      box-shadow: calc(4px * var(--sf)) calc(6px * var(--sf)) 0 rgba(0, 0, 0, 0.1);
      z-index: 3;
    }

    &:active {
      cursor: default;
    }
  }

  &__node-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: calc(0.5rem * var(--sf));
  }

  &__node-title {
    margin: 0;
    font-size: calc(1.05rem * var(--sf));
    font-weight: bold;
    color: #5C4F4A;
    line-height: 1.3;
  }

  &__node-delete {
    width: calc(18px * var(--sf));
    height: calc(18px * var(--sf));
    color: #B89A88;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: #E74C3C;
    }
  }

  &__node-preview {
    margin: 0 0 calc(0.6rem * var(--sf));
    font-size: calc(0.85rem * var(--sf));
    line-height: 1.5;
    color: #8C7B70;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__node-choices {
    display: flex;
    align-items: center;
    gap: calc(0.35rem * var(--sf));
  }

  &__node-choice-dot {
    width: calc(10px * var(--sf));
    height: calc(10px * var(--sf));
    border-radius: 50%;
    background: var(--node-color, #E8A87C);

    &--empty {
      background: transparent;
      border: calc(2px * var(--sf)) dashed #ccc;
    }
  }

  &__node-choice-more {
    font-size: calc(0.8rem * var(--sf));
    color: #aaa;
  }

  &__node-link-handle {
    position: absolute;
    right: calc(10px * var(--sf));
    bottom: calc(10px * var(--sf));
    width: calc(14px * var(--sf));
    height: calc(14px * var(--sf));
    border-radius: 50%;
    background: var(--node-color, #E8A87C);
    border: calc(2px * var(--sf)) solid #fff;
    cursor: crosshair;
    z-index: 4;
    box-shadow: 0 calc(2px * var(--sf)) calc(4px * var(--sf)) rgba(0, 0, 0, 0.15);
    transition: transform 0.15s ease;

    &:hover {
      transform: scale(1.25);
    }
  }

  &__node-link-hit {
    position: absolute;
    right: calc(10px * var(--sf));
    bottom: calc(10px * var(--sf));
    width: calc(44px * var(--sf));
    height: calc(44px * var(--sf));
    transform: translate(50%, 50%);
    background: transparent;
    z-index: 5;
    cursor: crosshair;
  }

  &__editor {
    width: 320px;
    flex-shrink: 0;
    padding: 1.25rem;
    background: #FFFCF8;
    border: 2px solid #E0D8D0;
    border-radius: 14px;
    overflow-y: auto;

    @media (max-width: 992px) {
      width: 100%;
      max-height: 360px;
    }
  }

  &__editor-title {
    margin: 0 0 1rem;
    font-size: 1.1rem;
    font-weight: bold;
    color: #5C4F4A;
  }

  &__field {
    margin-bottom: 1rem;
  }

  &__label {
    display: block;
    margin-bottom: 0.4rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: #5C4F4A;
  }

  &__input,
  &__textarea,
  &__choice-input,
  &__choice-select {
    width: 100%;
    padding: 0.55rem 0.75rem;
    font-size: 0.95rem;
    border: 2px solid #E0D8D0;
    border-radius: 10px;
    outline: none;
    background: #fff;
    color: #5C4F4A;
    font-family: inherit;

    &:focus {
      border-color: #E8A87C;
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 80px;
  }

  &__color-picker {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  &__color-swatch {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    transition: transform 0.15s ease;

    &--active {
      border-color: #5C4F4A;
      transform: scale(1.15);
    }
  }

  &__choices-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.4rem;
  }

  &__mini-btn {
    padding: 0.25rem 0.6rem;
    font-size: 0.8rem;
    font-weight: 600;
    border: 2px dashed #E8A87C;
    border-radius: 8px;
    background: transparent;
    color: #E8A87C;
    cursor: pointer;

    &:hover {
      background: rgba(#E8A87C, 0.08);
    }
  }

  &__choices-list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  &__choice-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem;
    background: #fff;
    border: 2px dashed #E0D8D0;
    border-radius: 10px;
  }

  &__choice-input {
    flex: 1;
    min-width: 0;
    border: none;
    padding: 0.25rem 0.4rem;
    background: transparent;
  }

  &__choice-select {
    width: 90px;
    padding: 0.25rem 0.4rem;
    font-size: 0.85rem;
    border-radius: 6px;
  }

  &__choice-remove {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    color: #aaa;
    cursor: pointer;
    border-radius: 50%;

    &:hover {
      color: #E74C3C;
      background: rgba(#E74C3C, 0.08);
    }
  }

  &__empty-hint {
    margin: 0;
    font-size: 0.85rem;
    color: #aaa;
    text-align: center;
  }

  /* ==================== 暗黑模式 ==================== */
  html.dark & {
    &__toolbar {
      background: #1F1F21;
      border-color: #2F2C26;
    }

    &__brand {
      color: #c5c4c4;
    }

    &__btn--blue {
      @include doodle-btn(#4A5A6A, #5A7A9A);
      color: #B8D4E8;
    }
    &__btn--yellow {
      @include doodle-btn(#6A5A3A, #8A7A4A);
      color: #E8D8A8;
    }
    &__btn--green {
      @include doodle-btn(#4A5A4A, #5A7A5A);
      color: #B8D8B8;
    }
    &__btn--pink {
      @include doodle-btn(#6A4A4A, #8A5A5A);
      color: #E8B8B8;
    }

    &__zoom-btn {
      background: #1F1F21;
      border-color: #2F2C26;
      color: #c5c4c4;

      &:hover {
        border-color: #caa84a;
        color: #caa84a;
      }
    }

    &__zoom-value {
      color: #9a958c;
    }

    &__canvas {
      background-color: #1A1A1C;
      background-image:
        radial-gradient(#2F2C26 1px, transparent 1px),
        radial-gradient(#2F2C26 1px, transparent 1px);
      border-color: #2F2C26;
    }

    &__node {
      background: #1F1F21;
      border-color: #3d362a;
      box-shadow: calc(3px * var(--sf)) calc(4px * var(--sf)) 0 rgba(0, 0, 0, 0.3);

      &--active {
        border-color: var(--node-color, #caa84a);
        box-shadow: calc(4px * var(--sf)) calc(6px * var(--sf)) 0 rgba(0, 0, 0, 0.4);
      }
    }

    &__node-title {
      color: #c5c4c4;
    }

    &__node-preview {
      color: #9a958c;
    }

    &__node-link-handle {
      border-color: #1F1F21;
    }

    &__editor {
      background: #1F1F21;
      border-color: #2F2C26;
    }

    &__editor-title,
    &__label {
      color: #c5c4c4;
    }

    &__input,
    &__textarea,
    &__choice-input,
    &__choice-select {
      background: #161616;
      border-color: #2F2C26;
      color: #c5c4c4;

      &:focus {
        border-color: #caa84a;
      }
    }

    &__choice-item {
      background: #161616;
      border-color: #2F2C26;
    }

    &__mini-btn {
      border-color: #caa84a;
      color: #caa84a;

      &:hover {
        background: rgba(#caa84a, 0.1);
      }
    }

    &__empty-hint {
      color: #8a8070;
    }
  }
}
</style>
