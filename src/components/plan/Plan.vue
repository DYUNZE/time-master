<script setup lang="ts">
import { ref, computed } from 'vue'
import { Solar } from 'lunar-javascript'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import CalendarIcon from '@/components/icons/IconCalendar.vue'

// ==================== 类型 ====================
interface PlanItem {
  id: string
  content: string
  completed: boolean
}

interface DayPlans {
  [dateStr: string]: PlanItem[]
}

// ==================== 日历 ====================
const controllerType = ref<'select' | 'button'>('button')
const selectedDate = ref(new Date())

const formatDate = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const getDateInfo = (date: Date) => {
  const solar = Solar.fromDate(date)
  const lunar = solar.getLunar()
  return {
    lunarDay: lunar.getDayInChinese(),
    festival: lunar.getFestivals().join(''),
    jieQi: lunar.getJieQi(),
  }
}

// ==================== 计划数据 ====================
const dayPlans = ref<DayPlans>({
  [formatDate(new Date())]: [
    { id: '1', content: '完成 Vue 组件设计', completed: false },
  ],
})

const getDayPlanCount = (dateStr: string) => {
  return (dayPlans.value[dateStr] || []).filter((i) => !i.completed).length
}

// ==================== 弹窗编辑 ====================
const dialogVisible = ref(false)
const editingDateStr = ref('')
const editingPlans = ref<PlanItem[]>([])
const inputRef = ref<HTMLInputElement | null>(null)

const openDayDialog = (date: Date) => {
  const str = formatDate(date)
  editingDateStr.value = str
  editingPlans.value = JSON.parse(JSON.stringify(dayPlans.value[str] || []))
  dialogVisible.value = true
}

const saveDayPlans = () => {
  // 过滤空内容
  editingPlans.value = editingPlans.value.filter((p) => p.content.trim() !== '')
  if (editingPlans.value.length) {
    dayPlans.value[editingDateStr.value] = editingPlans.value
  } else {
    delete dayPlans.value[editingDateStr.value]
  }
  dialogVisible.value = false
}

const addPlanItem = () => {
  editingPlans.value.push({
    id: Math.random().toString(36).slice(2, 9),
    content: '',
    completed: false,
  })
  // 自动聚焦最后一个输入框
  setTimeout(() => {
    const inputs = document.querySelectorAll('.plan-dialog__input')
    const last = inputs[inputs.length - 1] as HTMLInputElement | undefined
    last?.focus()
  }, 0)
}

const removePlanItem = (idx: number) => {
  editingPlans.value.splice(idx, 1)
}

// ==================== 最近计划 ====================
const upcomingPlans = computed(() => {
  const list: { date: string; item: PlanItem }[] = []
  const todayStr = formatDate(new Date())
  Object.entries(dayPlans.value).forEach(([date, items]) => {
    items.forEach((item) => {
      if (!item.completed && date >= todayStr) {
        list.push({ date, item })
      }
    })
  })
  list.sort((a, b) => a.date.localeCompare(b.date))
  return list.slice(0, 5)
})
</script>

<template>
  <div class="plan-component">
    <el-config-provider :locale="zhCn">
      <el-calendar :controller-type="controllerType" v-model="selectedDate">
        <template #date-cell="{ data }">
          <div
            class="plan-component__cell"
            :class="{ 'plan-component__cell--selected': data.isSelected }"
            @click="openDayDialog(data.date)"
          >
            <span
              class="plan-component__day"
              :class="{ 'is-selected': data.isSelected }"
            >
              {{ data.day.split('-').slice(2).join('-') }}
            </span>
            <span class="plan-component__lunar">
              {{ getDateInfo(data.date).festival
                 || getDateInfo(data.date).jieQi
                 || getDateInfo(data.date).lunarDay }}
            </span>
            <span
              v-if="getDayPlanCount(data.day) > 0"
              class="plan-component__dot"
            >
              {{ getDayPlanCount(data.day) }}
            </span>
          </div>
        </template>
      </el-calendar>
    </el-config-provider>

    <!-- 最近计划 -->
    <section class="plan-component__upcoming">
      <h3 class="plan-component__upcoming-title">
        <CalendarIcon class="plan-component__upcoming-icon" />
        近期计划
      </h3>
      <TransitionGroup
        v-if="upcomingPlans.length"
        name="upcoming"
        tag="ul"
        class="plan-component__upcoming-list"
      >
        <li
          v-for="plan in upcomingPlans"
          :key="plan.item.id + plan.date"
          class="plan-component__upcoming-item"
          @click="openDayDialog(new Date(plan.date))"
        >
          <span class="plan-component__upcoming-date">{{ plan.date.slice(5) }}</span>
          <span class="plan-component__upcoming-content">{{ plan.item.content }}</span>
        </li>
      </TransitionGroup>
      <p v-else class="plan-component__upcoming-empty">暂无近期计划，点击日历上的日期开始安排吧 ~</p>
    </section>

    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="`${editingDateStr} 的计划`"
      width="420px"
      class="plan-dialog"
      align-center
      @close="saveDayPlans"
    >
      <TransitionGroup name="plan-item" tag="div" class="plan-dialog__list">
        <div
          v-for="(plan, idx) in editingPlans"
          :key="plan.id"
          class="plan-dialog__item"
          :class="{ 'plan-dialog__item--done': plan.completed }"
        >
          <span
            class="plan-dialog__check"
            :class="{ 'plan-dialog__check--checked': plan.completed }"
            @click="plan.completed = !plan.completed"
          />
          <input
            v-model="plan.content"
            class="plan-dialog__input"
            placeholder="写下你的计划..."
            @keyup.enter="addPlanItem"
          />
          <span class="plan-dialog__remove" @click="removePlanItem(idx)">×</span>
        </div>
        <p v-if="!editingPlans.length" key="empty" class="plan-dialog__empty">
          暂无计划，点击下方按钮添加
        </p>
      </TransitionGroup>
      <template #footer>
        <div class="plan-dialog__footer">
          <el-button type="primary" class="plan-dialog__add" @click="addPlanItem">
            + 添加计划
          </el-button>
          <el-button @click="saveDayPlans">完成</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.plan-component {
  :deep(.el-calendar) {
    background: transparent;
    --el-calendar-selected-bg-color: transparent;
  }

  :deep(.el-calendar__header) {
    border-bottom: 1px solid #F0E6DC;
    padding-bottom: 1rem;
  }

  :deep(.el-calendar__body) {
    padding: 0.75rem 0 1.5rem;
  }

  :deep(.el-calendar-table) {
    td {
      border-color: #F0E6DC;
    }

    tr:first-child td {
      border-top: none;
    }

    tr td:first-child {
      border-left: none;
    }

    tr td:last-child {
      border-right: none;
    }

    tr:last-child td {
      border-bottom: none;
    }

    .el-calendar-day {
      height: 80px;
      padding: 4px;

      @media (max-width: 768px) {
        height: 64px;
        padding: 2px;
      }
    }
  }

  &__cell {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--hover-btn-bg-color);
    }

    &--selected {
      background-color: var(--active-btn-bg-color);
    }
  }

  &__day {
    font-size: 1rem;
    font-weight: 500;
    color: #5C4F4A;

    &.is-selected {
      color: #E8A87C;
      font-weight: 600;
    }
  }

  &__lunar {
    margin-top: 0.25rem;
    font-size: 0.7rem;
    color: #8C7B70;
    text-align: center;
    line-height: 1.2;
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__dot {
    position: absolute;
    top: 4px;
    right: 4px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    font-size: 0.65rem;
    font-weight: 600;
    color: #fff;
    background: #E8A87C;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__upcoming {
    margin-top: 1rem;
    padding: 1.25rem;
    background: #FFFCF8;
    border: 1px solid #F0E6DC;
    border-radius: 12px;
  }

  &__upcoming-title {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin: 0 0 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    color: #5C4F4A;
  }

  &__upcoming-icon {
    width: 18px;
    height: 18px;
    color: #E8A87C;
  }

  &__upcoming-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__upcoming-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 0.8rem;
    border-radius: 8px;
    background: #fff;
    border: 1px solid #F0E6DC;
    cursor: pointer;
    transition: background-color 0.2s ease, border-color 0.2s ease;

    &:hover {
      background-color: #FFF5ED;
      border-color: #EBDCD0;
    }
  }

  &__upcoming-date {
    flex-shrink: 0;
    padding: 0.2rem 0.5rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: #E8A87C;
    background: rgba(#E8A87C, 0.12);
    border-radius: 6px;
  }

  &__upcoming-content {
    font-size: 0.95rem;
    color: #5C4F4A;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__upcoming-empty {
    margin: 0;
    font-size: 0.9rem;
    color: #aaa;
    text-align: center;
    padding: 0.5rem 0;
  }
}

.plan-dialog {
  &__list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    max-height: 320px;
    overflow-y: auto;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: opacity 0.2s ease;

    &--done {
      opacity: 0.6;

      .plan-dialog__input {
        text-decoration: line-through;
        color: #aaa;
      }
    }
  }

  &__check {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid #E0D8D0;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
      border-color: #E8A87C;
    }

    &--checked {
      background: #E8A87C;
      border-color: #E8A87C;

      &::after {
        content: '';
        position: absolute;
        left: 5px;
        top: 2px;
        width: 4px;
        height: 8px;
        border: solid #fff;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
    }
  }

  &__input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    font-size: 0.95rem;
    border: 1px solid #E0D8D0;
    border-radius: 8px;
    outline: none;
    background: #fff;
    color: #5C4F4A;
    transition: color 0.2s ease, border-color 0.2s ease;

    &:focus {
      border-color: #E8A87C;
    }
  }

  &__remove {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    color: #aaa;
    cursor: pointer;
    border-radius: 50%;
    flex-shrink: 0;
    transition: color 0.2s ease, background-color 0.2s ease;

    &:hover {
      color: #E74C3C;
      background: rgba(#E74C3C, 0.08);
    }
  }

  &__empty {
    margin: 0;
    font-size: 0.9rem;
    color: #aaa;
    text-align: center;
    padding: 1rem 0;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  &__add {
    --el-button-bg-color: #E8A87C;
    --el-button-border-color: #E8A87C;
    --el-button-hover-bg-color: #D4956A;
    --el-button-hover-border-color: #D4956A;
  }
}

/* ==================== 暗黑模式 ==================== */
html.dark {
  .plan-component {
    :deep(.el-calendar__header) {
      border-bottom-color: #2F2C26;
    }

    :deep(.el-calendar-table) {
      td {
        border-color: #2F2C26;
      }

      .el-calendar-day:hover {
        color: inherit;
      }
    }

    &__cell:hover {
      background-color: #252525;
    }

    &__cell--selected {
      background-color: #252525;
    }

    &__day {
      color: #c5c4c4;

      &.is-selected {
        color: #caa84a;
      }
    }

    &__lunar {
      color: #9a958c;
    }

    &__dot {
      background: #caa84a;
      color: #1F1F21;
    }

    &__upcoming {
      background: #1F1F21;
      border-color: #2F2C26;
    }

    &__upcoming-title {
      color: #c5c4c4;
    }

    &__upcoming-icon {
      color: #caa84a;
    }

    &__upcoming-item {
      background: #161616;
      border-color: #2F2C26;

      &:hover {
        background-color: #252219;
        border-color: #3d362a;
      }
    }

    &__upcoming-date {
      color: #caa84a;
      background: rgba(#caa84a, 0.15);
    }

    &__upcoming-content {
      color: #c5c4c4;
    }

    &__upcoming-empty {
      color: #8a8070;
    }
  }

  .plan-dialog {
    &__input {
      background: #161616;
      border-color: #2F2C26;
      color: #c5c4c4;

      &:focus {
        border-color: #caa84a;
      }
    }

    &__add {
      --el-button-bg-color: #8F704A;
      --el-button-border-color: #8F704A;
      --el-button-hover-bg-color: #A08055;
      --el-button-hover-border-color: #A08055;
    }

    &__check {
      border-color: #2F2C26;

      &:hover {
        border-color: #caa84a;
      }

      &--checked {
        background: #caa84a;
        border-color: #caa84a;
      }
    }

    &__item--done .plan-dialog__input {
      color: #666;
    }
  }
}

/* ==================== 动画 ==================== */
.plan-item-enter-active,
.plan-item-leave-active {
  transition: all 0.3s ease;
}

.plan-item-enter-from,
.plan-item-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

.plan-item-leave-active {
  position: absolute;
}

.upcoming-enter-active,
.upcoming-leave-active {
  transition: all 0.3s ease;
}

.upcoming-enter-from,
.upcoming-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
