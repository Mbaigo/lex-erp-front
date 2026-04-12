<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
// Tes imports Axios ou API ici...
import BaseTable from '../../components/ui/BaseTable.vue'
import BasePagination from '../../components/ui/BasePaginationView.vue'

const route = useRoute()

// 1. Les états réactifs pour stocker la réponse de Spring Boot
const commandes = ref([])
const pageCourante = ref(0) // On démarre à la page 0 (Spring)
const totalPages = ref(0)
const totalElements = ref(0)
const isLoading = ref(false)

// 2. La fonction d'appel API
const chargerCommandes = async (numeroPage = 0) => {
  isLoading.value = true
  try {
    // Axios construit l'URL : /api/v1/commandes?statut=EN_CONFECTION&page=0&size=10
    const reponse = await api.get('/commandes', {
      params: {
        statut: route.params.statut, // ex: 'EN_CONFECTION' depuis l'URL
        page: numeroPage,
        size: 10 // Tu peux figer ça ou le rendre dynamique
      }
    })

    // On peuple nos variables avec le JSON de Spring Data
    commandes.value = reponse.data.content
    pageCourante.value = reponse.data.number
    totalPages.value = reponse.data.totalPages
    totalElements.value = reponse.data.totalElements

  } catch (error) {
    console.error("Erreur de chargement", error)
  } finally {
    isLoading.value = false
  }
}

// 3. Réagir aux clics de la pagination
const changerPage = (nouvellePage: number) => {
  chargerCommandes(nouvellePage)
}

// 4. Réagir au changement de menu (ex: passer de Créées à En Confection)
watch(() => route.params.statut, () => {
  // Si on change de rubrique, on repasse obligatoirement à la page 0 !
  chargerCommandes(0)
})

// Au lancement de la page
onMounted(() => chargerCommandes(0))
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Commandes</h1>

    <BaseTable :columns="[{key: 'id', label: 'N°'}, {key: 'client', label: 'Client'}]" :data="commandes" />

    <BasePagination
      :current-page="pageCourante"
      :total-pages="totalPages"
      :total-elements="totalElements"
      @change-page="changerPage"
    />
  </div>
</template>
