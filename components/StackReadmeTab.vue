<template>
  <div v-if="stack" class="space-y-6">
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">README</h3>
      
      <div v-if="stack.readme" class="prose max-w-none">
        <div class="markdown-content" v-html="renderedReadme"></div>
      </div>
      
      <div v-else class="text-center text-gray-500 py-8">
        <UIcon name="i-heroicons-document-text" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p>No README found for this stack</p>
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
import type { GetStackResponse } from '~/types'

const stack = computed(() => usePulumiStore().currentStackDetails!)

const renderedReadme = computed(() => {
  if (!stack.value.readme) return ''
  
  return stack.value.readme
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
})
</script>

<style scoped>
.markdown-content {
  line-height: 1.6;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4,
.markdown-content h5,
.markdown-content h6 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.markdown-content h1 { font-size: 1.875rem; }
.markdown-content h2 { font-size: 1.5rem; }
.markdown-content h3 { font-size: 1.25rem; }
.markdown-content h4 { font-size: 1.125rem; }

.markdown-content p {
  margin-bottom: 1em;
}

.markdown-content ul,
.markdown-content ol {
  margin-bottom: 1em;
  padding-left: 1.5em;
}

.markdown-content li {
  margin-bottom: 0.25em;
}

.markdown-content code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 0.875em;
}

.markdown-content pre {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1em;
}

.markdown-content pre code {
  background-color: transparent;
  padding: 0;
}
</style> 