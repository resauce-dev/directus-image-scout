<template>
  <v-overlay 
    :active="image?true:false" 
    @click="$emit('close',image)" 
  >
    <img class="image" :src="image.url_preview">
  </v-overlay>
</template>

<script>
export default {
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
  max-height: 91vh;
  max-width: 90vw;
  height: auto;
  width: auto;
}
</style>