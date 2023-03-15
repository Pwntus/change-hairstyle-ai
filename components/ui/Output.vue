<template lang="pug">
section
  template(v-if="isSuccess")
    .text-h5 {{ props.output?.hairstyle }}, {{ props.output?.shade }} {{ props.output?.color }}
    img(:src="props.output.output || ''")
  template(v-else-if="isFail")
    .text-h5 Something failed. Try again.
  template(v-else)
    .pa-4
      v-progress-circular(
        :size="64"
        :width="8"
        color="secondary"
        indeterminate
      )
      .text-h5.pt-4
        | {{ props.output?.status }}
        span  (may take 3 minutes)...
</template>

<script setup lang="ts">
const props = defineProps(['output'])
const isSuccess = computed(() => props.output.status === 'succeeded')
const isFail = computed(() => props.output.status === 'failed')
</script>

<style lang="stylus" scoped>
section
  padding 16px
  background #fff
  text-align center
  border-radius 16px
  box-shadow 0 10px 35px -5px rgba(0, 0, 0, 6%) !important

  img
    max-width 100%
    margin-top 16px

  .text-h5
    font-weight 400
    text-transform capitalize !important

    span
      text-transform none !important
</style>
