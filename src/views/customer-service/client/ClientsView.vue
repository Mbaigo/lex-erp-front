<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { clientApi } from '@/services/customer-api/ClientService'
import { Genre, type ClientResponseDTO, type ClientRequestDTO } from '@/models/customer-service-api'
import BaseTable from '@/components/ui/BaseTable.vue'
import BasePagination from '@/components/ui/BasePaginationView.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInputView.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

// --- ÉTATS RÉACTIFS TYPÉS ---
const clients = ref<ClientResponseDTO[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const isSearchMode = ref(false)

// Variables pour la pagination
const pageCourante = ref(0)
const totalPages = ref(0)
const totalElements = ref(0)

// Configuration des colonnes pour le BaseTable
const colonnes = [
  { key: 'nom', label: 'Nom' },
  { key: 'prenom', label: 'Prénom' },
  { key: 'telephone', label: 'Téléphone' },
  { key: 'email', label: 'Email' },
  { key: 'actions', label: '' },
]

// --- GESTION DE LA CRÉATION ET MODIFICATION ---
const isModalOpen = ref(false)
const isSubmitting = ref(false)
const erreursFormulaire = ref<Record<string, string>>({})
const idClientEnEdition = ref<number | null>(null)
const optionsGenre = Object.values(Genre)

const formulaireClient = ref<ClientRequestDTO>({
  nom: '',
  prenom: '',
  telephone: '',
  email: '',
  adresse: '',
  genre: undefined,
  notesMorphologie: '',
})

// --- LOGIQUE MÉTIER ---

// 1. Charger la liste paginée (Déplacé ici car utilisé par les autres fonctions)
const chargerClients = async (numeroPage = 0) => {
  if (isLoading.value) return
  isLoading.value = true
  isSearchMode.value = false

  try {
    const reponse = await clientApi.getAllClients(numeroPage, 10)
    clients.value = reponse.data.content
    pageCourante.value = reponse.data.number
    totalPages.value = reponse.data.totalPages
    totalElements.value = reponse.data.totalElements
  } catch (erreur) {
    console.error('Erreur lors du chargement des clients', erreur)
  } finally {
    isLoading.value = false
  }
}

// 2. Ouvrir la modale pour Création
const ouvrirModalCreation = () => {
  idClientEnEdition.value = null
  formulaireClient.value = {
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: '',
    genre: undefined,
    notesMorphologie: '',
  }
  erreursFormulaire.value = {}
  isModalOpen.value = true
}

// 3. Ouvrir la modale pour Édition
const ouvrirModalEdition = (client: ClientResponseDTO) => {
  idClientEnEdition.value = client.id
  formulaireClient.value = {
    nom: client.nom,
    prenom: client.prenom || '',
    telephone: client.telephone,
    email: client.email || '',
    adresse: client.adresse || '',
    genre: client.genre,
    notesMorphologie: client.notesMorphologie || '',
  }
  erreursFormulaire.value = {}
  isModalOpen.value = true
}

// 4. Enregistrer (Création ou Mise à jour)
const enregistrerClient = async () => {
  erreursFormulaire.value = {}
  if (!formulaireClient.value.nom) erreursFormulaire.value.nom = 'Le nom est obligatoire'
  if (!formulaireClient.value.telephone)
    erreursFormulaire.value.telephone = 'Le téléphone est obligatoire'

  if (Object.keys(erreursFormulaire.value).length > 0) return

  isSubmitting.value = true
  try {
    if (idClientEnEdition.value) {
      await clientApi.updateClient(idClientEnEdition.value, formulaireClient.value)
    } else {
      await clientApi.createClient(formulaireClient.value)
    }

    isModalOpen.value = false
    chargerClients(pageCourante.value)
  } catch (erreur: any) {
    console.error("Erreur d'enregistrement", erreur)
    if (erreur.response?.data?.errors) {
      erreursFormulaire.value = erreur.response.data.errors
    }
  } finally {
    isSubmitting.value = false
  }
}

// 5. Recherche rapide par téléphone
const chercherClient = async () => {
  if (!searchQuery.value.trim()) {
    return chargerClients(0)
  }

  isLoading.value = true
  isSearchMode.value = true

  try {
    const reponse = await clientApi.searchByTelephone(searchQuery.value)
    clients.value = reponse.data ? [reponse.data] : []
    totalPages.value = 1
    totalElements.value = clients.value.length
  } catch (erreur) {
    console.error('Client introuvable', erreur)
    clients.value = []
  } finally {
    isLoading.value = false
  }
}

// 6. Quitter le mode recherche
const reinitialiserRecherche = () => {
  searchQuery.value = ''
  chargerClients(0)
}

// Chargement initial au montage
onMounted(() => {
  chargerClients(0)
})
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">👥 Annuaire Clients</h1>
        <p class="text-gray-500 text-sm mt-1">Base de clientèle de l'atelier Lex Couture</p>
      </div>
      <BaseButton variant="primary" @click="ouvrirModalCreation">+ Nouveau Client</BaseButton>
    </div>

    <div class="flex gap-4 mb-6 items-end bg-gray-50 p-4 rounded-lg">
      <div class="flex-1">
        <BaseInput
          v-model="searchQuery"
          label="Recherche par téléphone"
          placeholder="Ex: +237 600 00 00"
          @keyup.enter="chercherClient"
        />
      </div>
      <div class="flex gap-2 mb-4">
        <BaseButton variant="secondary" @click="chercherClient" :isLoading="isLoading">
          🔍 Chercher
        </BaseButton>
        <BaseButton v-if="isSearchMode" variant="secondary" @click="reinitialiserRecherche">
          ✖ Annuler
        </BaseButton>
      </div>
    </div>

    <BaseTable :columns="colonnes" :data="clients">
      <template #cell-actions="{ row }">
        <div class="flex justify-end space-x-3 text-sm">
          <router-link
            :to="`/clients/${row.id}/fiches-mesures`"
            class="text-indigo-600 hover:text-indigo-900 font-medium"
          >
            📏 Mensurations
          </router-link>
          <button
            @click="ouvrirModalEdition(row)"
            class="text-gray-600 hover:text-gray-900 font-medium"
          >
            ✏️ Éditer
          </button>
        </div>
      </template>
    </BaseTable>

    <BasePagination
      v-if="!isSearchMode && clients.length > 0"
      :current-page="pageCourante"
      :total-pages="totalPages"
      :total-elements="totalElements"
      @change-page="chargerClients"
    />

    <div v-if="clients.length === 0 && !isLoading" class="text-center py-8 text-gray-500">
      Aucun client trouvé.
    </div>
  </div>

  <BaseModal
    :isOpen="isModalOpen"
    :title="idClientEnEdition ? 'Modifier le client' : 'Créer un nouveau client'"
    @close="isModalOpen = false"
  >
    <form @submit.prevent="enregistrerClient" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <BaseInput
          v-model="formulaireClient.nom"
          label="Nom *"
          placeholder="Ex: Dupont"
          :error="erreursFormulaire.nom"
        />
        <BaseInput v-model="formulaireClient.prenom" label="Prénom" placeholder="Ex: Jean" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col space-y-1">
          <label class="text-sm font-medium text-gray-700">Genre</label>
          <select
            v-model="formulaireClient.genre"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          >
            <option :value="undefined">Sélectionner...</option>
            <option v-for="g in optionsGenre" :key="g" :value="g">{{ g }}</option>
          </select>
        </div>

        <BaseInput
          v-model="formulaireClient.telephone"
          label="Téléphone *"
          type="tel"
          placeholder="Ex: +237 600 00 00"
          :error="erreursFormulaire.telephone"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <BaseInput
          v-model="formulaireClient.email"
          label="Adresse Email"
          type="email"
          placeholder="Ex: jean@email.com"
        />
        <BaseInput
          v-model="formulaireClient.adresse"
          label="Adresse / Quartier"
          placeholder="Ex: Bastos, Yaoundé"
        />
      </div>

      <div class="flex flex-col space-y-1">
        <label class="text-sm font-medium text-gray-700">Notes Morphologie</label>
        <textarea
          v-model="formulaireClient.notesMorphologie"
          rows="3"
          placeholder="Ex: Épaules larges, dos cambré..."
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
        ></textarea>
      </div>
    </form>

    <template #footer>
      <BaseButton variant="secondary" @click="isModalOpen = false"> Annuler </BaseButton>
      <BaseButton variant="primary" @click="enregistrerClient" :isLoading="isSubmitting">
        {{ idClientEnEdition ? 'Mettre à jour' : 'Enregistrer le client' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
