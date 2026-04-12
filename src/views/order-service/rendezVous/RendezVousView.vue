<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import BaseTable from '@/components/ui/BaseTable.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()

// 1. ÉCOUTE DE L'URL : On lit le paramètre (journalier, semaine, ou mois)
const periodeActuelle = computed(() => (route.params.periode as string) || 'journalier')

// 2. TITRE DYNAMIQUE : S'adapte à la période choisie
const titrePage = computed(() => {
  const titres: Record<string, string> = {
    journalier: '☀️ Planning du Jour',
    semaine: '🗓️ Planning de la Semaine',
    mois: '🌙 Planning du Mois',
  }
  return titres[periodeActuelle.value] || 'Planning des Rendez-vous'
})

// 3. CONFIGURATION DU TABLEAU (BaseTable)
const colonnes = [
  { key: 'dateHeure', label: 'Date & Heure' },
  { key: 'client', label: 'Client' },
  { key: 'motif', label: 'Motif' },
  { key: 'statut', label: 'Statut' },
  { key: 'actions', label: '' },
]

// 4. LES DONNÉES TEMPORAIRES (Mock)
const tousLesRendezVous = ref([
  {
    id: 1,
    dateHeure: "Aujourd'hui - 10:00",
    client: 'Sophie Martin',
    motif: 'Prise de mesures (Robe)',
    statut: 'Confirmé',
    tag: 'journalier',
  },
  {
    id: 2,
    dateHeure: "Aujourd'hui - 14:30",
    client: 'Marc Dubois',
    motif: 'Essayage (Costume)',
    statut: 'En attente',
    tag: 'journalier',
  },
  {
    id: 3,
    dateHeure: 'Mercredi - 09:00',
    client: 'Julie Leroy',
    motif: 'Retrait commande',
    statut: 'Confirmé',
    tag: 'semaine',
  },
  {
    id: 4,
    dateHeure: 'Vendredi - 16:00',
    client: 'Alice Morel',
    motif: 'Nouveau modèle',
    statut: 'Confirmé',
    tag: 'semaine',
  },
  {
    id: 5,
    dateHeure: 'Le 24 du mois - 11:00',
    client: 'Lucas Petit',
    motif: 'Retouches',
    statut: 'À reconfirmer',
    tag: 'mois',
  },
])

// 5. LE FILTRE MAGIQUE 🪄
// À chaque clic dans le menu, cette fonction recalcule les lignes à afficher !
const rendezVousFiltres = computed(() => {
  if (periodeActuelle.value === 'journalier') {
    return tousLesRendezVous.value.filter((r) => r.tag === 'journalier')
  }
  if (periodeActuelle.value === 'semaine') {
    // La semaine inclut aujourd'hui + les autres jours de la semaine
    return tousLesRendezVous.value.filter((r) => r.tag === 'journalier' || r.tag === 'semaine')
  }
  // Si c'est 'mois', on affiche tout
  return tousLesRendezVous.value
})
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">{{ titrePage }}</h1>
        <p class="text-gray-500 text-sm mt-1">Gérez les disponibilités de l'atelier</p>
      </div>
      <BaseButton variant="primary">+ Nouveau RDV</BaseButton>
    </div>

    <BaseTable :columns="colonnes" :data="rendezVousFiltres">
      <template #cell-statut="{ row }">
        <span
          class="px-3 py-1 rounded-full text-xs font-semibold"
          :class="{
            'bg-green-100 text-green-800': row.statut === 'Confirmé',
            'bg-amber-100 text-amber-800': row.statut === 'En attente',
            'bg-red-100 text-red-800': row.statut === 'À reconfirmer',
          }"
        >
          {{ row.statut }}
        </span>
      </template>

      <template #cell-actions="{ row }">
        <button class="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Détails</button>
      </template>
    </BaseTable>
  </div>
</template>
