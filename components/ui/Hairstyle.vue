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
      v-col(cols="12")
        center(style="color:red;") The free service is unfortunately disabled. You can still clone this project and run it by yourself.
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
            @click="createPrediction"
            :disabled="!image || true"
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

    div(
      style="text-align:center;margin-top:60px;"
    )
      v-btn(
        href="https://shopduffelbag.com/?utm_campaign=changehairstyleai"
        target="_new"
        color="secondary"
        prepend-icon="mdi-shopping"
        variant="tonal"
        rounded="xl"
        size="large"
      )
        v-badge(
          content="shopduffelbag.com"
          color="black"
          offset-x="60"
          offset-y="-10"
          floating
        ) Need a quality travel bag?
</template>

<script setup lang="ts">
// Imports
import {
  hairstyle_items,
  shade_items,
  color_items
} from '~/assets/static/hair-config'

interface Prediction {
  id: string
  status: string
  output: string
  hairstyle: string
  shade: string
  color: string
}

// Modules
const runtimeConfig = useRuntimeConfig()

// State
const file = ref<null | HTMLInputElement>(null)
const image = ref<null | string>(null)
const hairstyle = ref('fade hairstyle')
const shade = ref('regular')
const color = ref('blonde')
const loading_file = ref(false)
const loading_file_pc = ref(0)
const loading_submit = ref(false)
const list: Prediction[] = reactive([])
let interval: null | NodeJS.Timer = null

// Computed
const processing = computed<Prediction[]>(() =>
  list.filter(
    (item) => item?.status === 'starting' || item?.status === 'processing'
  )
)

// Watcher
watch(processing, (list) => {
  if (list.length > 0) {
    if (interval) return

    // interval to read every processing prediction every 2s
    interval = setInterval(async () => {
      await Promise.all(processing.value.map((item) => readPrediction(item.id)))
    }, 2000)
  } else {
    if (interval) clearInterval(interval)
    interval = null
  }
})

// Methods
const getFileDimensions = (
  file: any
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const { width, height } = img
      URL.revokeObjectURL(img.src)
      resolve({ width, height })
    }
    img.src = url
  })
}

const calculateAspectRatioFit = (
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
) => {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)
  return { width: srcWidth * ratio, height: srcHeight * ratio }
}

const bmpToBlob = async (bmp: ImageBitmap): Promise<Blob | null> => {
  const canvas = document.createElement('canvas')
  canvas.width = bmp.width
  canvas.height = bmp.height
  const ctx = canvas.getContext('bitmaprenderer')
  if (!ctx) return null
  ctx.transferFromImageBitmap(bmp)
  const blob = await new Promise((res: BlobCallback) => canvas.toBlob(res))
  return blob
}

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

    // Get uploaded file dimensions
    const { width, height } = await getFileDimensions(file)

    // Resize image (max width/height 512/512)
    const { width: resizeWidth, height: resizeHeight } =
      calculateAspectRatioFit(width, height, 512, 512)
    const bmp = await createImageBitmap(file, {
      resizeWidth,
      resizeHeight
    })
    const blob = await bmpToBlob(bmp)
    if (!blob) throw new Error('Failed to create blob.')

    const reader = new FileReader()
    reader.onload = () => {
      image.value = String(reader.result)
    }
    reader.readAsDataURL(blob)
  } catch (e) {
    console.log(e)
  } finally {
    loading_file.value = false
  }
}

const createPrediction = async () => {
  loading_submit.value = true
  try {
    const data: Prediction = await $fetch('/api/create', {
      method: 'post',
      body: {
        image: image.value,
        hairstyle: hairstyle.value,
        shade: shade.value,
        color: color.value
      }
    })

    // Add response to beginning of list
    list.unshift({
      ...data,
      hairstyle: hairstyle.value,
      shade: shade.value,
      color: color.value
    })
  } catch (e) {
    console.log(e)
  } finally {
    loading_submit.value = false
  }
}

const readPrediction = async (id: string) => {
  try {
    const data: Prediction = await $fetch('/api/read', {
      method: 'post',
      body: {
        id
      }
    })

    // Patch response back to list
    const index = processing.value?.findIndex((item) => item?.id === id)
    if (index > -1) list[index] = { ...list[index], ...data }
  } catch (e) {
    console.log(e)
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
