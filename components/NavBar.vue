<template>
  <nav class="bg-white border-r border-gray-200 w-16 flex flex-col items-center py-4 space-y-4">
    <div class="flex-shrink-0">
      <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
        <UIcon name="i-heroicons-cube" class="text-white w-6 h-6" />
      </div>
    </div>
    
    <div class="flex-1 flex flex-col space-y-2">
      
      <UButton
        variant="ghost"
        icon="i-heroicons-folder"
        :class="{ 'bg-blue-50 text-blue-600': projectsDrawerOpen }"
        @click="projectsDrawerOpen = !projectsDrawerOpen"
      />
    </div>
  </nav>
</template>

<script setup lang="ts">
const projectsDrawerOpen = defineModel<boolean>('open')
</script> 