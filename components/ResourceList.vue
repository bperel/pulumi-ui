<template>
  <div v-if="stack.resources.length === 0" class="text-center text-gray-500 py-8">
    <UIcon name="i-heroicons-cube" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
    <p>No resources found</p>
  </div>
  
  <div v-else class="space-y-3">
    <div 
      v-for="resource in stack.resources" 
      :key="resource.urn"
      class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
    >
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-start space-x-2 mb-2">
            <UIcon name="i-heroicons-cube" class="w-4 h-4 text-blue-600 mt-0.5" />
            
            <span class="text-sm text-gray-500">({{ resource.type }})</span>
            </div>
            <div>
            <!-- Editable name field -->
            <div class="flex relative group">
              <div v-if="editingResource === resource.urn && editingProperty === 'name'" class="flex items-center space-x-2">
                <div class="flex items-center w-20">
                <UButton
                  variant="ghost"
                  size="sm"
                  color="success"
                  @click="saveEdit"
                >
                  <UIcon name="i-heroicons-check" class="w-4 h-4" />
                </UButton>
                <UButton
                  variant="ghost"
                  size="sm"
                  color="error"
                  @click="cancelEdit"
                >
                  <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
                </UButton></div>
                <UInput
                  v-model="editingName"
                  placeholder="Resource name"
                  @keyup.enter="saveEdit"
                  @keyup.esc="cancelEdit"
                  class="flex-1 min-w-fit"
                />
              </div>
              <div v-else class="flex items-center space-x-2">
                <div class="flex justify-center items-center w-20">
                <UButton
                  variant="ghost"
                  size="sm"
                  class="opacity-0 group-hover:opacity-100 transition-opacity"
                  @click="startEditingName(resource)"
                >
                  <UIcon name="i-heroicons-pencil" class="w-6 h-4" />
                </UButton></div>
                <span class="font-medium text-gray-900">{{ resource.name }}</span>
              </div>
            </div>
          </div>
          
          <div class="text-sm text-gray-600 mb-2">
            <span class="font-medium">ID:</span> {{ resource.urn }}
          </div>
          
          <!-- Editable parent field -->
          <div class="text-sm text-gray-600 mb-2 relative group">
            <span class="font-medium">Parent:</span>
            <ResourceSelect
              :is-editing="editingResource === resource.urn && editingProperty === 'parent'"
              v-model="resource.parent"
              :list="getAvailableParents(resource)"
              @start-edit="startEditingParent(resource)"
              @save="saveEdit"
              @cancel="cancelEdit"
              @update-parent="editingParent = $event"
            />
          </div>
          
          <div v-if="resource.dependencies?.length" class="text-sm text-gray-600">
            <span class="font-medium">Dependencies:</span> {{ resource.dependencies.join(', ') }}
          </div>
        </div>
        
        <!-- View button only -->
        <UButton
          variant="ghost"
          size="sm"
          @click="emit('viewResource', resource)"
        >
          <UIcon name="i-heroicons-eye" class="w-4 h-4" />
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Stack, Resource } from '~/types'
import ResourceSelect from './ResourceSelect.vue'

const {stack} = defineProps<{
  stack: Stack
}>()

const emit = defineEmits<{
  viewResource: [resource: Resource]
}>()

// Edit state
const editingResource = ref<string | null>(null)
const editingName = ref<string>('')
const editingParent = ref<string>('')
const editingProperty = ref<'name' | 'parent' | null>(null)

// Edit functions
const startEditingName = (resource: Resource) => {
  editingResource.value = resource.urn
  editingName.value = resource.name
  editingProperty.value = 'name'
}

const startEditingParent = (resource: Resource) => {
  editingResource.value = resource.urn
  editingParent.value = resource.parent || ''
  editingProperty.value = 'parent'
}

const saveEdit = () => {
  if (!editingResource.value || !stack) return
  
  const resource = stack.resources.find(r => r.urn === editingResource.value)
  if (resource) {
    if (editingProperty.value === 'name') {
      resource.name = editingName.value
    } else if (editingProperty.value === 'parent') {
      resource.parent = editingParent.value || undefined
    }
  }
  
  editingResource.value = null
  editingName.value = ''
  editingParent.value = ''
  editingProperty.value = null
}

const cancelEdit = () => {
  editingResource.value = null
  editingName.value = ''
  editingParent.value = ''
  editingProperty.value = null
}

// Get available parents for dropdown
const getAvailableParents = (currentResource: Resource) => stack.resources.filter(r => r.urn !== currentResource.urn &&
  r.urn !== currentResource.parent
)
</script> 