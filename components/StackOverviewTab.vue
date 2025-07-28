<template>
  <div v-if="stack" class="space-y-6">
    <!-- Stack Summary -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Stack Summary</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-cube" class="w-5 h-5 text-blue-600" />
            <span class="font-medium text-gray-900">Resources</span>
          </div>
          <p class="text-2xl font-bold text-gray-900 mt-2">{{ stack.resources.length }}</p>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-green-600" />
            <span class="font-medium text-gray-900">Outputs</span>
          </div>
          <p class="text-2xl font-bold text-gray-900 mt-2">{{ Object.keys(stack.outputs).length }}</p>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-folder" class="w-5 h-5 text-purple-600" />
            <span class="font-medium text-gray-900">Project</span>
          </div>
          <p class="text-lg font-semibold text-gray-900 mt-2">{{ stack.project }}</p>
        </div>
      </div>
    </div>
    
    <!-- Resource Types -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Resource Types</h3>
      
      <div v-if="resourceTypes.length === 0" class="text-gray-500 text-center py-4">
        No resources found
      </div>
      
      <div v-else class="space-y-2">
        <div 
          v-for="type in resourceTypes" 
          :key="type.name"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <UIcon name="i-heroicons-cube" class="w-4 h-4 text-blue-600" />
            <span class="font-medium text-gray-900">{{ type.name }}</span>
          </div>
          <span class="text-sm text-gray-500">{{ type.count }} resources</span>
        </div>
      </div>
    </div>
    
    <!-- Outputs -->
    <div v-if="Object.keys(stack.outputs).length > 0" class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Outputs</h3>
      
      <div class="space-y-3">
        <div 
          v-for="(value, key) in stack.outputs" 
          :key="key"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium text-gray-900">{{ key }}</span>
            <span class="text-sm text-gray-500">{{ typeof value }}</span>
          </div>
          <pre class="text-sm text-gray-700 bg-gray-50 p-2 rounded overflow-x-auto">{{ JSON.stringify(value, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="text-center text-gray-500 py-8">
    <UIcon name="i-heroicons-cube" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
    <p>No stack selected</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Stack } from '~/types'

interface Props {
  stack: Stack | null
}

const props = withDefaults(defineProps<Props>(), {
  stack: null
})

const resourceTypes = computed(() => {
  if (!props.stack) return []
  
  const typeCounts = props.stack.resources.reduce((acc, resource) => {
    acc[resource.type] = (acc[resource.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(typeCounts).map(([name, count]) => ({
    name,
    count
  })).sort((a, b) => b.count - a.count)
})
</script> 