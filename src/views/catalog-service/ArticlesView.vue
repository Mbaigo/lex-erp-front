<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useArticleStore } from '@/stores/articleStore'
import { articleService } from '@/services/catalog-api/ArticleService'
import type { ArticleRequest, ArticleResponse } from '@/models/catalog-service-api'

import BaseTable from '@/components/ui/BaseTable.vue'
import BasePagination from '@/components/ui/BasePaginationView.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInputView.vue'
import { useCategorieStore } from '@/stores/useCategorieStore'

// --- STORES ---
const articleStore = useArticleStore()
const categorieStore = useCategorieStore()

// --- STATE ---
const pageCourante = ref(0)
const size = 10

const isModalOpen = ref(false)
const isSubmitting = ref(false)

// 🔥 STOCK MODAL
const isStockModalOpen = ref(false)
const typeOperation = ref<'ENTREE' | 'SORTIE'>('ENTREE')
const articleSelectionne = ref<ArticleResponse | null>(null)

const mouvement = ref({
  quantite: 1,
  prixUnitaire: 0,
  motif: '',
  dateOperation: new Date().toISOString().substring(0, 10),
})

const unites = ['METRE', 'PIECE', 'LITRE']

// --- TABLE ---
const colonnes = [
  { key: 'reference', label: 'Référence' },
  { key: 'designation', label: 'Désignation' },
  { key: 'stockInitial', label: 'Stock' },
  { key: 'prixUnitaire', label: 'Prix' },
  { key: 'uniteMesure', label: 'Unité' },
  { key: 'actions', label: '' },
]

// --- FORMULAIRE CREATION ---
const formulaire = ref<ArticleRequest>({
  reference: '',
  designation: '',
  stockInitial: 0,
  prixUnitaire: 0,
  seuilAlerte: 0,
  uniteMesure: null as string | null,
  categorieId: null as number | null,
  version: 0,
})

// --- LOAD ---
const chargerArticles = async (page = 0) => {
  pageCourante.value = page
  await articleStore.fetchArticles(page, size)
}

// --- MODAL CREATION ---
const ouvrirModal = () => {
  formulaire.value = {
    reference: '',
    designation: '',
    stockInitial: 0,
    prixUnitaire: 0,
    seuilAlerte: 0,
    uniteMesure: 'METRE',
    categorieId: null,
    version: 0,
  }
  isModalOpen.value = true
}

// --- SAVE ARTICLE ---
const enregistrer = async () => {
  if (!formulaire.value.uniteMesure || !formulaire.value.categorieId) {
    alert('Veuillez remplir tous les champs obligatoires')
    return
  }

  isSubmitting.value = true
  try {
    console.log('Enregistrement article', formulaire.value)
    await articleService.create(formulaire.value)
    await chargerArticles(pageCourante.value)
    isModalOpen.value = false
  } finally {
    isSubmitting.value = false
  }
}

// --- MODAL STOCK ---
const ouvrirModalStock = (article: ArticleResponse, type: 'ENTREE' | 'SORTIE') => {
  articleSelectionne.value = article
  typeOperation.value = type

  mouvement.value = {
    quantite: 1,
    prixUnitaire: 0,
    motif: '',
    dateOperation: new Date().toISOString().substring(0, 10),
  }

  isStockModalOpen.value = true
}

// --- VALIDATION STOCK ---
const validerMouvement = async () => {
  if (!articleSelectionne.value) return

  if (mouvement.value.quantite <= 0) {
    alert('Quantité invalide')
    return
  }

  if (
    typeOperation.value === 'SORTIE' &&
    mouvement.value.quantite > articleSelectionne.value.stockInitial
  ) {
    alert('Stock insuffisant')
    return
  }

  await articleStore.processStockMovement(
    articleSelectionne.value.reference,
    mouvement.value.quantite,
    typeOperation.value === 'SORTIE',
  )

  isStockModalOpen.value = false
}

// --- INIT ---
onMounted(async () => {
  await chargerArticles(0)
  await categorieStore.fetchCategories()
})
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border">
    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">📦 Articles</h1>
      <BaseButton variant="primary" @click="ouvrirModal"> + Nouvel</BaseButton>
    </div>

    <!-- TABLE -->
    <BaseTable :columns="colonnes" :data="articleStore.articles">
      <!-- STOCK -->
      <template #cell-stockInitial="{ row }">
        <span :class="row.enAlerte ? 'text-red-600 font-bold' : ''">
          {{ row.stockInitial }}
        </span>
      </template>

      <!-- ACTIONS -->
      <template #cell-actions="{ row }">
        <div class="flex gap-2 justify-end">
          <BaseButton @click="ouvrirModalStock(row, 'ENTREE')">➕</BaseButton>
          <BaseButton variant="danger" @click="ouvrirModalStock(row, 'SORTIE')">➖</BaseButton>
        </div>
      </template>
    </BaseTable>

    <!-- PAGINATION -->
    <BasePagination
      :current-page="pageCourante"
      :total-pages="Math.ceil(articleStore.totalElements / size)"
      :total-elements="articleStore.totalElements"
      @change-page="chargerArticles"
    />
  </div>

  <!-- MODAL CREATION -->
  <BaseModal :isOpen="isModalOpen" title="Créer un article" @close="isModalOpen = false">
    <form class="space-y-4">
      <BaseInput v-model="formulaire.reference" label="Référence" />
      <BaseInput v-model="formulaire.designation" label="Désignation" />

      <div class="grid grid-cols-2 gap-4">
        <BaseInput v-model.number="formulaire.stockInitial" type="number" label="Stock" />
        <BaseInput v-model.number="formulaire.prixUnitaire" type="number" label="Prix unitaire" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <BaseInput v-model.number="formulaire.seuilAlerte" type="number" label="Seuil alerte" />

        <!-- UNITE -->
        <div>
          <label class="text-sm font-medium">Unité</label>
          <select v-model="formulaire.uniteMesure" class="w-full border p-2 rounded">
            <option disabled value="">Sélectionner</option>
            <option v-for="u in unites" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>
      </div>

      <!-- CATEGORIE -->
      <div>
        <label class="text-sm font-medium">Catégorie</label>
        <select v-model="formulaire.categorieId" class="w-full border p-2 rounded">
          <option disabled value="">Sélectionner</option>
          <option v-for="c in categorieStore.categories" :key="c.id" :value="c.id">
            {{ c.nom }}
          </option>
        </select>
      </div>
    </form>

    <template #footer>
      <BaseButton variant="secondary" @click="isModalOpen = false">Annuler</BaseButton>
      <BaseButton variant="primary" @click="enregistrer" :isLoading="isSubmitting">
        Enregistrer
      </BaseButton>
    </template>
  </BaseModal>

  <!-- MODAL STOCK -->
  <BaseModal
    :isOpen="isStockModalOpen"
    :title="typeOperation === 'ENTREE' ? 'Approvisionnement' : 'Déstockage'"
    @close="isStockModalOpen = false"
  >
    <form class="space-y-4">
      <BaseInput v-model.number="mouvement.quantite" type="number" label="Quantité" />
      <BaseInput v-model.number="mouvement.prixUnitaire" type="number" label="Prix unitaire" />
      <BaseInput v-model="mouvement.motif" label="Motif" />
      <BaseInput v-model="mouvement.dateOperation" type="date" label="Date opération" />
    </form>

    <template #footer>
      <BaseButton variant="secondary" @click="isStockModalOpen = false"> Annuler </BaseButton>

      <BaseButton variant="primary" @click="validerMouvement"> Valider </BaseButton>
    </template>
  </BaseModal>
</template>
