<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ficheMesureApi } from '@/services/customer-api/FicheMesureService'
import type { FicheMesureResponseDTO } from '@/models/customer-service-api'

import BaseTable from '@/components/ui/BaseTable.vue'
import BasePagination from '@/components/ui/BasePaginationView.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const router = useRouter()

// --- ÉTATS RÉACTIFS ---
const fiches = ref<FicheMesureResponseDTO[]>([])
const isLoading = ref(true)

// Pagination
const pageCourante = ref(0)
const totalPages = ref(0)
const totalElements = ref(0)

// Modale de détails
const isModalDetailsOpen = ref(false)
const ficheSelectionnee = ref<FicheMesureResponseDTO | null>(null)

// Colonnes du tableau : Mise à jour du label
const colonnes = [
  { key: 'datePrise', label: 'Date' },
  { key: 'nomProjet', label: 'Projet' },
  { key: 'client', label: 'Client' }, // Modifié ici
  { key: 'actions', label: '' },
]

// --- LOGIQUE MÉTIER ---

const chargerToutesLesFiches = async (numeroPage = 0) => {
  isLoading.value = true
  try {
    const reponse = await ficheMesureApi.getAllFichesMesures(numeroPage, 5)
    fiches.value = reponse.data.content
    pageCourante.value = reponse.data.number
    totalPages.value = reponse.data.totalPages
    totalElements.value = reponse.data.totalElements
  } catch (erreur) {
    console.error('Erreur lors du chargement global des fiches', erreur)
  } finally {
    isLoading.value = false
  }
}

const ouvrirModalDetails = (fiche: FicheMesureResponseDTO) => {
  ficheSelectionnee.value = fiche
  isModalDetailsOpen.value = true
}

const allerAuDossierClient = (clientId: number) => {
  router.push(`/clients/${clientId}/fiches-mesures`)
}

const formaterDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

onMounted(() => {
  chargerToutesLesFiches(0)
})
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">📏 Registre Global des Mesures</h1>
        <p class="text-gray-500 text-sm mt-1">
          Historique complet de tous les projets de l'atelier
        </p>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-8 text-gray-500">Chargement du registre...</div>

    <template v-else>
      <BaseTable :columns="colonnes" :data="fiches">
        <template #cell-datePrise="{ row }">
          <span class="font-medium text-gray-700">{{ formaterDate(row.datePrise) }}</span>
        </template>

        <template #cell-nomProjet="{ row }">
          <span class="font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
            {{ row.nomProjet || 'Projet sans nom' }}
          </span>
        </template>

        <template #cell-client="{ row }">
          <button
            @click="allerAuDossierClient(row.clientId)"
            class="text-sm font-bold text-gray-800 hover:text-indigo-600 transition"
          >
            {{ row.clientPrenom }} {{ row.clientNom }}
            <span v-if="!row.clientNom" class="text-gray-400 font-normal italic">
              Client N° {{ row.clientId }}
            </span>
          </button>
        </template>

        <template #cell-actions="{ row }">
          <div class="flex justify-end space-x-3 text-sm">
            <button
              @click="ouvrirModalDetails(row)"
              class="text-emerald-600 hover:text-emerald-900 font-medium"
            >
              👁️ Aperçu
            </button>
            <button
              @click="allerAuDossierClient(row.clientId)"
              class="text-indigo-600 hover:text-indigo-900 font-medium border-l border-gray-200 pl-3"
            >
              📝 Gérer
            </button>
          </div>
        </template>
      </BaseTable>

      <BasePagination
        v-if="fiches.length > 0"
        :current-page="pageCourante"
        :total-pages="totalPages"
        :total-elements="totalElements"
        @change-page="chargerToutesLesFiches"
      />

      <div
        v-if="fiches.length === 0"
        class="text-center py-12 text-gray-500 border-2 border-dashed border-gray-100 rounded-lg mt-4"
      >
        Le registre est vide. Aucune mesure n'a encore été prise dans l'atelier.
      </div>
    </template>

    <BaseModal
      :isOpen="isModalDetailsOpen"
      :title="ficheSelectionnee?.nomProjet || 'Détails des mesures'"
      @close="isModalDetailsOpen = false"
    >
      <div v-if="ficheSelectionnee" class="space-y-4">
        <p
          class="text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded inline-block border border-gray-200"
        >
          👤
          <span class="font-bold"
            >{{ ficheSelectionnee.clientPrenom }} {{ ficheSelectionnee.clientNom }}</span
          >
          <span v-if="!ficheSelectionnee.clientNom"
            >Client N° {{ ficheSelectionnee.clientId }}</span
          >
          • 📅 Prises le {{ formaterDate(ficheSelectionnee.datePrise) }}
        </p>

        <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div
            v-for="(valeur, cle) in ficheSelectionnee.mesures ?? {}"
            :key="cle"
            class="flex justify-between border-b border-gray-200 pb-1"
          >
            <span class="text-sm text-gray-600 capitalize">{{ cle }}</span>
            <span class="text-sm font-bold text-gray-900">{{ valeur }} cm</span>
          </div>
        </div>

        <div
          v-if="ficheSelectionnee.remarquesSpecifiques"
          class="bg-indigo-50 p-3 rounded text-sm text-indigo-800 border border-indigo-100"
        >
          <strong>Remarques :</strong> {{ ficheSelectionnee.remarquesSpecifiques }}
        </div>
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="isModalDetailsOpen = false">Fermer</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
