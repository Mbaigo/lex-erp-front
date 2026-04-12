<script setup lang="ts">
defineProps({
  // Ex: [{ key: 'id', label: 'N° Commande' }, { key: 'client', label: 'Client' }]
  columns: { type: Array as () => Array<{ key: string, label: string }>, required: true },
  // Les données reçues de ton API
  data: { type: Array as () => Array<any>, required: true }
})
</script>

<template>
  <div class="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
    <table class="min-w-full divide-y divide-gray-200">

      <thead class="bg-gray-50">
        <tr>
          <th v-for="col in columns" :key="col.key" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {{ col.label }}
          </th>
        </tr>
      </thead>

      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="(row, index) in data" :key="index" class="hover:bg-gray-50 transition-colors">
          <td v-for="col in columns" :key="col.key" class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
            <slot :name="`cell-${col.key}`" :row="row">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>

        <tr v-if="data.length === 0">
          <td :colspan="columns.length" class="px-6 py-8 text-center text-gray-500 text-sm">
            Aucune donnée disponible.
          </td>
        </tr>
      </tbody>

    </table>
  </div>
</template>
