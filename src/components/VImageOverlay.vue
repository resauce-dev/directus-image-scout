<template>
  <v-overlay :active="image?true:false" @click="$emit('close',image)">
    <img class="image" :src="image.url_preview">
  </v-overlay>
</template>

<script>
export default {
  name: 'v-image-overlay',
  props: {
    image: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.image {
  max-height: 90vh;
  max-width: 90vw;
  height: auto;
  width: auto;
}
</style>