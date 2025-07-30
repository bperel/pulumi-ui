<template>
  <div class="inline-flex items-center space-x-2">
    <USelect :ui="{ content: 'min-w-fit' }"
      :items="list.map(item => item.urn)"
      value-key="urn"
      v-if="isEditing"
      v-model="selected"
      class="ml-2 w-64 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    />
    <span v-else-if="selected" class="ml-2 w-64 text-gray-900 truncate">{{ selected }}</span>
    <span v-else class="ml-2 w-64 text-gray-400 italic">None</span>
    <UButton
      v-if="!isEditing"
      variant="ghost"
      size="sm"
      class="opacity-0 group-hover:opacity-100 transition-opacity"
      @click="emit('startEdit')"
    >
      <UIcon name="i-heroicons-pencil" class="w-4 h-4" />
    </UButton>
    <div v-if="isEditing" class="flex items-center space-x-1">
      <UButton
        variant="ghost"
        size="sm"
        color="success"
        @click="emit('save')"
      >
        <UIcon name="i-heroicons-check" class="w-4 h-4" />
      </UButton>
      <UButton
        variant="ghost"
        size="sm"
        color="error"
        @click="emit('cancel')"
      >
        <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Resource } from '~/types'

const selected = defineModel<string>()

const {isEditing, list} = defineProps<{
  isEditing: boolean
  list: Resource[]
}>()

const emit = defineEmits<{
  startEdit: []
  save: []
  cancel: []
}>()
</script> 