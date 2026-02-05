import { useDark, useToggle } from '@vueuse/core'


const isDark = useDark({
  storageKey: 'theme',
  valueLight: 'light',
})
const toggleDark = useToggle(isDark)

export function useGlobalTheme() {
  return {
    isDark,
    toggleDark,
  }
}