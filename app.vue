<template>
  <div class="h-screen flex">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Pulumi UI',
  meta: [
    { name: 'description', content: 'UI for visualizing self-hosted Pulumi state' }
  ]
})
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#__nuxt {
  height: 100%;
}
</style> 