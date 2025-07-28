<template>
  <div class="h-screen flex">
    <NavBar 
      :main-drawer-open="mainDrawerOpen"
      @toggle-main-drawer="toggleMainDrawer"
      @toggle-projects-drawer="toggleProjectsDrawer"
      :projects-drawer-open="projectsDrawerOpen"
    />
    
    <StackExplorerBar
      :projects="projects"
      :selected-stack="selectedStack"
      :projects-drawer-open="projectsDrawerOpen"
      :main-drawer-open="mainDrawerOpen"
      :expanded-projects="expandedProjects"
      @toggle-project-expansion="toggleProjectExpansion"
      @fetch-stack="fetchStack"
    />
    
    <main class="flex-1 h-full overflow-hidden">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Project, Stack } from '~/types'

const mainDrawerOpen = ref(false)
const projectsDrawerOpen = ref(false)
const projects = ref<Project[]>([])
const selectedStack = ref<Stack | null>(null)
const expandedProjects = ref<Set<string>>(new Set())

const toggleMainDrawer = () => {
  mainDrawerOpen.value = !mainDrawerOpen.value
}

const toggleProjectsDrawer = () => {
  projectsDrawerOpen.value = !projectsDrawerOpen.value
}

const toggleProjectExpansion = (projectName: string) => {
  const newSet = new Set(expandedProjects.value)
  if (newSet.has(projectName)) {
    newSet.delete(projectName)
  } else {
    newSet.add(projectName)
  }
  expandedProjects.value = newSet
}

const fetchStack = async (projectName: string, stackName: string) => {
  try {
    console.log('Fetching stack:', projectName, stackName)
    const data = await $fetch(`/api/projects/${projectName}/stacks/${stackName}`)
    console.log('Stack data received:', data)
    selectedStack.value = data
  } catch (error) {
    console.error('Error fetching stack:', error)
  }
}

const fetchProjects = async () => {
  try {
    const data = await $fetch('/api/projects')
    projects.value = data
  } catch (error) {
    console.error('Error fetching projects:', error)
  }
}

const route = useRoute()

onMounted(() => {
  fetchProjects()
})

watch(() => route.params, async (newParams) => {
  console.log('Route params changed:', newParams)
  if (newParams.projectName && newParams.stackName) {
    console.log('Fetching stack for params:', newParams.projectName, newParams.stackName)
    await fetchStack(newParams.projectName as string, newParams.stackName as string)
  }
}, { immediate: true })

provide('mainDrawerOpen', mainDrawerOpen)
provide('projectsDrawerOpen', projectsDrawerOpen)
provide('projects', projects)
provide('selectedStack', selectedStack)
provide('stackData', selectedStack)
provide('expandedProjects', expandedProjects)
provide('toggleMainDrawer', toggleMainDrawer)
provide('toggleProjectsDrawer', toggleProjectsDrawer)
provide('toggleProjectExpansion', toggleProjectExpansion)
provide('fetchStack', fetchStack)

const reactiveStack = computed(() => selectedStack.value)
provide('reactiveStack', reactiveStack)
</script> 