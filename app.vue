<template lang="pug">
v-app
  v-main
    v-container
      ui-header
      ui-hero
      ui-hairstyle
      ui-footer
</template>

<script setup lang="ts">
const title = 'Change Hairstyle AI'
const description = 'Get a new hairstyle in seconds.'
const image = 'https://changehairstyleai.com/cover.jpg'

useServerSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogType: 'website',
  ogSiteName: title,
  ogImage: image,
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: image,
  twitterCreator: 'pontusaurdal'
})
</script>

<style lang="stylus" scoped>
.v-application
  background radial-gradient(80% 130% at 50% -30%, rgba(0, 0, 0, .15) 0, rgba(0, 0, 0, 0) 100%)

  .v-container
    max-width 1000px
</style>
