<template>
  <div class="inline-flex items-center space-x-2">
    <USelect :ui="{ content: 'min-w-fit' }"
      :items="list.map(item => item.urn)"
      value-key="urn"
      v-model="selected"
      class="ml-2 w-64 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
</template>

<script setup lang="ts" generic="R extends Resource">
import type { Resource } from '~/types'

const selected = defineModel<R[keyof R] & string>()

const {list} = defineProps<{
  list: R[]
}>()
</script> 