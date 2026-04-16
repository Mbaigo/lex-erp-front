<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useClientStore } from '@/stores/useClientStore'
import { ficheMesureApi } from '@/services/customer-api/FicheMesureService'
import type { FicheMesureResponseDTO, FicheMesureRequestDTO } from '@/models/customer-service-api'

import BaseTable from '@/components/ui/BaseTable.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInputView.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const route = useRoute()
const router = useRouter()
const clientId = Number(route.params.id)

// Intégration de Pinia
const clientStore = useClientStore()
const { selectedClient, isLoading: isClientLoading } = storeToRefs(clientStore)

// --- ÉTATS RÉACTIFS ---
const fiches = ref<FicheMesureResponseDTO[]>([])
const isFichesLoading = ref(true)
const isSubmitting = ref(false)

// Gestion des Modales
const isModalFormOpen = ref(false)
const isModalDetailsOpen = ref(false)
const idFicheEnEdition = ref<number | null>(null)
const ficheSelectionneePourDetails = ref<FicheMesureResponseDTO | null>(null)

// NOUVEAU : Tableau dynamique qui gère les lignes d'inputs affichées à l'écran
const lignesMesures = ref<{ cle: string; valeur: number | null }[]>([])

const formulaireFiche = ref<FicheMesureRequestDTO>({
  clientId: clientId,
  nomProjet: '',
  mesures: {},
  remarquesSpecifiques: '',
})

// Configuration du Tableau
const colonnes = [
  { key: 'datePrise', label: 'Date' },
  { key: 'nomProjet', label: 'Projet' },
  { key: 'actions', label: '' },
]

// --- LOGIQUE MÉTIER ---

const chargerDonnees = async () => {
  isFichesLoading.value = true
  try {
    await clientStore.ensureClient(clientId)
    const res = await ficheMesureApi.getFichesByClientId(clientId)
    fiches.value = res.data.sort((a, b) => {
      return new Date(b.datePrise).getTime() - new Date(a.datePrise).getTime()
    })
  } catch (err) {
    console.error('Erreur au chargement des données', err)
  } finally {
    isFichesLoading.value = false
  }
}

const ouvrirModalDetails = (fiche: FicheMesureResponseDTO) => {
  ficheSelectionneePourDetails.value = fiche
  isModalDetailsOpen.value = true
}

const ouvrirModalCreation = () => {
  idFicheEnEdition.value = null
  formulaireFiche.value = { clientId, nomProjet: '', mesures: {}, remarquesSpecifiques: '' }
  // Dès l'ouverture, on affiche une ligne vide pour commencer la saisie
  lignesMesures.value = [{ cle: '', valeur: null }]
  isModalFormOpen.value = true
}

const ouvrirModalEdition = (fiche: FicheMesureResponseDTO) => {
  idFicheEnEdition.value = fiche.id
  formulaireFiche.value = JSON.parse(JSON.stringify(fiche))

  // On transforme la Map de la BD en un tableau de lignes pour l'affichage
  lignesMesures.value = Object.entries(fiche.mesures || {}).map(([key, val]) => ({
    cle: key,
    valeur: val,
  }))

  // Si la fiche était vide, on met quand même une ligne vide
  if (lignesMesures.value.length === 0) {
    lignesMesures.value = [{ cle: '', valeur: null }]
  }

  isModalFormOpen.value = true
}

// --- GESTION DES LIGNES DYNAMIQUES (La correction est ici) ---
const ajouterLigne = () => {
  // Pousse un nouvel objet vide dans le tableau, ce qui va créer un nouvel input à l'écran
  lignesMesures.value.push({ cle: '', valeur: null })
}

const supprimerLigne = (index: number) => {
  lignesMesures.value.splice(index, 1)
}

const enregistrerFiche = async () => {
  if (!formulaireFiche.value.nomProjet) {
    alert('Le nom du projet est obligatoire.')
    return
  }

  // Avant d'envoyer au backend, on transforme nos lignes d'inputs en une Map
  formulaireFiche.value.mesures = {}
  lignesMesures.value.forEach((ligne) => {
    if (ligne.cle && ligne.cle.trim() !== '' && ligne.valeur !== null) {
      formulaireFiche.value.mesures[ligne.cle.trim()] = ligne.valeur
    }
  })

  isSubmitting.value = true
  try {
    if (idFicheEnEdition.value) {
      await ficheMesureApi.updateFicheMesure(idFicheEnEdition.value, formulaireFiche.value)
    } else {
      await ficheMesureApi.createFicheMesure(formulaireFiche.value)
    }
    isModalFormOpen.value = false
    chargerDonnees()
  } catch (err) {
    console.error("Erreur à l'enregistrement de la fiche", err)
  } finally {
    isSubmitting.value = false
  }
}

const formaterDate = (date: string | null | undefined) => {
  if (!date) return 'Date inconnue'
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Format invalide'
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

onMounted(chargerDonnees)
</script>

<template>
  <div class="space-y-6">
    <div v-if="selectedClient" class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div class="flex justify-between items-start">
        <div class="flex items-center space-x-4">
          <button
            @click="router.push('/clients/liste')"
            class="text-gray-400 hover:text-indigo-600 transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ selectedClient.nom }} {{ selectedClient.prenom }}
            </h1>
            <div class="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <span class="flex items-center"
                ><span class="mr-1">📞</span> {{ selectedClient.telephone }}</span
              >
              <span
                v-if="selectedClient.genre"
                class="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold uppercase"
                >{{ selectedClient.genre }}</span
              >
            </div>
            <p
              v-if="selectedClient.notesMorphologie"
              class="mt-3 text-sm text-amber-700 bg-amber-50 p-2 rounded border border-amber-100"
            >
              <strong>Morphologie :</strong> {{ selectedClient.notesMorphologie }}
            </p>
          </div>
        </div>
        <BaseButton variant="primary" @click="ouvrirModalCreation">+ Nouvelle Mesure</BaseButton>
      </div>
    </div>

    <div
      v-else-if="isClientLoading"
      class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500"
    >
      Chargement des informations du client...
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Historique des Mesures</h2>

      <div v-if="isFichesLoading" class="text-center py-8 text-gray-500">
        Chargement des fiches...
      </div>

      <BaseTable v-else-if="fiches.length > 0" :columns="colonnes" :data="fiches">
        <template #cell-datePrise="{ row }">
          <span class="font-medium text-gray-700">{{ formaterDate(row.datePrise) }}</span>
        </template>
        <template #cell-nomProjet="{ row }">
          <span class="font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">{{
            row.nomProjet || 'Projet sans nom'
          }}</span>
        </template>
        <template #cell-actions="{ row }">
          <div class="flex justify-end space-x-3 text-sm">
            <button
              @click="ouvrirModalDetails(row)"
              class="text-emerald-600 hover:text-emerald-900 font-medium"
            >
              👁️ Détails
            </button>
            <button
              @click="ouvrirModalEdition(row)"
              class="text-gray-600 hover:text-gray-900 font-medium border-l border-gray-200 pl-3"
            >
              ✏️ Éditer
            </button>
          </div>
        </template>
      </BaseTable>

      <div v-else class="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
        <div class="text-gray-400 mb-2 text-4xl">✂️</div>
        <h3 class="text-lg font-medium text-gray-900">Aucune mesure enregistrée</h3>
        <p class="text-gray-500 mt-1">Créez la première mesure pour ce client.</p>
        <BaseButton variant="secondary" class="mt-4" @click="ouvrirModalCreation"
          >Ajouter une mesure</BaseButton
        >
      </div>
    </div>

    <BaseModal
      :isOpen="isModalDetailsOpen"
      :title="ficheSelectionneePourDetails?.nomProjet || 'Détails des mesures'"
      @close="isModalDetailsOpen = false"
    >
      <div v-if="ficheSelectionneePourDetails" class="space-y-4">
        <p class="text-sm text-gray-500 mb-4">
          Prises le {{ formaterDate(ficheSelectionneePourDetails.datePrise) }}
        </p>

        <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div
            v-for="(valeur, cle) in ficheSelectionneePourDetails.mesures ?? {}"
            :key="cle"
            class="flex justify-between border-b border-gray-200 pb-1"
          >
            <span class="text-sm text-gray-600 capitalize">{{ cle }}</span>
            <span class="text-sm font-bold text-gray-900">{{ valeur }} cm</span>
          </div>
          <div
            v-if="
              !ficheSelectionneePourDetails.mesures ||
              Object.keys(ficheSelectionneePourDetails.mesures).length === 0
            "
            class="col-span-2 text-sm text-gray-400 italic text-center"
          >
            Aucune mesure ajoutée dans cette fiche.
          </div>
        </div>

        <div
          v-if="ficheSelectionneePourDetails.remarquesSpecifiques"
          class="bg-indigo-50 p-3 rounded text-sm text-indigo-800 border border-indigo-100"
        >
          <strong>Remarques :</strong> {{ ficheSelectionneePourDetails.remarquesSpecifiques }}
        </div>
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="isModalDetailsOpen = false">Fermer</BaseButton>
      </template>
    </BaseModal>

    <BaseModal
      :isOpen="isModalFormOpen"
      :title="idFicheEnEdition ? 'Modifier la mesure' : 'Nouvelle Mesure'"
      @close="isModalFormOpen = false"
    >
      <form @submit.prevent="enregistrerFiche" class="space-y-4">
        <BaseInput
          v-model="formulaireFiche.nomProjet"
          label="Nom de la Mesure *"
          placeholder="Ex: Veste de costume croisée"
          required
        />

        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
          <div class="flex justify-between items-center mb-4">
            <p class="text-sm font-bold text-gray-700 uppercase">Mensurations</p>

            <button
              type="button"
              @click="ajouterLigne"
              class="text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-semibold py-1 px-3 rounded transition"
            >
              + Ajouter une ligne
            </button>
          </div>

          <div class="max-h-60 overflow-y-auto space-y-3 pr-2">
            <div
              v-for="(ligne, index) in lignesMesures"
              :key="index"
              class="flex gap-3 items-center"
            >
              <input
                v-model="ligne.cle"
                type="text"
                placeholder="Ex: Épaule"
                class="flex-1 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              />

              <input
                v-model="ligne.valeur"
                type="number"
                step="0.5"
                placeholder="cm"
                class="w-24 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              />

              <button
                type="button"
                @click="supprimerLigne(index)"
                class="text-red-400 hover:text-red-600 font-bold p-1 focus:outline-none transition"
                title="Supprimer cette ligne"
              >
                ✕
              </button>
            </div>

            <div
              v-if="lignesMesures.length === 0"
              class="text-sm text-gray-400 italic py-2 text-center"
            >
              Cliquez sur le bouton ci-dessus pour ajouter des points de mesure.
            </div>
          </div>
        </div>

        <div class="flex flex-col space-y-1 mt-4">
          <label class="text-sm font-medium text-gray-700">Remarques et retouches</label>
          <textarea
            v-model="formulaireFiche.remarquesSpecifiques"
            placeholder="Détails importants liés au projet..."
            class="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            rows="3"
          ></textarea>
        </div>
      </form>

      <template #footer>
        <BaseButton variant="secondary" @click="isModalFormOpen = false">Annuler</BaseButton>
        <BaseButton variant="primary" @click="enregistrerFiche" :isLoading="isSubmitting">
          {{ idFicheEnEdition ? 'Mettre à jour' : 'Enregistrer le projet' }}
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
