<template>
  <div 
    :class="[
      'px-4 py-3 rounded-lg border-2 shadow-sm cursor-pointer transition-all duration-200 min-w-[180px]',
      getNodeClasses()
    ]"
    @click="$emit('click')"
  >
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center space-x-2">
        <UIcon name="i-heroicons-cube" class="w-4 h-4" :class="getIconClasses()" />
        <span class="font-medium text-sm truncate" :class="getTextClasses()">{{ data.label }}</span>
      </div>
      <div v-if="data.level !== undefined" class="flex items-center space-x-1">
        <span class="text-xs" :class="getLevelTextClasses()">L{{ data.level }}</span>
        <div class="w-2 h-2 rounded-full" :class="getLevelColor(data.level)"></div>
      </div>
    </div>
    
    <div class="text-xs mb-1 truncate" :class="getTypeClasses()">
      {{ data.type }}
    </div>
    
    <div class="text-xs truncate" :class="getIdClasses()">
      {{ getShortId(data.resource.urn) }}
    </div>
    
    <!-- Edge handles for proper routing -->
    <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-transparent" data-handleid="top"></div>
    <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-transparent" data-handleid="bottom"></div>
  </div>
</template>

<script setup lang="ts">
import type { Resource } from '~/types'

interface NodeData {
  resource: Resource
  label: string
  type: string
  level?: number
  isSelected?: boolean
  isConnected?: boolean
}

const {data, selected} = defineProps<{
  data: NodeData
  selected: boolean
}>()

defineEmits<{
  click: []
}>()

const getLevelColor = (level: number) => {
  const colors = [
    'bg-blue-500', // Level 0 - root
    'bg-green-500', // Level 1
    'bg-yellow-500', // Level 2
    'bg-orange-500', // Level 3
    'bg-red-500', // Level 4+
    'bg-purple-500', // Level 5+
    'bg-pink-500', // Level 6+
  ]
  return colors[Math.min(level, colors.length - 1)]
}

const getShortId = (urn: string) => {
  // Extract the last part of the URN for display
  const parts = urn.split('::')
  return parts[parts.length - 1] || urn
}

const getNodeClasses = () => {
  if (data.isSelected) {
    return 'border-blue-500 bg-blue-50 shadow-lg scale-105'
  } else if (data.isConnected) {
    return 'border-blue-300 bg-blue-25 shadow-md'
  } else if (selected) {
    return 'border-blue-500 bg-blue-50 shadow-md'
  } else {
    return 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
  }
}

const getIconClasses = () => {
  if (data.isSelected) {
    return 'text-blue-700'
  } else if (data.isConnected) {
    return 'text-blue-600'
  } else {
    return 'text-blue-600'
  }
}

const getTextClasses = () => {
  if (data.isSelected) {
    return 'text-blue-900'
  } else if (data.isConnected) {
    return 'text-blue-800'
  } else {
    return 'text-gray-900'
  }
}

const getTypeClasses = () => {
  if (data.isSelected) {
    return 'text-blue-700'
  } else if (data.isConnected) {
    return 'text-blue-600'
  } else {
    return 'text-gray-500'
  }
}

const getIdClasses = () => {
  if (data.isSelected) {
    return 'text-blue-600'
  } else if (data.isConnected) {
    return 'text-blue-500'
  } else {
    return 'text-gray-400'
  }
}

const getLevelTextClasses = () => {
  if (data.isSelected) {
    return 'text-blue-600'
  } else if (data.isConnected) {
    return 'text-blue-500'
  } else {
    return 'text-gray-400'
  }
}
</script> 