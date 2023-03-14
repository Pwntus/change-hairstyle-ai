<template lang="pug">
main
  //- Hidden input
  input(
    @change="onFileSelected"
    type="file"
    ref="file"
    accept="image/*"
  )

  v-container

    //- Upload and configure
    v-row
      v-col(
        cols="12"
        md="6"
      )
        v-responsive.left-upload(
          @click="onClickUpload"
          :aspect-ratio="1"
        )
          template(v-if="image")
            .preview(:style="`background-image: url(${image})`")
          template(v-else)
            template(v-if="loading_file")
              v-progress-circular(
                color="secondary"
                :model-value="loading_file_pc"
                :size="64"
                :width="8"
              )
            template(v-else)
              v-icon(
                icon="mdi-upload"
                size="x-large"
              )
              .text-h6 Upload photo
      v-col(
        cols="12"
        md="6"
      )
        v-responsive.right-config(:aspect-ratio="1")
          v-select(
            v-model="hairstyle"
            :items="hairstyle_items"
            label="Style"
          )
          v-select(
            v-model="shade"
            :items="shade_items"
            label="Shade"
          )
          v-select(
            v-model="color"
            :items="color_items"
            label="Color"
          )
          v-btn(
            @click="submit"
            :disabled="!image"
            :loading="loading_submit"
            color="secondary"
            size="x-large"
            block flat rounded
          ) Create hairstyle

    //- List results
    v-row
      v-col(
        v-for="(item, index) in list"
        :key="`item-${index}`"
        cols="12"
      )
        ui-output(:output="item")
</template>

<script setup lang="ts">
// Imports
import { Upload } from 'upload-js'
import { hairstyle_items, shade_items, color_items } from '~/assets/configs'

// Modules
const runtimeConfig = useRuntimeConfig()
console.log('debug', runtimeConfig)

// Instances
const upload = Upload({
  apiKey: runtimeConfig.public.uploadApiKey
})

// State
const file = ref<null | HTMLInputElement>(null)
const image = ref<null | string>(null)
const hairstyle = ref('fade hairstyle')
const shade = ref('regular')
const color = ref('blonde')
const loading_file = ref(false)
const loading_file_pc = ref(0)
const loading_submit = ref(false)
const list: any[] = reactive([])

// Methods
const onClickUpload = () => {
  if (loading_file.value || loading_submit.value) return
  file.value?.click()
}

const onFileSelected = async (e: any) => {
  image.value = null
  loading_file.value = true
  loading_file_pc.value = 0
  try {
    const file = e.target.files[0]

    const { fileUrl } = await upload.uploadFile(file, {
      onProgress: ({ bytesSent, bytesTotal }) => {
        loading_file_pc.value = (bytesSent / bytesTotal) * 100
      },
      path: {
        // See path variables: https://upload.io/dashboard/docs/path-variables
        folderPath:
          '/uploads/changehairstyleai/{UTC_YEAR}/{UTC_MONTH}/{UTC_DAY}',
        fileName: '{UNIQUE_DIGITS_8}{ORIGINAL_FILE_EXT}'
      }
    })
    image.value = fileUrl
  } catch (e) {
    console.log(e)
  } finally {
    loading_file.value = false
  }
}

const submit = async () => {
  loading_submit.value = true
  try {
    const data = await $fetch('/api/generate', {
      method: 'post',
      body: {
        image: image.value,
        hairstyle: hairstyle.value,
        shade: shade.value,
        color: color.value
      }
    })
    console.log(data)
    list.unshift(data)
  } catch (e) {
    console.log(e)
  } finally {
    loading_submit.value = false
  }
}
</script>

<style lang="stylus" scoped>
main
  padding-top 64px

  input[type="file"]
    display none

  .v-container
    .left-upload
      background #e4e4e4
      text-align center
      border-radius 16px
      cursor pointer
      position relative
      display flex
      align-items center
      transition background 150ms ease-in-out

      .preview
        background-size cover
        background-position center
        position absolute
        bottom 0
        right 0
        left 0
        top 0

      .v-icon
        transition transform 150ms ease-in-out

      &:hover
        background #dddddd

        .v-icon
          transform translateY(-5px)

    .right-config
      .v-img
        max-width 150px
        margin 0 auto
</style>
