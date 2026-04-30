import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import "vue-toastification/dist/index.css";
import Toast, { POSITION, type PluginOptions } from "vue-toastification";
import './styles/main.css'


// Définition des options globales
const options: PluginOptions = {
    // Position sur l'écran
    position: POSITION.TOP_RIGHT,

    // Durée de visibilité (en millisecondes)
    timeout: 4000,

    // Fermer au clic
    closeOnClick: true,

    // Mettre en pause si l'utilisateur change d'onglet
    pauseOnFocusLoss: true,

    // Mettre en pause si la souris survole le toast
    pauseOnHover: true,

    // Afficher ou non la barre de progression en bas
    showCloseButtonOnHover: false,
    hideProgressBar: false,

    // Animation de fermeture
    draggable: true,
    draggablePercent: 0.6,

    // Style par défaut pour les icônes
    icon: true,

    // Transition (par défaut Vue transition)
    transition: "Vue-Toastification__bounce",

    // Nombre maximum de toasts affichés simultanément
    maxToasts: 5,

    // Les nouveaux toasts s'affichent au-dessus des anciens
    newestOnTop: true
};

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast, options) // On passe les options globales à Vue Toastification


app.mount('#app')
