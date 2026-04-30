import { defineStore } from 'pinia'
import { catalogService} from '@/services/catalog-api/CategorieService'
import type { CategorieResponse, CategorieRequest } from '@/models/catalog-service-api'

export const useCategorieStore = defineStore('categories', {
  state: () => ({
    categories: [] as CategorieResponse[],
    totalElements: 0,
    loading: false,
    loaded: false // 🔥 cache intelligent
  }),

  getters: {

    // 🔍 Récupérer une catégorie par ID
    getById: (state) => {
      return (id: number) => state.categories.find(c => c.id === id)
    },

    // 📊 Nombre total
    count: (state) => state.categories.length,

    // 🧠 Exemple utile : tri alphabétique
    sortedCategories: (state) => {
      return [...state.categories].sort((a, b) => (a.nom ?? '').localeCompare(b.nom ?? ''))
    }
  },

  actions: {
    // 📦 Charger catégories
    async fetchCategories(page: number = 0, size: number = 100) {
      // 🔥 évite les appels inutiles
      if (this.loaded) return

      this.loading = true
      try {
        const data = await catalogService.getAllCategories(page, size)
        this.categories = data.content
        this.totalElements = data.totalElements
        this.loaded = true
      } finally {
        this.loading = false
      }
    },

    // 🔄 Forcer reload
    async reloadCategories(page: number = 0, size: number = 100) {
      this.loaded = false
      await this.fetchCategories(page, size)
    },

    // ➕ Création
    async createCategorie(request: CategorieRequest) {
      this.loading = true
      try {
        const created = await catalogService.createCategorie(request)

        // update local
        this.categories.unshift(created)

        return created
      } finally {
        this.loading = false
      }
    },

    // ✏️ Update
    async updateCategorie(id: number, request: CategorieRequest) {
      this.loading = true
      try {
        const updated = await catalogService.updateCategorie(id, request)

        const index = this.categories.findIndex(c => c.id === id)
        if (index !== -1) {
          this.categories[index] = updated
        }

        return updated
      } finally {
        this.loading = false
      }
    }

  }


})
