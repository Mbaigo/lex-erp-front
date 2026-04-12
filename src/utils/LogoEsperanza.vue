<template>
  <svg viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" :style="{ width: size + 'px' }">
    <text x="400" y="150" text-anchor="middle" class="logo-monogram">E</text>
    <text x="400" y="260" text-anchor="middle" class="logo-title">ESPERANZA</text>
    <text x="400" y="320" text-anchor="middle" class="logo-subtitle">FASHION</text>
  </svg>
</template>

<script setup lang="ts">
defineProps({
  size: { type: [Number, String], default: 180 }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300&family=Playfair+Display:ital,wght@1,400&display=swap');

.logo-monogram {
  font-family: "Playfair Display", serif;
  font-size: 160px;
  fill: #e2c1b0; /* Rose gold doux */
  font-style: italic;
}
.logo-title {
  font-family: "Playfair Display", serif;
  font-size: 60px;
  letter-spacing: 12px;
  fill: #ffffff; /* Blanc pour le fond sombre */
}
.logo-subtitle {
  font-family: "Montserrat", sans-serif;
  font-size: 24px;
  letter-spacing: 20px;
  fill: #9ca3af; /* Gray-400 */
}
</style>
