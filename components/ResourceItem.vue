<template>
    <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
        <div class="flex items-start justify-between">
            <div class="flex-1">
                <div class="flex items-start space-x-2 mb-2">
                    <UIcon name="i-heroicons-cube" class="w-4 h-4 text-blue-600 mt-0.5" />

                    <span class="text-sm text-gray-500">({{ resource.type }})</span>
                </div>
                <div>
                    <UTable :data="tableData" :columns="columns" class="flex-1">
                        <template #actions-cell="{ row }">
                            <template v-if="row.original.editable">
                                <div v-if="editingProperty === row.original.name" class="flex items-center space-x-2">
                                    <div class="flex items-center w-20">
                                        <UButton variant="ghost" size="sm" color="success" @click="saveEdit">
                                            <UIcon name="i-heroicons-check" class="w-4 h-4" />
                                        </UButton>
                                        <UButton variant="ghost" size="sm" color="error" @click="cancelEdit">
                                            <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
                                        </UButton>
                                    </div>
                                </div>
                                <div v-else class="flex justify-center items-center w-20">
                                    <UButton variant="ghost" size="sm"
                                        @click="editingResource = resource; editingProperty = row.original.name">
                                        <UIcon name="i-heroicons-pencil" class="w-6 h-4" />
                                    </UButton>
                                </div>
                            </template>
                        </template>
                        <template #value-cell="{ row }">
                            <ResourceSelect v-if="row.original.name === 'parent'"
                                :is-editing="editingProperty === row.original.name"
                                v-model="resource[row.original.name]" :list="availableResources"
                                @start-edit="editingResource = resource; editingProperty = row.original.name"
                                @save="saveEdit" @cancel="cancelEdit" />

                            <UInput v-else-if="editingProperty === row.original.name"
                                v-model="resource[row.original.name as 'name']" placeholder="Resource name"
                                @keyup.enter="saveEdit" @keyup.esc="cancelEdit" class="flex-1 min-w-fit" />
                            <span v-else class="font-medium text-gray-900">{{ resource.name }}</span>
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

const { resource, availableResources } = defineProps<{
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
    { id: 'actions' },
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

const saveEdit = () => {
    // TODO

    editingResource.value = undefined
    editingProperty.value = undefined
}

const cancelEdit = () => {
    editingResource.value = undefined
    editingProperty.value = undefined
}
</script>