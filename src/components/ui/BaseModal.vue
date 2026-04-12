<script setup lang="ts">
defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, required: true }
})

defineEmits(['close'])
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

    <div class="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 flex flex-col overflow-hidden">

      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 class="text-lg font-bold text-gray-800">{{ title }}</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-700 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="p-6 overflow-y-auto max-h-[70vh]">
        <slot></slot>
      </div>

      <div v-if="$slots.footer" class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
        <slot name="footer"></slot>
      </div>

    </div>
  </div>
</template>
