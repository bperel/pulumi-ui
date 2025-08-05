<template>
  <div class="w-full h-screen flex">
    <NavBar 
      v-model:open="projectsDrawerOpen"
    />
    
    <StackExplorerBar
      :stacks="stacks"
      :open="projectsDrawerOpen"
      v-model:expanded-project="expandedProject"
    />
    
    <main class="flex-1 h-full overflow-hidden">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const projectsDrawerOpen = ref(false)
const expandedProject = ref<string>()

const route = useRoute()

const { projects, stacks, currentProjectName, currentStackName } = storeToRefs(usePulumiStore())
const { fetchProjects, fetchStacks, fetchStackResources } = usePulumiStore()

onMounted(() => {
  fetchProjects()
})

watch([projects, () => route.params.projectName], () => {
  projectsDrawerOpen.value = true
  if (route.params.projectName) {
    expandedProject.value = route.params.projectName as string
  }
})

watch(expandedProject, () => {
  if (expandedProject.value) {
    currentProjectName.value = projects.value.find(project => project.name === expandedProject.value)?.name
    if (!currentProjectName.value) {
      window.alert('Project not found')
    }
    else {
      fetchStacks()
    }
  }
})

watch([stacks, () => route.params.stackName], () => {
  if (route.params.stackName) {
    currentStackName.value = stacks.value.find(stack => stack.name === route.params.stackName)?.name
    if (!currentStackName.value) {
      window.alert('Stack not found')
    }
    else {
      fetchStackResources()
    }
  }
})
</script> 