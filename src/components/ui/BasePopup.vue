<script setup lang="ts">
import { onMounted } from 'vue'

const props = defineProps({
  message: { type: String, required: true },
  type: { type: String, default: 'success' }, // Options : 'success', 'error', 'info'
  duration: { type: Number, default: 3000 } // Disparaît après 3 secondes par défaut
})

const emit = defineEmits(['close'])

// On lance le compte à rebours dès que le composant est affiché
onMounted(() => {
  setTimeout(() => {
    emit('close')
  }, props.duration)
})
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50">
    <div
      class="px-6 py-4 rounded-lg shadow-xl text-white font-medium flex items-center space-x-3 transition-all"
      :class="{
        'bg-green-600': type === 'success',
        'bg-red-600': type === 'error',
        'bg-blue-600': type === 'info'
      }"
    >
      <span v-if="type === 'success'">✅</span>
      <span v-if="type === 'error'">❌</span>
      <span v-if="type === 'info'">ℹ️</span>

      <span>{{ message }}</span>

      <button @click="$emit('close')" class="ml-4 opacity-80 hover:opacity-100 focus:outline-none">
        ✖
      </button>
    </div>
  </div>
</template>
