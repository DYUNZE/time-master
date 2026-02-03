<script setup lang='ts'>
import { ref } from 'vue'
import { Solar } from 'lunar-javascript'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const controllerType = ref<'select' | 'button'>('select')
const value = ref(new Date())


const getDateInfo = (date: Date) => {
    // 1. 将 Date 对象转为 Solar 对象
    const solar = Solar.fromDate(date)
    // 2. 转为 Lunar 对象，才能获取节气
    const lunar = solar.getLunar()
    return {
        lunarDay: lunar.getDayInChinese(),
        festival: lunar.getFestivals().join(''),
        jieQi: lunar.getJieQi(),
    }
}
</script>

<template>
    <div class="plan__box">
        <el-config-provider :locale="zhCn">
            <el-calendar :controller-type="controllerType" v-model="value">
                <template #date-cell="{ data }">
                    <div class="c__cell">
                        <p :class="data.isSelected ? 'is-selected' : ''">
                            {{ data.day.split('-').slice(2).join('-') }}
                        </p>
                        <p class="lunar-info">
                            <span class="lunar-day">{{ getDateInfo(data.date).lunarDay }}</span>
                            <span class="festival">{{ getDateInfo(data.date).festival }}</span>
                            <span class="jieqi">{{ getDateInfo(data.date).jieQi }}</span>
                        </p>
                    </div>
                </template>
            </el-calendar>
        </el-config-provider>
    </div>

</template>

<style scoped>
.c__cell {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.lunar-info {
    display: flex;
    font-size: .7rem;
    flex-direction: column;
    gap: .1rem;
}

@media (max-width: 576px) {}
</style>