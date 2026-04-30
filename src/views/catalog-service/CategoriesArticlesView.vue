<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { catalogService } from '@/services/catalog-api/CategorieService'
import type { CategorieRequest, CategorieResponse } from '@/models/catalog-service-api'

// Imports des composants UI réutilisables
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInputView.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BasePagination from '@/components/ui/BasePaginationView.vue'

// --- ÉTATS RÉACTIFS ---
const categories = ref<CategorieResponse[]>([])
const isLoading = ref(true)
const isSubmitting = ref(false)

// États de la pagination (Synchronisés avec Spring Data : 0-indexed)
const pageCourante = ref(0)
const totalPages = ref(0)
const totalElements = ref(0)
const TAILLE_PAGE = 5

// Gestion des Modales
const isModalFormOpen = ref(false)
const idCategorieEnEdition = ref<number | null>(null)

const formulaireCategorie = ref<CategorieRequest>({
  code: '',
  nom: '',
  description: '',
})

// Configuration des colonnes du tableau
const colonnes = [
  { key: 'code', label: 'Code' },
  { key: 'nom', label: 'Nom de la Catégorie' },
  { key: 'description', label: 'Description' },
  { key: 'actions', label: '' },
]

// --- LOGIQUE MÉTIER ---

/**
 * Charge les catégories depuis le microservice Catalog
 * @param numPage Index de la page à charger
 */
const chargerDonnees = async (numPage: number = 0) => {
  isLoading.value = true
  try {
    const reponse = await catalogService.getAllCategories(numPage, TAILLE_PAGE)

    // Mapping des données depuis l'objet Page de Spring Boot
    categories.value = reponse.content || []
    pageCourante.value = reponse.number || 0
    totalPages.value = reponse.totalPages || 0
    totalElements.value = reponse.totalElements || 0
  } catch (err) {
    console.error('Erreur lors du chargement des catégories:', err)
  } finally {
    isLoading.value = false
  }
}

/**
 * Gère le changement de page émis par le composant BasePagination
 */
const handlePageChange = (nouveauNumPage: number) => {
  chargerDonnees(nouveauNumPage)
}

// --- GESTION DU CRUD ---

const ouvrirModalCreation = () => {
  idCategorieEnEdition.value = null
  formulaireCategorie.value = { code: '', nom: '', description: '' }
  isModalFormOpen.value = true
}

const ouvrirModalEdition = (categorie: CategorieResponse) => {
  idCategorieEnEdition.value = categorie.id
  formulaireCategorie.value = {
    code: categorie.code,
    nom: categorie.nom,
    description: categorie.description,
  }
  isModalFormOpen.value = true
}

const enregistrerCategorie = async () => {
  if (!formulaireCategorie.value.code || !formulaireCategorie.value.nom) {
    alert('Le code et le nom sont obligatoires.')
    return
  }

  isSubmitting.value = true
  try {
    if (idCategorieEnEdition.value) {
      await catalogService.updateCategorie(idCategorieEnEdition.value, formulaireCategorie.value)
    } else {
      await catalogService.createCategorie(formulaireCategorie.value)
    }
    isModalFormOpen.value = false
    // On rafraîchit la vue sur la page actuelle
    await chargerDonnees(pageCourante.value)
  } catch (err) {
    console.error("Erreur à l'enregistrement de la catégorie", err)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => chargerDonnees(0))
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">🗂️ Catégories d'Articles</h1>
          <p class="text-sm text-gray-500 mt-1">
            Gérez vos familles de produits et matières premières.
          </p>
        </div>
        <BaseButton variant="primary" @click="ouvrirModalCreation">
          + Nouveau
        </BaseButton>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
      <div v-if="isLoading" class="text-center py-8 text-gray-500 italic">
        Chargement du catalogue...
      </div>

      <template v-else-if="categories.length > 0">
        <BaseTable :columns="colonnes" :data="categories">
          <template #cell-code="{ row }">
            <span class="font-mono text-xs font-bold bg-gray-100 px-2 py-1 rounded border border-gray-200 text-gray-700">
              {{ row.code }}
            </span>
          </template>

          <template #cell-nom="{ row }">
            <span class="font-semibold text-gray-900">{{ row.nom }}</span>
          </template>

          <template #cell-description="{ row }">
            <span class="text-gray-500 text-sm truncate max-w-xs block">
              {{ row.description || 'Aucune description' }}
            </span>
          </template>

          <template #cell-actions="{ row }">
            <div class="flex justify-end">
              <button
                @click="ouvrirModalEdition(row)"
                class="text-indigo-600 hover:text-indigo-900 font-medium text-sm flex items-center gap-1"
              >
                ✏️ Modifier
              </button>
            </div>
          </template>
        </BaseTable>

        <BasePagination
          :current-page="pageCourante"
          :total-pages="totalPages"
          :total-elements="totalElements"
          @change-page="handlePageChange"
        />
      </template>

      <div v-else class="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
        <div class="text-gray-300 mb-2 text-5xl">📁</div>
        <h3 class="text-lg font-medium text-gray-900">Aucune catégorie trouvée</h3>
        <p class="text-gray-500 mt-1">Commencez par créer votre première catégorie d'articles.</p>
        <BaseButton variant="secondary" class="mt-4" @click="ouvrirModalCreation">
          Initialiser le catalogue
        </BaseButton>
      </div>
    </div>

    <BaseModal
      :isOpen="isModalFormOpen"
      :title="idCategorieEnEdition ? 'Modifier la catégorie' : 'Nouvelle catégorie'"
      @close="isModalFormOpen = false"
    >
      <form @submit.prevent="enregistrerCategorie" class="space-y-5">
        <div class="grid grid-cols-1 gap-4">
          <BaseInput
            v-model="formulaireCategorie.code"
            label="Code Interne *"
            placeholder="Ex: TISS-WAX"
            :disabled="!!idCategorieEnEdition"
            required
          />
          <p v-if="!idCategorieEnEdition" class="text-[10px] text-gray-400 -mt-3 pl-1">
            Ce code est unique et servira de préfixe à vos articles.
          </p>

          <BaseInput
            v-model="formulaireCategorie.nom"
            label="Nom affiché *"
            placeholder="Ex: Tissus Wax"
            required
          />

          <div class="flex flex-col space-y-1">
            <label class="text-sm font-medium text-gray-700">Description</label>
            <textarea
              v-model="formulaireCategorie.description"
              placeholder="Informations complémentaires..."
              class="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              rows="4"
            ></textarea>
          </div>
        </div>
      </form>

      <template #footer>
        <BaseButton variant="secondary" @click="isModalFormOpen = false">Annuler</BaseButton>
        <BaseButton variant="primary" @click="enregistrerCategorie" :isLoading="isSubmitting">
          {{ idCategorieEnEdition ? 'Enregistrer' : 'Ajouter' }}
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
