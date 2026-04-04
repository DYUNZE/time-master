<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import { useGlobalTheme } from '@/composables/useGlobalTheme'
import Clock from '@/components/Clock.vue'
import CalendarIcon from '@/components/icons/IconCalendar.vue'
import ChatIcon from '@/components/icons/IconChat.vue'
import BookIcon from '@/components/icons/IconBook.vue'
import HammerIcon from '@/components/icons/IconHammer.vue'

const router = useRouter()
const userStore = useUserStore()
const { isDark } = useGlobalTheme()

// ==================== 时间问候 ====================
const currentTime = ref(new Date())
let timerId: ReturnType<typeof setInterval> | null = null

const greeting = computed(() => {
  const hour = currentTime.value.getHours()
  if (hour < 6) return '夜深了，注意休息'
  if (hour < 11) return '早上好，开启元气满满的一天'
  if (hour < 13) return '中午好，记得适当休息'
  if (hour < 18) return '下午好，保持专注'
  return '晚上好，享受惬意时光'
})

const formattedDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }
  return currentTime.value.toLocaleDateString('zh-CN', options)
})

// ==================== 快捷入口 ====================
interface QuickEntry {
  label: string
  path: string
  icon: typeof CalendarIcon
  color: string
}

const quickEntries = ref<QuickEntry[]>([
  { label: '今日计划', path: '/home/plan', icon: CalendarIcon, color: '#E8A87C' },
  { label: '聊天室', path: '/home/chat', icon: ChatIcon, color: '#D4A574' },
  { label: '图书馆', path: '/home/library', icon: BookIcon, color: '#C4A77D' },
  { label: '游戏工厂', path: '/home/game-factory', icon: HammerIcon, color: '#B88A75' },
])

const getQuickIconStyle = (color: string) => {
  if (isDark.value) {
    const darkMap: Record<string, string> = {
      '#E8A87C': '#3d2e14',
      '#D4A574': '#3d2e14',
      '#C4A77D': '#3d2e14',
      '#B88A75': '#3d2e14',
    }
    return {
      backgroundColor: darkMap[color] || `${color}15`,
      color,
    }
  }
  return {
    backgroundColor: `${color}18`,
    color,
  }
}

const navigateTo = (path: string) => {
  router.push(path)
}

// ==================== 热点信息 ====================
interface HotItem {
  id: number
  title: string
  tag: string
  tagType: '' | 'success' | 'warning' | 'danger' | 'info'
  heat: number
}

const hotList = ref<HotItem[]>([
  { id: 1, title: 'Vue 3.5 正式发布，性能再升级', tag: '前端', tagType: 'warning', heat: 9820 },
  { id: 2, title: 'TypeScript 5.9 新特性全面解读', tag: '技术', tagType: '', heat: 8750 },
  { id: 3, title: '2026 年度开发者效率工具推荐', tag: '工具', tagType: 'warning', heat: 7430 },
  { id: 4, title: 'AI 辅助编程最佳实践指南', tag: 'AI', tagType: 'danger', heat: 6890 },
  { id: 5, title: '深入浅出 Vite 构建原理', tag: '工程化', tagType: 'info', heat: 5210 },
])

// ==================== 每日一句 ====================
const dailyQuote = ref({
  content: '不积跬步，无以至千里；不积小流，无以成江海。',
  author: '荀子',
})

// ==================== 生命周期 ====================
onMounted(() => {
  timerId = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
})
</script>

<template>
  <div class="home-index">
    <!-- 顶部欢迎区 -->
    <section class="home-index__welcome">
      <div class="home-index__welcome-text">
        <h1 class="home-index__greeting">
          {{ greeting }}，{{ userStore.userInfo.username || '朋友' }}
        </h1>
        <p class="home-index__date">{{ formattedDate }}</p>
      </div>
      <div class="home-index__clock">
        <Clock />
      </div>
    </section>

    <!-- 快捷入口 -->
    <section class="home-index__section">
      <h2 class="home-index__section-title">快捷入口</h2>
      <div class="home-index__quick-grid">
        <div
          v-for="item in quickEntries"
          :key="item.label"
          class="home-index__quick-card"
          @click="navigateTo(item.path)"
        >
          <div class="home-index__quick-icon" :style="getQuickIconStyle(item.color)">
            <component :is="item.icon" class="icon" />
          </div>
          <span class="home-index__quick-label">{{ item.label }}</span>
        </div>
      </div>
    </section>

    <!-- 内容主区 -->
    <div class="home-index__main">
      <!-- 热点信息 -->
      <section class="home-index__section home-index__section--wide">
        <h2 class="home-index__section-title">
          <span class="home-index__dot" />
          热点信息
        </h2>
        <el-card class="home-index__card" shadow="never">
          <ul class="home-index__hot-list">
            <li v-for="item in hotList" :key="item.id" class="home-index__hot-item">
              <div class="home-index__hot-info">
                <el-tag size="small" :type="item.tagType" effect="plain" class="home-index__hot-tag">
                  {{ item.tag }}
                </el-tag>
                <span class="home-index__hot-title">{{ item.title }}</span>
              </div>
              <span class="home-index__hot-heat">
                <i class="home-index__heat-icon" />
                {{ item.heat }}
              </span>
            </li>
          </ul>
        </el-card>
      </section>

      <!-- 每日一句 -->
      <section class="home-index__section">
        <h2 class="home-index__section-title">
          <span class="home-index__dot home-index__dot--orange" />
          每日一句
        </h2>
        <el-card class="home-index__card home-index__card--quote" shadow="never">
          <p class="home-index__quote-content">「 {{ dailyQuote.content }} 」</p>
          <p class="home-index__quote-author">—— {{ dailyQuote.author }}</p>
        </el-card>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-index {
  padding-bottom: 2rem;
  color: var(--color-text);

  &__welcome {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding: 1.5rem 2rem;
    border-radius: 16px;
    background: linear-gradient(135deg, #FFF9F3 0%, #FFFCF8 100%);
    border: 1px solid #F0E6DC;
    box-shadow: 0 4px 18px rgba(166, 124, 82, 0.06);

    @media (max-width: 768px) {
      flex-direction: column-reverse;
      align-items: flex-start;
      padding: 1.2rem;
    }
  }

  &__greeting {
    margin: 0 0 0.5rem;
    font-size: 1.6rem;
    font-weight: 600;
    line-height: 1.3;
    color: #5C4F4A;
  }

  &__date {
    margin: 0;
    font-size: 0.95rem;
    color: #8C7B70;
  }

  &__clock {
    flex-shrink: 0;
  }

  &__section {
    margin-bottom: 1.8rem;

    &--wide {
      flex: 1.4;
      min-width: 0;
    }
  }

  &__section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 1rem;
    font-size: 1.1rem;
    font-weight: 600;
    color: #5C4F4A;
  }

  &__dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #E8A87C;

    &--orange {
      background-color: #E8A87C;
    }
  }

  &__quick-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;

    @media (max-width: 992px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 576px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }
  }

  &__quick-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-radius: 14px;
    background: #FFFCF8;
    border: 1px solid #F0E6DC;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 22px rgba(166, 124, 82, 0.1);
      border-color: #EBDCD0;
    }

    @media (max-width: 576px) {
      padding: 0.875rem 1rem;
    }
  }

  &__quick-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    flex-shrink: 0;

    .icon {
      width: 22px;
      height: 22px;
    }
  }

  &__quick-label {
    font-size: 1rem;
    font-weight: 500;
    color: #5C4F4A;
  }

  &__main {
    display: flex;
    gap: 1.5rem;

    @media (max-width: 992px) {
      flex-direction: column;
    }
  }

  &__card {
    border-radius: 14px;
    border: 1px solid #F0E6DC;
    background: #FFFCF8;

    :deep(.el-card__body) {
      padding: 1rem 1.25rem;
    }

    &--quote {
      background: linear-gradient(135deg, #FFF6F0 0%, #FFFCF8 100%);
      border-color: #F0E6DC;

      :deep(.el-card__body) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 120px;
      }
    }
  }

  &__hot-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__hot-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.85rem 0;
    border-bottom: 1px solid #F5EDE5;
    transition: background-color 0.2s ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background-color: #FFF5ED;
      border-radius: 8px;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      margin: 0 -0.5rem;
    }
  }

  &__hot-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
  }

  &__hot-tag {
    flex-shrink: 0;
  }

  &__hot-title {
    font-size: 0.95rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #5C4F4A;
  }

  &__hot-heat {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.85rem;
    color: #B89A88;
  }

  &__heat-icon {
    display: inline-block;
    width: 14px;
    height: 14px;
    background: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%23E8A87C%22><path d=%22M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z%22/></svg>') center/contain no-repeat;
  }

  &__quote-content {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    line-height: 1.8;
    font-style: italic;
    color: #5C4F4A;
  }

  &__quote-author {
    margin: 0;
    font-size: 0.9rem;
    text-align: right;
    color: #8C7B70;
  }

  /* ==================== 暗黑模式适配 ==================== */
  html.dark & {
    &__welcome {
      background: linear-gradient(135deg, #1F1C18 0%, #1F1F21 100%);
      border-color: #2F2C26;
      box-shadow: none;
    }

    &__greeting,
    &__section-title,
    &__quick-label,
    &__hot-title,
    &__quote-content {
      color: #c5c4c4;
    }

    &__date,
    &__quote-author {
      color: #9a958c;
    }

    &__dot {
      background-color: #caa84a;

      &--orange {
        background-color: #caa84a;
      }
    }

    &__quick-card,
    &__card {
      background: #1F1F21;
      border-color: #2F2C26;
      box-shadow: none;
    }

    &__quick-card:hover {
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
      border-color: #3d362a;
    }

    &__hot-item {
      border-bottom-color: #2F2C26;

      &:hover {
        background-color: #252219;
      }
    }

    &__hot-heat {
      color: #8a8070;
    }

    &__heat-icon {
      background: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%23caa84a%22><path d=%22M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z%22/></svg>') center/contain no-repeat;
    }

    &__card--quote {
      background: linear-gradient(135deg, #1F1C18 0%, #1F1F21 100%);
      border-color: #2F2C26;
    }
  }
}
</style>
