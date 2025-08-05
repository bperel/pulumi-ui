<template>
  <div
    class="bg-white border-r border-gray-200 transition-all duration-300"
    :class="[open ? 'w-80' : 'w-0', 'overflow-hidden']"
  >
    <div class="h-full flex flex-col">
      <div class="px-4 py-3 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Projects</h2>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div v-if="projects.length === 0" class="p-4 text-center text-gray-500">
          <UIcon
            name="i-heroicons-folder"
            class="w-8 h-8 mx-auto mb-2 text-gray-400"
          />
          <p>No projects found</p>
        </div>

        <div v-else class="p-2">
          <div v-for="project in projects" :key="project.name" class="mb-2">
            <button
              class="w-full flex items-center justify-between p-2 rounded hover:bg-gray-50 text-left"
              @click="expandedProject = project.name"
            >
              <div class="flex items-center space-x-2">
                <UIcon
                  name="i-heroicons-chevron-right"
                  class="w-4 h-4 transition-transform"
                  :class="{ 'rotate-90': expandedProject === project.name }"
                />
                <UIcon
                  name="i-heroicons-folder"
                  class="w-4 h-4 text-blue-600"
                />
                <span class="font-medium text-gray-900">{{
                  project.name
                }}</span>
              </div>
              <span class="text-sm text-gray-500">{{
                project.stackCount
              }}</span>
            </button>

            <div
              v-if="expandedProject === project.name"
              class="ml-6 space-y-1"
            >
              <UButton
                v-for="stack in stacks"
                :key="stack.name"
                :color="isSelectedStack(project.name, stack.name) ? 'primary' : 'neutral'"
                class="w-full flex items-center space-x-2 p-2 rounded hover:bg-gray-50 text-left"
                @click="selectStack(project.name, stack.name)"
              >
                <UIcon name="i-heroicons-cube" class="w-4 h-4" />
                <span class="text-sm">{{ stack.name }}</span>
                <UBadge
                  color="primary"
                  size="sm"
                >
                  {{ stack.resourceCount }}
                </UBadge>
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const { open = false } = 
  defineProps<{
    open: boolean;
  }>()

const expandedProject = defineModel<string>('expandedProject')

const emit = defineEmits<{
  "toggle-project-expansion": [projectName: string];
  "fetch-stack": [projectName: string, stackName: string];
}>();

const { projects, currentProjectName, stacks, currentStackName } = storeToRefs(
  usePulumiStore()
);

const selectStack = (projectName: string, stackName: string) => {
  emit("fetch-stack", projectName, stackName);
  navigateTo(`/projects/${projectName}/stacks/${stackName}`);
};

const isSelectedStack = (projectName: string, stackName: string) =>
  currentProjectName.value === projectName && currentStackName.value === stackName;
</script>
