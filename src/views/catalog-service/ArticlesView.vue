<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useArticleStore } from '@/stores/articleStore'
import { useStockMovementStore } from '@/stores/stockMovementStore'
import { useCategorieStore } from '@/stores/useCategorieStore'
import { articleService } from '@/services/catalog-api/ArticleService'
import type { ArticleRequest, ArticleResponse } from '@/models/catalog-service-api'
import type { TypeMovementEnum } from '@/models/stockMovement'

import BaseTable from '@/components/ui/BaseTable.vue'
import BasePagination from '@/components/ui/BasePaginationView.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseInput from '@/components/ui/BaseInputView.vue'

// --- STORES ---
const articleStore = useArticleStore()
const stockMovementStore = useStockMovementStore()
const categorieStore = useCategorieStore()

// --- STATE GLOBALE ---
const pageCourante = ref(0)
const size = 5
// Variables pour la pagination
//const totalElements = ref(0)

const isModalOpen = ref(false)
const isSubmitting = ref(false)

// --- STATE STOCK MODAL ---
const isStockModalOpen = ref(false)
const typeOperation = ref<TypeMovementEnum>('ENTREE') // Piloté par le select du modal
const articleSelectionne = ref<ArticleResponse | null>(null)

const mouvement = ref({
  quantite: 1,
  prixUnitaire: 0,
  motif: '',
  dateOperation: new Date().toISOString().substring(0, 10),
})

// --- STATE HISTORIQUE MODAL ---
const isHistoryModalOpen = ref(false)
const historyPage = ref(0)
const historySize = 5

const unites = ['METRE', 'PIECE', 'LITRE']

// --- TABLES COLONNES ---
const colonnes = [
  { key: 'reference', label: 'Référence' },
  { key: 'designation', label: 'Désignation' },
  { key: 'stockActuel', label: 'Stock Actuel' },
  { key: 'stockInitial', label: 'Stock Initial' },
  { key: 'enAlerte', label: 'En Alerte' },
  { key: 'prixUnitaire', label: 'Prix' },
  { key: 'uniteMesure', label: 'Unité' },
  { key: 'actions', label: '' },
]

const colonnesHistorique = [
  { key: 'dateOperation', label: 'Date' },
  { key: 'type', label: 'Type' },
  { key: 'quantite', label: 'Qté' },
  { key: 'stockAvantOperation', label: 'Avant' },
  { key: 'stockApresOperation', label: 'Après' },
  { key: 'motif', label: 'Motif' },
]

// --- FORMULAIRE CREATION ---
const formulaire = ref<ArticleRequest>({
  reference: '',
  designation: '',
  stockInitial: 0,
  prixUnitaire: 0,
  seuilAlerte: 0,
  uniteMesure: '' as string,
  categorieId: 0,
  version: 0,
})

// --- LOAD ARTICLES ---
const chargerArticles = async (page: number) => {
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
    categorieId: 0,
    version: 0,
  }
  isModalOpen.value = true
}

const enregistrer = async () => {
  if (!formulaire.value.uniteMesure || !formulaire.value.categorieId) {
    alert('Veuillez remplir tous les champs obligatoires')
    return
  }

  isSubmitting.value = true
  try {
    await articleService.create(formulaire.value)
    await chargerArticles(pageCourante.value)
    isModalOpen.value = false
  } finally {
    isSubmitting.value = false
  }
}

// --- MODAL STOCK ---
const ouvrirModalStock = (article: ArticleResponse) => {
  articleSelectionne.value = article
  console.log('Article sélectionné pour mouvement :', article.id)
  typeOperation.value = 'ENTREE' // Par défaut à l'ouverture, modifiable dans le formulaire

  mouvement.value = {
    quantite: 1,
    prixUnitaire: 0,
    motif: '',
    dateOperation: new Date().toISOString().substring(0, 10),
  }

  isStockModalOpen.value = true
}

const validerMouvement = async () => {
  if (!articleSelectionne.value) return

  if (mouvement.value.quantite <= 0) {
    alert('Quantité invalide')
    return
  }

  // La validation de stock s'adapte automatiquement si l'utilisateur sélectionne 'SORTIE'
  if (
    typeOperation.value === 'SORTIE' &&
    mouvement.value.quantite > articleSelectionne.value.stockActuel
  ) {
    alert('Stock insuffisant pour effectuer ce déstockage')
    return
  }

  isSubmitting.value = true
  try {
    await stockMovementStore.processStockMovement({
      articleId: articleSelectionne.value.id,
      quantite: mouvement.value.quantite,
      type: typeOperation.value, // Transmet la valeur sélectionnée (ENTREE ou SORTIE)
      prixUnitaire: mouvement.value.prixUnitaire > 0 ? mouvement.value.prixUnitaire : undefined,
      motif: mouvement.value.motif || undefined,
      dateOperation: mouvement.value.dateOperation || undefined,
    })

    // Rafraîchir la liste pour voir les stocks mis à jour suite au calcul glissant du backend
    await chargerArticles(pageCourante.value)
    isStockModalOpen.value = false
  } finally {
    isSubmitting.value = false
  }
}

// --- MODAL HISTORIQUE ---
const chargerHistorique = async (page = 0) => {
  if (!articleSelectionne.value) return
  historyPage.value = page
  await stockMovementStore.fetchArticleHistory(articleSelectionne.value.id, page, historySize)
}

const ouvrirModalHistorique = async (article: ArticleResponse) => {
  articleSelectionne.value = article
  isHistoryModalOpen.value = true
  await chargerHistorique(0)
}

// --- INIT ---
onMounted(async () => {
  await chargerArticles(0)
  await categorieStore.fetchCategories()
})
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">📦 Articles</h1>
      <BaseButton variant="primary" @click="ouvrirModal"> + Nouvel</BaseButton>
    </div>

    <BaseTable :columns="colonnes" :data="articleStore.articles">
      <template #cell-stockActuel="{ row }">
        <span>
          {{ row.stockActuel }}
        </span>
      </template>

      <template #cell-stockInitial="{ row }">
        <span>{{ row.stockInitial }}</span>
      </template>

      <template #cell-enAlerte="{ row }">
        <span
          :class="row.stockActuel <= row.seuilAlerte ? 'text-red-600 font-bold' : 'text-gray-500'"
        >
          {{ row.stockActuel <= row.seuilAlerte ? '⚠️ Oui' : '✅ Non' }}
        </span>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex gap-2 justify-end">
          <BaseButton @click="ouvrirModalStock(row)" title="Nouveau mouvement">➕</BaseButton>
          <BaseButton
            variant="secondary"
            @click="ouvrirModalHistorique(row)"
            title="Voir l'historique"
            >📜</BaseButton
          >
        </div>
      </template>
    </BaseTable>

    <BasePagination
      :current-page="pageCourante"
      :total-pages="articleStore.totalPages"
      :total-elements="articleStore.totalElements"
      @change-page="chargerArticles"
    />
  </div>

  <BaseModal
    v-if="isModalOpen"
    :isOpen="isModalOpen"
    title="Créer un article"
    @close="isModalOpen = false"
  >
    <form class="space-y-4">
      <BaseInput v-model="formulaire.reference" label="Référence" />
      <BaseInput v-model="formulaire.designation" label="Désignation" />

      <div class="grid grid-cols-2 gap-4">
        <BaseInput v-model.number="formulaire.stockInitial" type="number" label="Stock initial" />
        <BaseInput v-model.number="formulaire.prixUnitaire" type="number" label="Prix unitaire" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <BaseInput v-model.number="formulaire.seuilAlerte" type="number" label="Seuil alerte" />

        <div>
          <label class="text-sm font-medium">Unité</label>
          <select v-model="formulaire.uniteMesure" class="w-full border p-2 rounded">
            <option disabled value="">Sélectionner</option>
            <option v-for="u in unites" :key="u" :value="u">{{ u }}</option>
          </select>
        </div>
      </div>

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

  <BaseModal
    v-if="isStockModalOpen"
    :isOpen="isStockModalOpen"
    :title="typeOperation === 'ENTREE' ? 'Mouvement : Approvisionnement' : 'Mouvement : Déstockage'"
    @close="isStockModalOpen = false"
  >
    <form class="space-y-4">
      <div>
        <label class="text-sm font-medium block mb-1"
          >Type de mouvement <span class="text-red-500">*</span></label
        >
        <select
          v-model="typeOperation"
          class="w-full border p-2 rounded bg-gray-50 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="ENTREE">🟢 Approvisionnement</option>
          <option value="SORTIE">🔴 Déstockage</option>
        </select>
      </div>

      <BaseInput v-model.number="mouvement.quantite" type="number" label="Quantité" />

      <BaseInput
        v-if="typeOperation === 'ENTREE'"
        v-model.number="mouvement.prixUnitaire"
        type="number"
        label="Prix unitaire d'achat (Optionnel)"
      />

      <BaseInput v-model="mouvement.motif" label="Motif (Optionnel)" />
      <BaseInput v-model="mouvement.dateOperation" type="date" label="Date opération" />
    </form>

    <template #footer>
      <BaseButton variant="secondary" @click="isStockModalOpen = false"> Annuler </BaseButton>
      <BaseButton variant="primary" @click="validerMouvement" :isLoading="isSubmitting">
        Valider
      </BaseButton>
    </template>
  </BaseModal>

  <BaseModal
    v-if="isHistoryModalOpen"
    :isOpen="isHistoryModalOpen"
    :title="`Historique des mouvements - ${articleSelectionne?.designation}`"
    @close="isHistoryModalOpen = false"
  >
    <div v-if="stockMovementStore.loading" class="text-center py-4 text-gray-500">
      Chargement de l'historique...
    </div>

    <div v-else class="space-y-4">
      <BaseTable :columns="colonnesHistorique" :data="stockMovementStore.movements">
        <template #cell-type="{ row }">
          <span
            class="px-2 py-1 text-xs font-semibold rounded-full"
            :class="
              row.type === 'ENTREE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            "
          >
            {{ row.type }}
          </span>
        </template>

        <template #cell-motif="{ row }">
          <span class="text-gray-500 text-sm">{{ row.motif || '-' }}</span>
        </template>
      </BaseTable>

      <BasePagination
        v-if="stockMovementStore.totalElements > 0"
        :current-page="historyPage"
        :total-pages="Math.ceil(stockMovementStore.totalElements / historySize)"
        :total-elements="stockMovementStore.totalElements"
        @change-page="chargerHistorique"
      />
      <div v-else class="text-center text-sm text-gray-500 py-2">
        Aucun mouvement enregistré pour cet article.
      </div>
    </div>

    <template #footer>
      <BaseButton variant="secondary" @click="isHistoryModalOpen = false"> Fermer </BaseButton>
    </template>
  </BaseModal>
</template>
