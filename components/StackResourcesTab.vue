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
          @view-resource="selectedResource = $event"
        />
      </div>
      
      <div v-else-if="viewMode === 'graph'" class="h-[700px]">
        <ResourceGraph 
          :stack="stack" 
          @view-resource="selectedResource = $event"
        />
      </div>
    </div>
    
    <UModal v-model="showResourceModal">
      <UCard v-if="selectedResource">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-cube" class="w-5 h-5 text-blue-600" />
            <span class="font-semibold">{{ selectedResource.name }}</span>
          </div>
        </template>
        
        <div class="space-y-4">
          <div>
            <h4 class="font-medium text-gray-900 mb-2">Resource Details</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium text-gray-700">Type:</span>
                <span class="ml-2 text-gray-900">{{ selectedResource.type }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">ID:</span>
                <span class="ml-2 text-gray-900">{{ selectedResource.urn }}</span>
              </div>
              <div v-if="selectedResource.parent">
                <span class="font-medium text-gray-700">Parent:</span>
                <span class="ml-2 text-gray-900">{{ selectedResource.parent }}</span>
              </div>
            </div>
          </div>
          
          <div v-if="selectedResource.inputs && Object.keys(selectedResource.inputs).length > 0">
            <h4 class="font-medium text-gray-900 mb-2">Inputs</h4>
            <pre class="text-sm text-gray-700 bg-gray-50 p-3 rounded overflow-x-auto">{{ JSON.stringify(selectedResource.inputs, null, 2) }}</pre>
          </div>
          
          <div v-if="selectedResource.outputs && Object.keys(selectedResource.outputs).length > 0">
            <h4 class="font-medium text-gray-900 mb-2">Outputs</h4>
            <pre class="text-sm text-gray-700 bg-gray-50 p-3 rounded overflow-x-auto">{{ JSON.stringify(selectedResource.outputs, null, 2) }}</pre>
          </div>
        </div>
        
        <template #footer>
          <div class="flex justify-end">
            <UButton @click="showResourceModal = false">
              Close
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
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
const selectedResource = ref<Resource>()
const showResourceModal = ref(false)

// Clear selection when switching view modes
watch(viewMode, () => {
  selectedResource.value = undefined
})

watch(selectedResource, (resource) => {
  showResourceModal.value = !!resource
})
</script>

<style scoped>
.vue-flow {
  background-color: #f9fafb;
}
</style> 