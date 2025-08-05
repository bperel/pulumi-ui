<template>
  <div v-if="stack" class="space-y-6">
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Resources</h3>
        <div class="flex space-x-2">
          <UButton
            variant="outline"
            size="sm"
            @click="viewMode = 'list'"
            :class="{ 'bg-blue-50': viewMode === 'list' }"
          >
            <UIcon name="i-heroicons-list-bullet" class="w-4 h-4" />
            List
          </UButton>
          <UButton
            variant="outline"
            size="sm"
            @click="viewMode = 'graph'"
            :class="{ 'bg-blue-50': viewMode === 'graph' }"
          >
            <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4" />
            Graph
          </UButton>
        </div>
      </div>
      
      <div v-if="viewMode === 'list'">
        <ResourceList 
          :stack="stack" 
        />
      </div>
      
      <div v-else-if="viewMode === 'graph'" class="h-[700px]">
        <ResourceGraph 
          :stack="stack" 
        />
      </div>
    </div>
  </div>
  
  <div v-else class="text-center text-gray-500 py-8">
    <UIcon name="i-heroicons-cube" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
    <p>No stack selected</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Stack, Resource } from '~/types'
import ResourceList from './ResourceList.vue'
import ResourceGraph from './ResourceGraph.vue'

const {stack} = defineProps<{
  stack: Stack | null
}>();

const viewMode = ref<'list' | 'graph'>('list')

</script>

<style scoped>
.vue-flow {
  background-color: #f9fafb;
}
</style> 