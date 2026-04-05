<script setup lang='ts'>
import Sidebar from '@/components/Sidebar.vue';
import { computed } from 'vue';

// 勇气名言库
const quotes = [
  { text: '勇气不是没有恐惧，而是心怀恐惧仍然前行', author: '纳尔逊·曼德拉' },
  { text: '真正的勇气是知道你在输，但还是继续战斗', author: '拉斐尔·纳达尔' },
  { text: '勇敢不是不害怕，而是害怕的时候你还去坚持做', author: '斯嘉丽·约翰逊' },
  { text: '恐惧不会杀死人，但退缩会', author: '保罗·柯艾略' },
  { text: '勇气是压力下的优雅', author: '海明威' },
  { text: '唯一能阻挡你的是你自己的恐惧', author: '李小龙' },
  { text: '勇气是在绝望中仍然充满希望', author: '亚里士多德' },
  { text: '不要害怕你的生命会结束，而要害怕它从未开始', author: '格雷丝·汉森' },
  { text: '勇敢不是鲁莽，而是在恐惧面前依然选择正确', author: '柏拉图' },
  { text: '最黑暗的时刻，往往孕育着最大的勇气', author: '维克多·雨果' },
  { text: '勇气不是没有眼泪，而是含着眼泪依然奔跑', author: '佚名' },
  { text: '真正的勇士，敢于直面惨淡的人生', author: '鲁迅' },
  { text: '勇气是逆境中绽放的光芒', author: '温斯顿·丘吉尔' },
  { text: '不要被恐惧束缚，要成为恐惧的主人', author: '马克·吐温' },
  { text: '勇气是心灵的火种，即使在黑夜也不会熄灭', author: '荷马' },
  { text: '每一次勇敢的尝试，都是对自我的超越', author: '海伦·凯勒' },
  { text: '勇气是在看清生活的真相后依然热爱生活', author: '罗曼·罗兰' },
  { text: '不经历风雨，怎能见彩虹', author: '李宗盛' },
  { text: '勇气是灵魂的力量，让我们在困境中昂首挺胸', author: '塞涅卡' },
  { text: '即使前路漫漫，也要勇敢地迈出第一步', author: '老子' },
  { text: '勇气不是没有软弱，而是战胜软弱', author: '佛洛依德' },
  { text: '心中有光，何惧黑暗', author: '泰戈尔' },
  { text: '勇气是跌倒一百次，也要第一百零一次站起来', author: '拿破仑' },
  { text: '真正的勇气，是在绝望中依然相信希望', author: '马丁·路德·金' },
  { text: '勇敢的心，比任何武器都强大', author: '威廉·华莱士' },
  { text: '勇气是燃烧在胸中的火焰，照亮前行的路', author: '但丁' },
  { text: '不要因为害怕结束，就拒绝所有开始', author: '张小娴' },
  { text: '勇气是在无人喝彩时，依然为自己鼓掌', author: '尼采' },
  { text: '唯有勇气，能让我们在风雨中翩翩起舞', author: '纪伯伦' },
  { text: '勇气是面对深渊，依然选择纵身一跃', author: '加缪' },
  { text: '生命中最大的荣耀，不在于从不跌倒，而在于每次跌倒后都能站起来', author: '纳尔逊·曼德拉' },
];

// 根据日期获取今日名言索引
const todayIndex = computed(() => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return dayOfYear % quotes.length;
});

// 安全获取今日名言
const todayQuote = computed(() => quotes[todayIndex.value]);
</script>

<template>
    <div class="home-layout">
        <Sidebar />
        <div class="home-content">
            <div class="ad__bar">
                <div class="quote__container">
                    <span class="quote__mark">"</span>
                    <span class="quote__text">{{ todayQuote?.text }}</span>
                    <span class="quote__mark">"</span>
                    <span class="quote__author">—— {{ todayQuote?.author }}</span>
                </div>
            </div>
            <el-scrollbar>
                <div class="real__content">
                    <router-view v-slot="{ Component }">
                        <transition name="fade" mode="out-in">
                            <!-- 只取/home后面的第一级路径,孙路由变化完全不影响 -->
                            <component :is="Component" :key="$route.matched[1]?.path || $route.path" />
                        </transition>
                    </router-view>
                </div>

            </el-scrollbar>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.fade-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.fade-enter-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

/* ------------------ */
.home-layout {
    display: flex;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
}

.home-content {
    background: var(--home-content-bg-color);
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: .7rem 0;
    flex: 1;
    min-width: 0; /* 防止 flex 子项溢出 */

    .real__content {
        margin: 0 3rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;

        > * {
            flex: 1;
            min-height: 0;
        }
    }
    
    /* el-scrollbar 占满剩余空间 */
    :deep(.el-scrollbar) {
        flex: 1;
        overflow: hidden;
    }
    :deep(.el-scrollbar__wrap) {
        height: 100%;
    }
    :deep(.el-scrollbar__view) {
        height: 100%;
    }
}

/* ------------------ */
.ad__bar {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 56px;
    margin-bottom: 0.75rem;
    overflow: hidden;
    box-shadow: 0 1px 0 0 rgba(166, 124, 82, 0.08), 0 4px 12px rgba(166, 124, 82, 0.04);
    z-index: 1;
    background: linear-gradient(135deg, rgba(232, 168, 124, 0.08) 0%, rgba(212, 149, 106, 0.05) 100%);
    border-radius: 0 0 12px 12px;

    html.dark & {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
        box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 4px 12px rgba(0, 0, 0, 0.2);
    }
}

/* 每日名言样式 */
.quote__container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0 1.5rem;
    animation: fadeInQuote 0.8s ease-out;
}

@keyframes fadeInQuote {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.quote__mark {
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: 1.5rem;
    color: #d4956a;
    opacity: 0.6;
    line-height: 1;
    font-style: italic;

    html.dark & {
        color: rgba(255, 255, 255, 0.4);
    }
}

.quote__text {
    font-family: 'PingFang SC', 'Microsoft YaHei', 'Noto Serif SC', serif;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--color-text);
    letter-spacing: 0.05em;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    background: linear-gradient(135deg, var(--color-text) 0%, #8b7355 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    html.dark & {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(200, 180, 160, 0.8) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
}

.quote__author {
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    font-size: 0.75rem;
    color: var(--color-text);
    opacity: 0.5;
    margin-left: 0.5rem;
    font-style: italic;
    white-space: nowrap;
}

@media (max-width: 576px) {
    .home-content {
        padding-bottom: var(--bottom-menu-height);

        .real__content {
            margin: 0 1.2rem;
        }
    }

    .quote__container {
        padding: 0 0.75rem;
        flex-wrap: wrap;
        justify-content: center;
    }

    .quote__text {
        font-size: 0.8rem;
        text-align: center;
    }

    .quote__author {
        font-size: 0.7rem;
        margin-left: 0;
        margin-top: 0.25rem;
    }

    .quote__mark {
        font-size: 1.2rem;
    }
}
</style>