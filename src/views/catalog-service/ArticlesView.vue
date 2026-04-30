<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useArticleStore } from '@/stores/articleStore'
import type {
  ArticleRequest,
  ArticleResponse,
} from '@/models/catalog-service-api'

import BaseTable from '@/components/ui/BaseTable.vue'
import BasePagination from '@/components/ui/BasePaginationView.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInputView.vue'
import { useCategorieStore } from '@/stores/useCategorieStore'

// --- STORE ---
const articleStore = useArticleStore()

// --- STATE ---
const pageCourante = ref(0)
const size = 10

const isModalOpen = ref(false)
const isSubmitting = ref(false)

const categorieStore = useCategorieStore()

const unites = ['METRE', 'PIECE', 'LITRE']

// --- TABLE ---
const colonnes = [
  { key: 'reference', label: 'Référence' },
  { key: 'designation', label: 'Désignation' },
  { key: 'quantiteEnStock', label: 'Stock' },
  { key: 'prixAchat', label: 'Prix' },
  { key: 'uniteMesure', label: 'Unité' },
  { key: 'actions', label: '' },
]

// --- FORMULAIRE ---
const formulaire = ref<ArticleRequest>({
  reference: '',
  designation: '',
  quantiteEnStock: 0,
  prixAchat: 0,
  seuilAlerte: 0,
  uniteMesure: '',
  categorieId: null as number | null,
  version: 0,
})

// --- LOAD ---
const chargerArticles = async (page = 0) => {
  pageCourante.value = page
  await articleStore.fetchArticles(page, size)
}



// --- MODAL ---
const ouvrirModal = () => {
  formulaire.value = {
    reference: '',
    designation: '',
    quantiteEnStock: 0,
    prixAchat: 0,
    seuilAlerte: 0,
    uniteMesure: '',
    categorieId: null as number | null,
    version: 0,
  }
  isModalOpen.value = true
}

// --- SAVE ---
const enregistrer = async () => {
  isSubmitting.value = true
  try {
    await articleStore.$patch(async (state) => {
      const created = await import('@/services/catalog-api/ArticleService').then((m) =>
        m.articleService.create(formulaire.value),
      )

      state.articles.unshift(created)
    })

    isModalOpen.value = false
  } finally {
    isSubmitting.value = false
  }
}

// --- STOCK ---
const incrementerStock = (article: ArticleResponse) => {
  articleStore.processStockMovement(article.reference, 1, false)
}

const decrementerStock = (article: ArticleResponse) => {
  articleStore.processStockMovement(article.reference, 1, true)
}

// --- LIFECYCLE ---
onMounted(async () => {
  await chargerArticles(0)
  categorieStore.fetchCategories()
})
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border">
    <!-- HEADER -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">📦 Articles</h1>
      <BaseButton variant="primary" @click="ouvrirModal"> + Nouvel article </BaseButton>
    </div>

    <!-- TABLE -->
    <BaseTable :columns="colonnes" :data="articleStore.articles">
      <!-- STOCK avec alerte -->
      <template #cell-quantiteEnStock="{ row }">
        <span :class="row.enAlerte ? 'text-red-600 font-bold' : ''">
          {{ row.quantiteEnStock }}
        </span>
      </template>

      <!-- ACTIONS -->
      <template #cell-actions="{ row }">
        <div class="flex gap-2 justify-end">
          <BaseButton variant="secondary" @click="incrementerStock(row)"> ➕ </BaseButton>

          <BaseButton variant="secondary" @click="decrementerStock(row)"> ➖ </BaseButton>
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

  <!-- MODAL -->
  <BaseModal :isOpen="isModalOpen" title="Créer un article" @close="isModalOpen = false">
    <form class="space-y-4">
      <BaseInput v-model="formulaire.reference" label="Référence" />
      <BaseInput v-model="formulaire.designation" label="Désignation" />

      <div class="grid grid-cols-2 gap-4">
        <BaseInput v-model="formulaire.quantiteEnStock" type="number" label="Stock" />
        <BaseInput v-model="formulaire.prixAchat" type="number" label="Prix achat" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <BaseInput v-model="formulaire.seuilAlerte" type="number" label="Seuil alerte" />

        <!-- UNITE -->
        <div>
          <label class="text-sm font-medium">Unité</label>
          <select v-model="formulaire.uniteMesure" class="w-full border p-2 rounded">
            <option value="">Sélectionner</option>
            <option v-for="u in unites" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>
      </div>

      <!-- CATEGORIE -->
      <select v-model="formulaire.categorieId" class="w-full border p-2 rounded">
        <option disabled value="">Sélectionner une catégorie</option>

        <option v-for="c in categorieStore.categories" :key="c.id" :value="c.id">
          {{ c.nom }}
        </option>
      </select>
    </form>

    <template #footer>
      <BaseButton variant="secondary" @click="isModalOpen = false"> Annuler </BaseButton>

      <BaseButton variant="primary" @click="enregistrer" :isLoading="isSubmitting">
        Enregistrer
      </BaseButton>
    </template>
  </BaseModal>
</template>
