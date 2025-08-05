import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', () => {
  // State
  const sidebarOpen = ref(true)
  const selectedResource = ref<string | null>(null)
  const viewMode = ref<'list' | 'graph'>('list')
  const theme = ref<'light' | 'dark'>('light')

  // Actions
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const setSidebarOpen = (open: boolean) => {
    sidebarOpen.value = open
  }

  const selectResource = (resourceUrn: string | null) => {
    selectedResource.value = resourceUrn
  }

  const setViewMode = (mode: 'list' | 'graph') => {
    viewMode.value = mode
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
  }

  return {
    // State
    sidebarOpen: readonly(sidebarOpen),
    selectedResource: readonly(selectedResource),
    viewMode: readonly(viewMode),
    theme: readonly(theme),
    
    // Actions
    toggleSidebar,
    setSidebarOpen,
    selectResource,
    setViewMode,
    toggleTheme,
    setTheme
  }
}) 