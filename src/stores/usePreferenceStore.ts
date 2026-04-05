import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export type FontSize = 'small' | 'medium' | 'large';

interface Preferences {
  fontSize: FontSize;
  compactMode: boolean;
  soundEffects: boolean;
  autoSave: boolean;
  desktopNotification: boolean;
  weeklyReport: boolean;
  updateReminder: boolean;
}

const STORAGE_KEY = 'user_preferences';

const defaultPreferences: Preferences = {
  fontSize: 'medium',
  compactMode: false,
  soundEffects: false,
  autoSave: true,
  desktopNotification: true,
  weeklyReport: true,
  updateReminder: false,
};

export const usePreferenceStore = defineStore('preference', () => {
  // State
  const fontSize = ref<FontSize>('medium');
  const compactMode = ref(false);
  const soundEffects = ref(false);
  const autoSave = ref(true);
  const desktopNotification = ref(true);
  const weeklyReport = ref(true);
  const updateReminder = ref(false);

  // Getters
  const rootFontSize = computed(() => {
    const map: Record<FontSize, string> = {
      small: '14px',
      medium: '15px',
      large: '17px',
    };
    return map[fontSize.value];
  });

  const isCompact = computed(() => compactMode.value);

  // Actions
  const loadPreferences = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Partial<Preferences> = JSON.parse(saved);
        fontSize.value = parsed.fontSize ?? defaultPreferences.fontSize;
        compactMode.value = parsed.compactMode ?? defaultPreferences.compactMode;
        soundEffects.value = parsed.soundEffects ?? defaultPreferences.soundEffects;
        autoSave.value = parsed.autoSave ?? defaultPreferences.autoSave;
        desktopNotification.value = parsed.desktopNotification ?? defaultPreferences.desktopNotification;
        weeklyReport.value = parsed.weeklyReport ?? defaultPreferences.weeklyReport;
        updateReminder.value = parsed.updateReminder ?? defaultPreferences.updateReminder;
      }
    } catch {
      // 解析失败时使用默认值
    }
  };

  const savePreferences = () => {
    const prefs: Preferences = {
      fontSize: fontSize.value,
      compactMode: compactMode.value,
      soundEffects: soundEffects.value,
      autoSave: autoSave.value,
      desktopNotification: desktopNotification.value,
      weeklyReport: weeklyReport.value,
      updateReminder: updateReminder.value,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  };

  const resetPreferences = () => {
    fontSize.value = defaultPreferences.fontSize;
    compactMode.value = defaultPreferences.compactMode;
    soundEffects.value = defaultPreferences.soundEffects;
    autoSave.value = defaultPreferences.autoSave;
    desktopNotification.value = defaultPreferences.desktopNotification;
    weeklyReport.value = defaultPreferences.weeklyReport;
    updateReminder.value = defaultPreferences.updateReminder;
    savePreferences();
  };

  // 自动保存到 localStorage
  watch(
    [
      fontSize,
      compactMode,
      soundEffects,
      autoSave,
      desktopNotification,
      weeklyReport,
      updateReminder,
    ],
    savePreferences,
    { deep: true }
  );

  // 应用字体大小到根元素
  const applyFontSize = () => {
    document.documentElement.style.fontSize = rootFontSize.value;
  };

  // 应用紧凑模式
  const applyCompactMode = () => {
    if (compactMode.value) {
      document.documentElement.classList.add('compact-mode');
    } else {
      document.documentElement.classList.remove('compact-mode');
    }
  };

  // 初始化
  const init = () => {
    loadPreferences();
    applyFontSize();
    applyCompactMode();
  };

  return {
    // state
    fontSize,
    compactMode,
    soundEffects,
    autoSave,
    desktopNotification,
    weeklyReport,
    updateReminder,
    // getters
    rootFontSize,
    isCompact,
    // actions
    loadPreferences,
    savePreferences,
    resetPreferences,
    applyFontSize,
    applyCompactMode,
    init,
  };
});
