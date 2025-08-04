<template>
    <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
        <div class="flex items-start justify-between">
            <div class="flex-1">
                <div class="flex items-start space-x-2 mb-2">
                    <UIcon name="i-heroicons-cube" class="w-4 h-4 text-blue-600 mt-0.5" />

                    <span class="text-sm text-gray-500">({{ resource.type }})</span>
                </div>
                <div>
                    <UTable :data="tableData" :columns="columns"
                        @hover="(_, row) => hoveredProperty = row?.original.name"
                        class="flex-1 [&_th:nth-child(1)]:w-20 [&_th:nth-child(2)]:w-20">
                        <template #actions-cell="{ row }">
                            <template v-if="row.original.editable">
                                <div v-if="editingProperty === row.original.name"
                                    class="flex items-center space-x-2 h-8">
                                    <div class="flex items-center w-20">
                                        <UButton variant="ghost" size="sm" color="success" @click="saveEdit"
                                            :loading="isSaving" :disabled="isSaving">
                                            <UIcon name="i-heroicons-check" class="w-4 h-4" />
                                        </UButton>
                                        <UButton variant="ghost" size="sm" color="error" @click="cancelEdit"
                                            :disabled="isSaving">
                                            <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
                                        </UButton>
                                    </div>
                                </div>
                                <div v-else-if="hoveredProperty === row.original.name"
                                    class="flex justify-center items-center w-20 h-8">
                                    <UButton variant="ghost" size="sm"
                                        @click="editingResource = {...resource}; editingProperty = row.original.name">
                                        <UIcon name="i-heroicons-pencil" class="w-6 h-4" />
                                    </UButton>
                                </div>
                                <div v-else class="w-20 h-8"></div>
                            </template>
                            <div v-else class="w-20 h-8"></div>
                        </template>
                        <template #value-cell="{ row }">
                            <template v-if="editingProperty === row.original.name">
                                <ResourceSelect v-if="row.original.name === 'parent'"
                                    v-model="editingResource![row.original.name]" :list="availableResources"
                                    @start-edit="editingResource = resource; editingProperty = row.original.name"
                                    @save="saveEdit" @cancel="cancelEdit" />

                                <UInput v-else-if="row.original.name === 'name'"
                                    v-model="editingResource![row.original.name]" placeholder="Resource name"
                                    @keyup.enter="saveEdit" @keyup.esc="cancelEdit" :disabled="isSaving"
                                    class="flex-1 min-w-fit" />
                            </template>
                            <span v-else class="font-medium text-gray-900">{{ row.original.value
                                }}</span>
                        </template>
                    </UTable>
                </div>
            </div>
        </div>

        <UButton variant="ghost" size="sm" @click="emit('viewResource', resource)">
            <UIcon name="i-heroicons-eye" class="w-4 h-4" />
        </UButton>
    </div>
</template>

<script setup lang="ts">
import type { Resource } from '~/types'
import ResourceSelect from './ResourceSelect.vue'
import type { TableColumn } from '@nuxt/ui';

const { stackName, resource, availableResources } = defineProps<{
    stackName: string
    resource: Resource
    availableResources: Resource[]
}>()

const emit = defineEmits<{
    viewResource: [resource: Resource]
}>()

type ResourceProperty = {
    name: keyof Resource,
    value: Resource[keyof Resource]
    editable: boolean
}

const columns: TableColumn<ResourceProperty>[] = [
    {
        id: 'actions',
    },
    {
        accessorKey: 'name',
    },
    {
        accessorKey: 'value',
    },
]

const tableData = computed<ResourceProperty[]>(() => Object.entries(resource).map(([key, value]) => ({
    name: key as keyof Resource,
    value,
    editable: ['name', 'parent'].includes(key),
})))

const editingResource = ref<Resource>()
const editingProperty = ref<keyof Resource>()
const isSaving = ref(false)

const hoveredProperty = ref<keyof Resource>()

const saveEdit = async () => {
    if (!editingResource.value || !editingProperty.value) return

    // Only handle resource name renaming for now
    if (editingProperty.value === 'name') {
        isSaving.value = true
        try {
            const route = useRoute()
            const projectName = route.params.projectName as string
            const urn = editingResource.value.urn
            const newName = resource.name

            // Call the backend API to rename the resource
            const response = await $fetch(`/api/projects/${projectName}/stacks/${stackName}/resources/${encodeURIComponent(urn)}/rename`, {
                method: 'POST',
                body: {
                    newName: newName
                }
            })

            // Show success notification
            const toast = useToast()
            toast.add({
                title: 'Resource renamed',
                description: response?.message || `Resource renamed to ${newName}`,
                color: 'success'
            })
        } catch (error: any) {
            console.error('Error renaming resource:', error)

            // Show error notification
            const toast = useToast()
            toast.add({
                title: 'Error renaming resource',
                description: error?.data?.statusMessage || error?.message || 'Failed to rename resource',
                color: 'error'
            })

            // Revert the name change
            if (editingResource.value) {
                resource.name = editingResource.value.name
            }
        } finally {
            isSaving.value = false
        }
    }

    editingResource.value = undefined
    editingProperty.value = undefined
}

const cancelEdit = () => {
    editingResource.value = undefined
    editingProperty.value = undefined
}
</script>