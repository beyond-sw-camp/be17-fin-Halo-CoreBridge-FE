import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore(
  'sidebar',
  () => {
    const currentPath = ref('')

    const setPath = (path: string) => {
      currentPath.value = path
    }

    const restorePath = () => {}

    return { currentPath, setPath, restorePath }
  },
  {
    persist: true,
  },
)
