
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ClientResponseDTO } from '@/models/customer-service-api'
import { clientApi } from '@/services/customer-api/ClientService'

export const useClientStore = defineStore('client', () => {
  const selectedClient = ref<ClientResponseDTO | null>(null)
  const isLoading = ref(false)

  // Action pour définir le client (quand on vient de la liste)
  function setSelectedClient(client: ClientResponseDTO) {
    selectedClient.value = client
  }

  // Action pour charger le client si le store est vide (cas du rafraîchissement F5)
  async function ensureClient(id: number) {
    if (selectedClient.value && selectedClient.value.id === id) {
      return // Le client est déjà là, rien à faire
    }

    isLoading.value = true
    try {
      const response = await clientApi.getClientById(id)
      selectedClient.value = response.data
    } catch (error) {
      console.error("Erreur lors de la récupération du client contextuel", error)
      selectedClient.value = null
    } finally {
      isLoading.value = false
    }
  }

  return {
    selectedClient,
    isLoading,
    setSelectedClient,
    ensureClient
  }
})
