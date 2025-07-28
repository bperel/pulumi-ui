<template>
  <div class="flex items-center justify-center h-full bg-gray-50">
    <div class="text-center">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Pulumi UI
        </h1>
        <p class="text-xl text-gray-600">
          Visualize your self-hosted Pulumi state
        </p>
      </div>
      
      <div class="space-y-4">
        <p class="text-gray-500">
          Select a project and stack from the sidebar to get started
        </p>
        
        <div class="flex justify-center space-x-4">
          <UButton
            icon="i-heroicons-folder"
            @click="handleToggleProjects"
          >
            Browse Projects
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { toggleProjectsDrawer } = useNuxtApp()
const handleToggleProjects = () => {
  (toggleProjectsDrawer as (() => void) | undefined)?.()
}
</script> 