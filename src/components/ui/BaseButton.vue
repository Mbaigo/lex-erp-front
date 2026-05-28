<script setup lang="ts">
import { computed } from 'vue'

// 1. LES PROPS : Ce que le bouton accepte comme configuration
const props = defineProps({
  variant: {
    type: String,
    default: 'primary', // Options possibles : 'primary', 'secondary', 'danger'
  },
  color: {
    type: String,
    default: undefined, // Si défini, surcharge les couleurs du variant
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

// 2. LES EMITS : Les actions que le bouton renvoie
const emit = defineEmits(['click'])

// 3. LA LOGIQUE CSS : On calcule les couleurs Tailwind selon le "variant" choisi ou la couleur personnalisée
const buttonClasses = computed(() => {
  // Les classes communes à TOUS les boutons
  const baseClasses =
    'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  // Les couleurs spécifiques
  const variants: Record<string, string> = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary:
      'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  }

  // Si une couleur personnalisée est fournie, l'utiliser ; sinon, utiliser le variant
  const colorClasses = props.color || variants[props.variant]

  // On fusionne la base avec la couleur choisie
  return `${baseClasses} ${colorClasses}`
})
</script>

<template>
  <button :class="buttonClasses" :disabled="disabled || isLoading" @click="emit('click')">
    <svg
      v-if="isLoading"
      class="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <slot></slot>
  </button>
</template>
