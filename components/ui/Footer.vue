<template lang="pug">
footer
  v-btn.pr-6(
    :size="size"
    :height="height"
    href="https://replicate.com"
    target="_new"
    color="#dcdcdc"
    flat rounded
  )
    img(src="/img/replicate.svg")
    | Replicate
  v-btn(
    :size="size"
    :height="height"
    href="https://vercel.com"
    target="_new"
    color="#dcdcdc"
    flat rounded
  ) ▲ Vercel
  v-btn(
    :size="size"
    :height="height"
    href="https://vuejs.org"
    target="_new"
    color="#dcdcdc"
    flat rounded
  )
    v-icon(icon="mdi-vuejs")
    | Vue
  v-spacer
  v-btn(
    :size="size"
    :height="height"
    href="https://twitter.com/PontusAurdal"
    target="_new"
    color="secondary"
    icon="mdi-twitter"
    flat
  )
  v-btn(
    :size="size"
    :height="height"
    href="https://github.com/Pwntus/change-hairstyle-ai"
    target="_new"
    color="black"
    icon="mdi-github"
    flat fab
  )
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

const size = computed(() => (mobile.value ? 'x-small' : 'small'))
const height = computed(() => (mobile.value ? '32px' : '40px'))
</script>

<style lang="stylus" scoped>
footer
  margin-top 64px
  padding 8px 8px 0
  background rgba(0, 0, 0, .04)
  border-radius 32px
  display flex
  flex-wrap wrap
  align-items center

  .v-btn
    margin 0 0 8px 8px

    &:first-child
      margin-left 0

    img
      margin 0 8px
      max-height 10px
</style>
