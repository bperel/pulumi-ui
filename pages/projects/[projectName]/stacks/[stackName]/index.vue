<template>
  <div class="h-full flex flex-col" v-if="currentStackDetails">
        <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">
            {{ currentStackName }}
          </h1>
          <p class="text-sm text-gray-500">
            Project: {{ currentProjectName }}
          </p>
        </div>
        
        <div class="flex space-x-2">
          <UButton
            variant="outline"
            icon="i-heroicons-eye"
            @click="activeTab = 'overview'"
            :class="{ 'bg-blue-50': activeTab === 'overview' }"
          >
            Overview
          </UButton>
          <UButton
            variant="outline"
            icon="i-heroicons-document-text"
            @click="activeTab = 'readme'"
            :class="{ 'bg-blue-50': activeTab === 'readme' }"
          >
            README
          </UButton>
          <UButton
            variant="outline"
            icon="i-heroicons-cube"
            @click="activeTab = 'resources'"
            :class="{ 'bg-blue-50': activeTab === 'resources' }"
          >
            Resources
          </UButton>
        </div>
      </div>
    </div>
    
        <div class="flex-1 overflow-auto">
      <div v-if="activeTab === 'overview'" class="p-6">
        <StackOverviewTab :stack="currentStackDetails" />
      </div>
      
      <div v-else-if="activeTab === 'readme'" class="p-6">
        <StackReadmeTab :stack="currentStackDetails" />
      </div>
      
      <div v-else-if="activeTab === 'resources'" class="p-6">
        <StackResourcesTab :stack="currentStackDetails" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = ref<'overview' | 'readme' | 'resources'>('overview')
const { currentProjectName, currentStackName, currentStackDetails } = storeToRefs(usePulumiStore())
const { fetchStackResources } = usePulumiStore()

watch(() => route.query.tab, (newTab) => {
  if (newTab && typeof newTab === 'string' && ['overview', 'readme', 'resources'].includes(newTab)) {
    activeTab.value = newTab as 'overview' | 'readme' | 'resources'
  }
}, { immediate: true })

watch(activeTab, (newTab) => {
  navigateTo({
    query: { ...route.query, tab: newTab }
  }, { replace: true })
})

onMounted(() => {
  currentProjectName.value = route.params.projectName as string
  currentStackName.value = route.params.stackName as string
  fetchStackResources()
})
</script> 