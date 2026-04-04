<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { Search, ArrowLeft, Plus } from '@element-plus/icons-vue'

// ==================== 类型 ====================
interface Friend {
  id: string
  name: string
  avatar: string
  lastMessage: string
  lastTime: string
  unread: number
  online: boolean
}

interface Message {
  id: string
  friendId: string
  content: string
  isSelf: boolean
  timestamp: number
}

// ==================== 好友数据 ====================
const friends = ref<Friend[]>([
  {
    id: '1',
    name: 'Alice',
    avatar: 'https://picsum.photos/seed/alice/200',
    lastMessage: '周末一起去图书馆吗？',
    lastTime: '10:23',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Bob',
    avatar: 'https://picsum.photos/seed/bob/200',
    lastMessage: '好的，明晚见',
    lastTime: '昨天',
    unread: 0,
    online: false,
  },
  {
    id: '3',
    name: 'Carol',
    avatar: 'https://picsum.photos/seed/carol/200',
    lastMessage: 'Vue 3 的新特性确实很好用',
    lastTime: '昨天',
    unread: 0,
    online: true,
  },
  {
    id: '4',
    name: 'David',
    avatar: 'https://picsum.photos/seed/david/200',
    lastMessage: '项目进度怎么样了？',
    lastTime: '周一',
    unread: 1,
    online: false,
  },
])

// ==================== 消息数据 ====================
const allMessages = ref<Record<string, Message[]>>({
  '1': [
    { id: 'm1', friendId: '1', content: '最近在看什么书？', isSelf: false, timestamp: Date.now() - 3600000 * 2 },
    { id: 'm2', friendId: '1', content: '在看《深入浅出 Vue.js》，挺有收获的', isSelf: true, timestamp: Date.now() - 3600000 * 1.8 },
    { id: 'm3', friendId: '1', content: '周末一起去图书馆吗？', isSelf: false, timestamp: Date.now() - 3600000 * 0.5 },
  ],
  '2': [
    { id: 'm4', friendId: '2', content: '今晚有空一起吃饭吗？', isSelf: true, timestamp: Date.now() - 86400000 },
    { id: 'm5', friendId: '2', content: '好的，明晚见', isSelf: false, timestamp: Date.now() - 86400000 + 1800000 },
  ],
})

const activeFriendId = ref<string>('1')
const searchKeyword = ref('')
const inputContent = ref('')
const messageBoxRef = ref<HTMLDivElement | null>(null)
const showSidebarOnMobile = ref(true)
const addDialogVisible = ref(false)
const newFriendName = ref('')

const activeFriend = computed(() =>
  friends.value.find((f) => f.id === activeFriendId.value)
)

const filteredFriends = computed(() => {
  if (!searchKeyword.value.trim()) return friends.value
  const kw = searchKeyword.value.trim().toLowerCase()
  return friends.value.filter(
    (f) => f.name.toLowerCase().includes(kw) || f.lastMessage.toLowerCase().includes(kw)
  )
})

const currentMessages = computed(() => {
  return allMessages.value[activeFriendId.value] || []
})

const switchFriend = (id: string) => {
  activeFriendId.value = id
  const friend = friends.value.find((f) => f.id === id)
  if (friend) friend.unread = 0
  showSidebarOnMobile.value = false
}

const backToList = () => {
  showSidebarOnMobile.value = true
}

const openAddDialog = () => {
  newFriendName.value = ''
  addDialogVisible.value = true
}

const confirmAddFriend = () => {
  const name = newFriendName.value.trim()
  if (!name) return
  const id = Math.random().toString(36).slice(2, 9)
  const newFriend: Friend = {
    id,
    name,
    avatar: `https://picsum.photos/seed/${name.toLowerCase()}/200`,
    lastMessage: '你们已成为好友，开始聊天吧',
    lastTime: '刚刚',
    unread: 0,
    online: true,
  }
  friends.value.unshift(newFriend)
  allMessages.value[id] = []
  addDialogVisible.value = false
  switchFriend(id)
}

const sendMessage = () => {
  const text = inputContent.value.trim()
  if (!text || !activeFriendId.value) return
  const msg: Message = {
    id: Math.random().toString(36).slice(2, 9),
    friendId: activeFriendId.value,
    content: text,
    isSelf: true,
    timestamp: Date.now(),
  }
  const msgList = allMessages.value[activeFriendId.value] || []
  msgList.push(msg)
  allMessages.value[activeFriendId.value] = msgList

  const friend = friends.value.find((f) => f.id === activeFriendId.value)
  if (friend) {
    friend.lastMessage = text
    friend.lastTime = '刚刚'
  }

  inputContent.value = ''
  scrollToBottom()

  // 模拟对方回复
  setTimeout(() => {
    const reply: Message = {
      id: Math.random().toString(36).slice(2, 9),
      friendId: activeFriendId.value,
      content: '收到，我稍后回复你 ~',
      isSelf: false,
      timestamp: Date.now(),
    }
    const replyList = allMessages.value[activeFriendId.value] || []
    replyList.push(reply)
    allMessages.value[activeFriendId.value] = replyList
    if (friend) {
      friend.lastMessage = reply.content
      friend.unread = activeFriendId.value === friend.id && showSidebarOnMobile.value === false ? 0 : (friend.unread || 0) + 1
    }
    scrollToBottom()
  }, 1200)
}

const scrollToBottom = () => {
  nextTick(() => {
    const el = messageBoxRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

const formatTime = (ts: number) => {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

watch(currentMessages, scrollToBottom, { deep: true })
</script>

<template>
  <div class="chat-room">
    <!-- 左侧好友列表 -->
    <aside
      class="chat-room__sidebar"
      :class="{ 'chat-room__sidebar--hidden': !showSidebarOnMobile }"
    >
      <div class="chat-room__search">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索好友 / 消息"
          :prefix-icon="Search"
          clearable
          class="chat-room__search-input"
        />
        <button class="chat-room__add-btn" @click="openAddDialog">
          <Plus class="icon" />
        </button>
      </div>

      <div class="chat-room__friend-list">
        <div
          v-for="friend in filteredFriends"
          :key="friend.id"
          class="chat-room__friend"
          :class="{ 'chat-room__friend--active': activeFriendId === friend.id }"
          @click="switchFriend(friend.id)"
        >
          <div class="chat-room__avatar-wrap">
            <img :src="friend.avatar" :alt="friend.name" class="chat-room__avatar" />
            <span v-if="friend.online" class="chat-room__online-dot" />
          </div>
          <div class="chat-room__friend-info">
            <div class="chat-room__friend-header">
              <span class="chat-room__friend-name">{{ friend.name }}</span>
              <span class="chat-room__friend-time">{{ friend.lastTime }}</span>
            </div>
            <div class="chat-room__friend-preview">
              <span class="chat-room__last-msg">{{ friend.lastMessage }}</span>
              <span v-if="friend.unread > 0" class="chat-room__unread">{{ friend.unread }}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- 添加好友弹窗 -->
    <el-dialog
      v-model="addDialogVisible"
      title="添加好友"
      width="360px"
      align-center
      class="chat-room__add-dialog"
    >
      <div class="chat-room__add-form">
        <label class="chat-room__add-label">好友昵称</label>
        <input
          v-model="newFriendName"
          class="chat-room__add-input"
          placeholder="请输入昵称"
          @keyup.enter="confirmAddFriend"
        />
      </div>
      <template #footer>
        <div class="chat-room__add-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" class="chat-room__add-confirm" @click="confirmAddFriend">
            添加
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 右侧对话框 -->
    <main
      class="chat-room__main"
      :class="{ 'chat-room__main--hidden': showSidebarOnMobile }"
    >
      <!-- 顶部标题 -->
      <header class="chat-room__header">
        <ArrowLeft class="chat-room__back" @click="backToList" />
        <div v-if="activeFriend" class="chat-room__header-info">
          <img :src="activeFriend.avatar" class="chat-room__header-avatar" />
          <div>
            <h3 class="chat-room__header-name">{{ activeFriend.name }}</h3>
            <span class="chat-room__header-status">
              {{ activeFriend.online ? '在线' : '离线' }}
            </span>
          </div>
        </div>
      </header>

      <!-- 消息区 -->
      <div ref="messageBoxRef" class="chat-room__messages">
        <div
          v-for="msg in currentMessages"
          :key="msg.id"
          class="chat-room__message"
          :class="{ 'chat-room__message--self': msg.isSelf }"
        >
          <div class="chat-room__bubble">
            <p class="chat-room__text">{{ msg.content }}</p>
            <span class="chat-room__msg-time">{{ formatTime(msg.timestamp) }}</span>
          </div>
        </div>
        <p v-if="!currentMessages.length" class="chat-room__empty">暂无消息，打个招呼吧 ~</p>
      </div>

      <!-- 输入区 -->
      <footer class="chat-room__footer">
        <div class="chat-room__input-wrap">
          <input
            v-model="inputContent"
            class="chat-room__input"
            placeholder="输入消息..."
            @keyup.enter="sendMessage"
          />
          <button class="chat-room__send" :disabled="!inputContent.trim()" @click="sendMessage">
            发送
          </button>
        </div>
      </footer>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.chat-room {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid #F0E6DC;
  background: #FFFCF8;

  &__sidebar {
    width: 280px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #F0E6DC;
    background: #fff;
    border-radius: 14px 0 0 14px;

    @media (max-width: 768px) {
      width: 100%;
      border-right: none;
      border-radius: 14px;

      &--hidden {
        display: none;
      }
    }
  }

  &__search {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    border-bottom: 1px solid #F0E6DC;
  }

  &__search-input {
    flex: 1;

    :deep(.el-input__wrapper) {
      border-radius: 10px;
      background: #FFFCF8;
      box-shadow: 0 0 0 1px #F0E6DC inset;

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

  &__add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid #F0E6DC;
    border-radius: 10px;
    background: #FFFCF8;
    color: #8C7B70;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
      border-color: #E8A87C;
      color: #E8A87C;
      background: #fff;
    }

    .icon {
      width: 18px;
      height: 18px;
    }
  }

  &__friend-list {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
  }

  &__friend {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #FFF5ED;
    }

    &--active {
      background-color: #FFF5ED;
    }
  }

  &__avatar-wrap {
    position: relative;
    flex-shrink: 0;
  }

  &__avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
  }

  &__online-dot {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 10px;
    height: 10px;
    background: #67c23a;
    border: 2px solid #fff;
    border-radius: 50%;
  }

  &__friend-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  &__friend-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__friend-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: #5C4F4A;
  }

  &__friend-time {
    font-size: 0.75rem;
    color: #aaa;
  }

  &__friend-preview {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }

  &__last-msg {
    font-size: 0.85rem;
    color: #8C7B70;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__unread {
    flex-shrink: 0;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    font-size: 0.7rem;
    font-weight: 600;
    color: #fff;
    background: #E8A87C;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    background: #FFFCF8;
    border-radius: 0 14px 14px 0;

    @media (max-width: 768px) {
      border-radius: 14px;

      &--hidden {
        display: none;
      }
    }
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.9rem 1.25rem;
    border-bottom: 1px solid #F0E6DC;
    background: #fff;
    border-radius: 0 14px 0 0;

    @media (max-width: 768px) {
      border-radius: 14px 14px 0 0;
    }
  }

  &__back {
    display: none;
    width: 20px;
    height: 20px;
    color: #8C7B70;
    cursor: pointer;

    @media (max-width: 768px) {
      display: block;
    }
  }

  &__header-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__header-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
  }

  &__header-name {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #5C4F4A;
  }

  &__header-status {
    font-size: 0.75rem;
    color: #8C7B70;
  }

  &__messages {
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__message {
    display: flex;
    justify-content: flex-start;

    &--self {
      justify-content: flex-end;

      .chat-room__bubble {
        background: linear-gradient(135deg, #E8A87C 0%, #D4A574 100%);
        color: #fff;
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 14px;
      }

      .chat-room__msg-time {
        color: rgba(255, 255, 255, 0.85);
      }
    }
  }

  &__bubble {
    max-width: 70%;
    padding: 0.75rem 1rem;
    background: #fff;
    border: 1px solid #F0E6DC;
    border-radius: 14px;
    border-bottom-left-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
    transition: transform 0.15s ease;

    &:hover {
      transform: translateY(-1px);
    }
  }

  &__text {
    margin: 0 0 0.25rem;
    font-size: 0.95rem;
    line-height: 1.5;
    word-break: break-word;
  }

  &__msg-time {
    display: block;
    font-size: 0.7rem;
    color: #aaa;
    text-align: right;
  }

  &__empty {
    margin: auto;
    font-size: 0.9rem;
    color: #aaa;
  }

  &__footer {
    padding: 0.9rem 1.25rem;
    border-top: 1px solid #F0E6DC;
    background: #fff;
    border-radius: 0 0 14px 0;

    @media (max-width: 768px) {
      border-radius: 0 0 14px 14px;
    }

    @media (max-width: 576px) {
      padding-bottom: 1.25rem;
    }
  }

  &__input-wrap {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  &__input {
    flex: 1;
    padding: 0.7rem 1rem;
    font-size: 0.95rem;
    border: 1px solid #F0E6DC;
    border-radius: 10px;
    outline: none;
    background: #FFFCF8;
    color: #5C4F4A;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;

    &:focus {
      border-color: #E8A87C;
      box-shadow: 0 0 0 3px rgba(#E8A87C, 0.08);
    }
  }

  &__send {
    padding: 0.65rem 1.25rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, #E8A87C 0%, #D4A574 100%);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: opacity 0.2s ease, transform 0.15s ease;

    &:hover:not(:disabled) {
      opacity: 0.92;
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__add-dialog {
    border-radius: 12px;
  }

  &__add-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__add-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #5C4F4A;
  }

  &__add-input {
    padding: 0.6rem 0.9rem;
    font-size: 0.95rem;
    border: 1px solid #E0D8D0;
    border-radius: 8px;
    outline: none;
    background: #fff;
    color: #5C4F4A;

    &:focus {
      border-color: #E8A87C;
    }
  }

  &__add-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  &__add-confirm {
    --el-button-bg-color: #E8A87C;
    --el-button-border-color: #E8A87C;
    --el-button-hover-bg-color: #D4956A;
    --el-button-hover-border-color: #D4956A;
  }

  /* ==================== 暗黑模式 ==================== */
  html.dark & {
    border-color: #2F2C26;
    background: #1A1A1C;

    &__sidebar {
      border-right-color: #2F2C26;
      background: #1F1F21;
    }

    &__search {
      border-bottom-color: #2F2C26;
    }

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

    &__friend:hover,
    &__friend--active {
      background-color: #252219;
    }

    &__online-dot {
      border-color: #1F1F21;
    }

    &__friend-name {
      color: #c5c4c4;
    }

    &__last-msg {
      color: #9a958c;
    }

    &__unread {
      background: #caa84a;
      color: #1F1F21;
    }

    &__main {
      background: #1A1A1C;
    }

    &__header {
      background: #1F1F21;
      border-bottom-color: #2F2C26;
    }

    &__back {
      color: #9a958c;
    }

    &__header-name {
      color: #c5c4c4;
    }

    &__header-status {
      color: #9a958c;
    }

    &__message:not(&__message--self) .chat-room__bubble {
      background: #1F1F21;
      border-color: #2F2C26;
      color: #c5c4c4;
    }

    &__message--self .chat-room__bubble {
      background: linear-gradient(135deg, #8F704A 0%, #6B5640 100%);
    }

    &__msg-time {
      color: #888;
    }

    &__message--self &__msg-time {
      color: rgba(255, 255, 255, 0.8);
    }

    &__empty {
      color: #8a8070;
    }

    &__footer {
      background: #1F1F21;
      border-top-color: #2F2C26;
    }

    &__input {
      background: #161616;
      border-color: #2F2C26;
      color: #c5c4c4;

      &:focus {
        border-color: #caa84a;
        box-shadow: 0 0 0 3px rgba(#caa84a, 0.1);
      }
    }

    &__send {
      background: linear-gradient(135deg, #8F704A 0%, #6B5640 100%);
    }

    &__add-btn {
      border-color: #2F2C26;
      background: #1F1F21;
      color: #9a958c;

      &:hover {
        border-color: #caa84a;
        color: #caa84a;
        background: #252219;
      }
    }

    &__add-label {
      color: #c5c4c4;
    }

    &__add-input {
      background: #161616;
      border-color: #2F2C26;
      color: #c5c4c4;

      &:focus {
        border-color: #caa84a;
      }
    }

    &__add-confirm {
      --el-button-bg-color: #8F704A;
      --el-button-border-color: #8F704A;
      --el-button-hover-bg-color: #A08055;
      --el-button-hover-border-color: #A08055;
    }
  }
}
</style>
