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
        <div v-if="stack.resources.length === 0" class="text-center text-gray-500 py-8">
          <UIcon name="i-heroicons-cube" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No resources found</p>
        </div>
        
        <div v-else class="space-y-3">
          <div 
            v-for="resource in stack.resources" 
            :key="resource.id"
            class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <UIcon name="i-heroicons-cube" class="w-4 h-4 text-blue-600" />
                  <span class="font-medium text-gray-900">{{ resource.name }}</span>
                  <span class="text-sm text-gray-500">({{ resource.type }})</span>
                </div>
                
                <div class="text-sm text-gray-600 mb-2">
                  <span class="font-medium">ID:</span> {{ resource.id }}
                </div>
                
                <div v-if="resource.parent" class="text-sm text-gray-600 mb-2">
                  <span class="font-medium">Parent:</span> {{ resource.parent }}
                </div>
                
                <div v-if="resource.dependencies?.length" class="text-sm text-gray-600">
                  <span class="font-medium">Dependencies:</span> {{ resource.dependencies.join(', ') }}
                </div>
              </div>
              
              <UButton
                variant="ghost"
                size="sm"
                @click="selectedResource = resource"
              >
                <UIcon name="i-heroicons-eye" class="w-4 h-4" />
              </UButton>
            </div>
          </div>
        </div>
      </div>
      
            <div v-else-if="viewMode === 'graph'" class="h-96">
        <div class="text-center text-gray-500 py-8">
          <UIcon name="i-heroicons-squares-2x2" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>Graph view coming soon</p>
        </div>
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
                <span class="ml-2 text-gray-900">{{ selectedResource.id }}</span>
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

interface Props {
  stack: Stack | null
}

const props = withDefaults(defineProps<Props>(), {
  stack: null
})

const viewMode = ref<'list' | 'graph'>('list')
const selectedResource = ref<Resource >()
const showResourceModal = ref(false)

watch(selectedResource, (resource) => {
  showResourceModal.value = !!resource
})
</script> 