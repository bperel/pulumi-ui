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
        icon="i-heroicons-bars-3"
        :class="{ 'bg-blue-50 text-blue-600': mainDrawerOpen }"
        @click="$emit('toggle-main-drawer')"
      />
      
      <UButton
        variant="ghost"
        icon="i-heroicons-folder"
        :class="{ 'bg-blue-50 text-blue-600': projectsDrawerOpen }"
        @click="$emit('toggle-projects-drawer')"
      />
    </div>
    
    <!-- Bottom Section -->
    <div class="flex-shrink-0">
      <UButton
        variant="ghost"
        icon="i-heroicons-cog-6-tooth"
        @click="openSettings"
      />
    </div>
  </nav>
</template>

<script setup lang="ts">
interface Props {
  mainDrawerOpen: boolean
  projectsDrawerOpen: boolean
}

defineProps<Props>()

defineEmits<{
  'toggle-main-drawer': []
  'toggle-projects-drawer': []
}>()

const openSettings = () => {
  console.log('Open settings')
}
</script> 