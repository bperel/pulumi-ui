<template>
  <div v-if="stack.resources.length === 0" class="text-center text-gray-500 py-8">
    <UIcon name="i-heroicons-cube" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
    <p>No resources found</p>
  </div>
  
  <div v-else class="space-y-3">
    <ResourceItem
      v-for="resource in stack.resources"
      :key="resource.urn"
      :resource="resource"
      :available-resources="stack.resources.filter(r => r.urn !== resource.urn)"
      @view-resource="emit('viewResource', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Stack, Resource } from '~/types'
import ResourceItem from './ResourceItem.vue'

const {stack} = defineProps<{
  stack: Stack
}>()

const emit = defineEmits<{
  viewResource: [resource: Resource]
}>()
</script> 