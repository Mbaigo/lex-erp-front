import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import localforage from 'localforage'

// Configuration de la base de données locale du navigateur
localforage.config({
  name: 'LexCoutureERP',
  storeName: 'brouillons_modeles' // La "table"
})

export function useOfflineStorage() {
  // 1. DÉTECTION DU TERMINAL
  const { width } = useWindowSize()

  // On considère comme Mobile/Tablette tout écran inférieur à 1024px (Breakpoint 'lg' de Tailwind)
  const isMobileOrTablet = computed(() => width.value < 1024)

  // 2. FONCTION DE SAUVEGARDE LOCALE
  const sauvegarderBrouillon = async (cle: string, donnees: any) => {
    if (isMobileOrTablet.value) {
      try {
        await localforage.setItem(cle, donnees)
        console.log(`💾 Brouillon [${cle}] sauvegardé localement sur la tablette.`)
      } catch (erreur) {
        console.error("Erreur lors de la sauvegarde locale :", erreur)
      }
    }
  }

  // 3. FONCTION DE RÉCUPÉRATION
  const recupererBrouillon = async (cle: string) => {
    try {
      const donnees = await localforage.getItem(cle)
      return donnees
    } catch (erreur) {
      return null
    }
  }

  // 4. FONCTION DE NETTOYAGE
  const supprimerBrouillon = async (cle: string) => {
    await localforage.removeItem(cle)
  }

  return {
    isMobileOrTablet,
    sauvegarderBrouillon,
    recupererBrouillon,
    supprimerBrouillon
  }
}
