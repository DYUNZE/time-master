<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useGlobalTheme } from '@/composables/useGlobalTheme'

// ==================== 分类 ====================
interface Category {
  id: string
  name: string
}

const { isDark } = useGlobalTheme()

const categories = ref<Category[]>([
  { id: 'all', name: '全部' },
  { id: 'tech', name: '技术' },
  { id: 'literature', name: '文学' },
  { id: 'history', name: '历史' },
  { id: 'art', name: '艺术' },
  { id: 'life', name: '生活' },
])

const activeCategory = ref('all')

// ==================== 图书数据 ====================
interface Book {
  id: number
  title: string
  author: string
  category: string
  categoryId: string
  cover: string
  img_url?: string
  rating: number
  desc: string
}

const allBooks = ref<Book[]>([
  { id: 1, title: '深入浅出 Vue.js', author: '刘博文', category: '技术', categoryId: 'tech', cover: '#E8A87C', img_url: 'https://picsum.photos/seed/vuejs/400/600', rating: 4.8, desc: '从源码层面解析 Vue 的设计思想与实现原理' },
  { id: 2, title: 'JavaScript 高级程序设计', author: 'Matt Frisbie', category: '技术', categoryId: 'tech', cover: '#D4A574', rating: 4.9, desc: '前端开发者必读的红宝书经典第四版' },
  { id: 3, title: '百年孤独', author: '加西亚·马尔克斯', category: '文学', categoryId: 'literature', cover: '#C4A77D', img_url: 'https://picsum.photos/seed/loneliness/400/600', rating: 4.9, desc: '魔幻现实主义文学的巅峰之作' },
  { id: 4, title: '人类简史', author: '尤瓦尔·赫拉利', category: '历史', categoryId: 'history', cover: '#B88A75', rating: 4.7, desc: '从认知革命到科学革命的人类发展历程' },
  { id: 5, title: '设计心理学', author: '唐纳德·诺曼', category: '艺术', categoryId: 'art', cover: '#E8A87C', img_url: 'https://picsum.photos/seed/design/400/600', rating: 4.6, desc: '日用品设计背后的心理学原理' },
  { id: 6, title: '断舍离', author: '山下英子', category: '生活', categoryId: 'life', cover: '#D4A574', rating: 4.3, desc: '通过整理物品整理内心，重获自由' },
  { id: 7, title: '你不知道的 JavaScript', author: 'Kyle Simpson', category: '技术', categoryId: 'tech', cover: '#C4A77D', img_url: 'https://picsum.photos/seed/jsbook/400/600', rating: 4.8, desc: '深入理解 JS 作用域、闭包与 this' },
  { id: 8, title: '活着', author: '余华', category: '文学', categoryId: 'literature', cover: '#B88A75', rating: 4.9, desc: '一个人一生的苦难与坚韧' },
  { id: 9, title: '明朝那些事儿', author: '当年明月', category: '历史', categoryId: 'history', cover: '#E8A87C', img_url: 'https://picsum.photos/seed/ming/400/600', rating: 4.8, desc: '用现代语言讲述大明三百年历史' },
  { id: 10, title: '色彩艺术', author: '约翰内斯·伊顿', category: '艺术', categoryId: 'art', cover: '#D4A574', rating: 4.5, desc: '色彩构成与视觉艺术的基础理论' },
  { id: 11, title: '重构：改善既有代码的设计', author: 'Martin Fowler', category: '技术', categoryId: 'tech', cover: '#B88A75', rating: 4.8, desc: '代码重构的经典指南与实战技巧' },
  { id: 12, title: '撒哈拉的故事', author: '三毛', category: '文学', categoryId: 'literature', cover: '#E8A87C', img_url: 'https://picsum.photos/seed/sahara/400/600', rating: 4.7, desc: '沙漠生活中的浪漫与诗意' },
])

const getCoverStyle = (book: Book) => {
  if (book.img_url) return {}
  if (isDark.value) {
    const darkMap: Record<string, string> = {
      '#E8A87C': 'linear-gradient(160deg, #4A4238 0%, #2E2822 100%)',
      '#D4A574': 'linear-gradient(160deg, #3E3A32 0%, #262420 100%)',
      '#C4A77D': 'linear-gradient(160deg, #3A3630 0%, #222018 100%)',
      '#B88A75': 'linear-gradient(160deg, #383430 0%, #201C18 100%)',
    }
    return { background: darkMap[book.cover] || darkMap['#E8A87C'] }
  }
  return { background: book.cover }
}

// ==================== 搜索 ====================
const searchKeyword = ref('')

// ==================== 筛选逻辑 ====================
const filteredBooks = computed(() => {
  return allBooks.value.filter((book) => {
    const matchCategory = activeCategory.value === 'all' || book.categoryId === activeCategory.value
    const matchKeyword =
      searchKeyword.value.trim() === '' ||
      book.title.toLowerCase().includes(searchKeyword.value.trim().toLowerCase()) ||
      book.author.toLowerCase().includes(searchKeyword.value.trim().toLowerCase())
    return matchCategory && matchKeyword
  })
})

// ==================== 分页 ====================
const currentPage = ref(1)
const pageSize = ref(8)

const total = computed(() => filteredBooks.value.length)

const pagedBooks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredBooks.value.slice(start, end)
})

// 切换分类或搜索时重置到第一页
watch([activeCategory, searchKeyword], () => {
  currentPage.value = 1
})

// ==================== 阅读状态 ====================
const readIds = ref<number[]>([])

const toggleRead = (id: number) => {
  const idx = readIds.value.indexOf(id)
  if (idx > -1) {
    readIds.value.splice(idx, 1)
  } else {
    readIds.value.push(id)
  }
}
</script>

<template>
  <div class="library-view">
    <!-- 顶部操作栏 -->
    <header class="library-view__header">
      <div class="library-view__search">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索书名 / 作者"
          :prefix-icon="Search"
          clearable
          class="library-view__search-input"
        />
      </div>
    </header>

    <!-- 分类筛选 -->
    <nav class="library-view__categories">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="library-view__cat-btn"
        :class="{ 'library-view__cat-btn--active': activeCategory === cat.id }"
        @click="activeCategory = cat.id"
      >
        {{ cat.name }}
      </button>
    </nav>

    <!-- 图书书架 -->
    <section class="library-view__shelf">
      <div v-if="pagedBooks.length" class="library-view__grid">
        <div v-for="book in pagedBooks" :key="book.id" class="library-view__book">
          <!-- 书脊/封面 -->
          <div class="library-view__book-cover" :style="getCoverStyle(book)">
            <img
              v-if="book.img_url"
              :src="book.img_url"
              alt=""
              class="library-view__book-cover-img"
              loading="lazy"
            />
            <div v-if="book.img_url" class="library-view__book-cover-mask" />
            <span class="library-view__book-spine" />
            <h3 class="library-view__book-title-on-cover">{{ book.title }}</h3>
            <span class="library-view__book-author-on-cover">{{ book.author }}</span>
          </div>
          <!-- 书底信息 -->
          <div class="library-view__book-info">
            <div class="library-view__book-meta">
              <el-tag size="small" effect="plain" class="library-view__book-tag">{{ book.category }}</el-tag>
              <span class="library-view__book-rating">
                <i class="library-view__star" />
                {{ book.rating }}
              </span>
            </div>
            <p class="library-view__book-desc">{{ book.desc }}</p>
            <div class="library-view__book-actions">
              <button
                class="library-view__read-btn"
                :class="{ 'library-view__read-btn--read': readIds.includes(book.id) }"
                @click="toggleRead(book.id)"
              >
                {{ readIds.includes(book.id) ? '已读' : '开始阅读' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="library-view__empty">
        <p>未找到相关图书，换个关键词试试 ~</p>
      </div>
    </section>

    <!-- 分页 -->
    <footer v-if="total > 0" class="library-view__footer">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[8, 12, 16]"
        layout="total, sizes, prev, pager, next"
        background
        class="library-view__pagination"
      />
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.library-view {
  padding-bottom: 2rem;
  color: var(--color-text);

  &__header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1.25rem;
  }

  &__search {
    width: 280px;

    @media (max-width: 576px) {
      width: 100%;
    }
  }

  &__search-input {
    :deep(.el-input__wrapper) {
      border-radius: 10px;
      background: #FFFCF8;
      box-shadow: 0 0 0 1px #F0E6DC inset;
      transition: box-shadow 0.2s ease;

      &.is-focus {
        box-shadow: 0 0 0 1px #E8A87C inset;
      }
    }

    :deep(.el-input__inner) {
      color: #5C4F4A;

      &::placeholder {
        color: #B89A88;
      }
    }
  }

  &__categories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-bottom: 1.5rem;
  }

  &__cat-btn {
    padding: 0.5rem 1.1rem;
    font-size: 0.9rem;
    font-weight: 500;
    color: #8C7B70;
    background: #FFFCF8;
    border: 1px solid #F0E6DC;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      color: #E8A87C;
      border-color: #EBDCD0;
    }

    &--active {
      color: #fff;
      background: linear-gradient(135deg, #E8A87C 0%, #D4A574 100%);
      border-color: transparent;
      box-shadow: 0 4px 12px rgba(232, 168, 124, 0.3);
    }
  }

  &__shelf {
    min-height: 300px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 834px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 576px) {
      grid-template-columns: 1fr;
    }
  }

  &__book {
    display: flex;
    flex-direction: column;
    border-radius: 14px;
    background: #FFFCF8;
    border: 1px solid #F0E6DC;
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 28px rgba(166, 124, 82, 0.1);
      border-color: #EBDCD0;
    }
  }

  &__book-cover {
    position: relative;
    height: 160px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    text-align: center;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%);
      pointer-events: none;
      z-index: 1;
    }
  }

  &__book-cover-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }

  &__book-cover-mask {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%);
    z-index: 1;
    pointer-events: none;
  }

  html.dark &__book-cover-mask {
    background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.55) 100%);
  }

  &__book-spine {
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;
    width: 4px;
    background: rgba(255, 255, 255, 0.35);
    border-radius: 2px;
    z-index: 2;
  }

  html.dark &__book-spine {
    background: rgba(255, 255, 255, 0.1);
  }

  &__book-title-on-cover {
    position: relative;
    margin: 0 0 0.4rem;
    font-size: 1.1rem;
    font-weight: 600;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    z-index: 2;
  }

  &__book-author-on-cover {
    position: relative;
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    z-index: 2;
  }

  &__book-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }

  &__book-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  &__book-tag {
    border-color: #F0E6DC;
    color: #8C7B70;
    background: transparent;
  }

  &__book-rating {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: #E8A87C;
  }

  &__star {
    display: inline-block;
    width: 14px;
    height: 14px;
    background: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%23E8A87C%22><path d=%22M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z%22/></svg>') center/contain no-repeat;
  }

  &__book-desc {
    flex: 1;
    margin: 0 0 0.75rem;
    font-size: 0.85rem;
    line-height: 1.6;
    color: #8C7B70;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__book-actions {
    display: flex;
    justify-content: flex-end;
  }

  &__read-btn {
    padding: 0.45rem 1.1rem;
    font-size: 0.85rem;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;
    background: linear-gradient(135deg, #E8A87C 0%, #D4A574 100%);
    color: #fff;

    &:hover {
      background: linear-gradient(135deg, #D4956A 0%, #C49A6A 100%);
      box-shadow: 0 4px 12px rgba(232, 168, 124, 0.3);
    }

    &--read {
      background: transparent;
      border-color: #E0D5CC;
      color: #8C7B70;

      &:hover {
        border-color: #E8A87C;
        color: #E8A87C;
      }
    }
  }

  html.dark &__read-btn {
    background: rgba(202, 168, 74, 0.14);
    border: 1px solid rgba(202, 168, 74, 0.45);
    color: #D4B86A;
    backdrop-filter: blur(2px);

    &:hover {
      background: rgba(202, 168, 74, 0.22);
      border-color: rgba(202, 168, 74, 0.7);
      color: #E8CC80;
    }

    &--read {
      background: transparent;
      border-color: rgba(255, 255, 255, 0.12);
      color: #888;
      backdrop-filter: none;

      &:hover {
        background: rgba(255, 255, 255, 0.04);
        border-color: rgba(255, 255, 255, 0.22);
        color: #aaa;
      }
    }
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 260px;
    color: #B89A88;
    font-size: 0.95rem;
  }

  &__footer {
    display: flex;
    justify-content: center;
    padding-top: 1.5rem;
  }

  &__pagination {
    :deep(.el-pagination__total),
    :deep(.el-pagination__sizes) {
      color: #8C7B70;
    }

    :deep(.el-pager li) {
      background: #FFFCF8;
      border: 1px solid #F0E6DC;
      color: #5C4F4A;

      &.is-active {
        background: #E8A87C;
        border-color: #E8A87C;
        color: #fff;
      }

      &:hover {
        color: #E8A87C;

        &.is-active {
          color: #fff;
        }
      }
    }

    :deep(.btn-prev),
    :deep(.btn-next) {
      background: #FFFCF8;
      border: 1px solid #F0E6DC;
      color: #5C4F4A;

      &:hover {
        color: #E8A87C;
      }
    }
  }

  /* ==================== 暗黑模式适配 ==================== */
  html.dark & {
    &__search-input {
      :deep(.el-input__wrapper) {
        background: #1F1F21;
        box-shadow: 0 0 0 1px #2F2C26 inset;

        &.is-focus {
          box-shadow: 0 0 0 1px #caa84a inset;
        }
      }

      :deep(.el-input__inner) {
        color: #c5c4c4;

        &::placeholder {
          color: #8a8070;
        }
      }
    }

    &__cat-btn {
      color: #9a958c;
      background: transparent;
      border-color: rgba(255, 255, 255, 0.1);

      &:hover {
        color: #caa84a;
        border-color: rgba(202, 168, 74, 0.35);
      }

      &--active {
        background: rgba(202, 168, 74, 0.1);
        border-color: rgba(202, 168, 74, 0.45);
        color: #caa84a;
        box-shadow: none;
      }
    }

    &__book {
      background: rgba(30, 30, 32, 0.6);
      border-color: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(8px);

      &:hover {
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
        border-color: rgba(255, 255, 255, 0.14);
      }
    }

    &__book-tag {
      border-color: rgba(255, 255, 255, 0.1);
      color: #9a958c;
    }

    &__book-title-on-cover {
      text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
    }

    &__book-author-on-cover {
      color: rgba(255, 255, 255, 0.75);
    }

    &__book-desc {
      color: #9a958c;
    }

    &__empty {
      color: #8a8070;
    }

    &__pagination {
      :deep(.el-pagination__total),
      :deep(.el-pagination__sizes) {
        color: #9a958c;
      }

      :deep(.el-pager li) {
        background: #1F1F21;
        border-color: #2F2C26;
        color: #c5c4c4;

        &.is-active {
          background: #6B5640;
          border-color: #6B5640;
          color: #E8DCC8;
        }

        &:hover {
          color: #caa84a;

          &.is-active {
            color: #1F1F21;
          }
        }
      }

      :deep(.btn-prev),
      :deep(.btn-next) {
        background: #1F1F21;
        border-color: #2F2C26;
        color: #c5c4c4;

        &:hover {
          color: #caa84a;
        }
      }
    }
  }
}
</style>
