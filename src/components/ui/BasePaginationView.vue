<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true }, // Attention : c'est la page Spring (Base 0)
  totalPages: { type: Number, required: true },
  totalElements: { type: Number, default: 0 },
})

// On émet un événement quand l'utilisateur veut changer de page
const emit = defineEmits(['change-page'])

// Pour l'affichage humain, on ajoute 1 (la page 0 devient la page 1)
const pageAffichee = computed(() => props.currentPage + 1)
// Sécurité : si totalPages est 0 (aucun résultat), on affiche quand même "sur 1"
const totalAffiche = computed(() => Math.max(1, props.totalPages))

const allerPagePrecedente = () => {
  if (props.currentPage > 0) {
    emit('change-page', props.currentPage - 1)
  }
}

const allerPageSuivante = () => {
  if (props.currentPage < props.totalPages - 1) {
    emit('change-page', props.currentPage + 1)
  }
}
</script>

<template>
  <div
    class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-b-lg"
  >
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="allerPagePrecedente"
        :disabled="currentPage === 0"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Précédent
      </button>
      <button
        @click="allerPageSuivante"
        :disabled="currentPage >= totalPages - 1"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Suivant
      </button>
    </div>

    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Total : <span class="font-bold text-indigo-600">{{ totalElements }}</span> résultats
        </p>
      </div>

      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            @click="allerPagePrecedente"
            :disabled="currentPage === 0"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Précédent</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <span
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
          >
            Page {{ pageAffichee }} sur {{ totalAffiche }}
          </span>

          <button
            @click="allerPageSuivante"
            :disabled="currentPage >= totalPages - 1"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">Suivant</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>
