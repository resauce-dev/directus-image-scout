<template>
  <div>
    <ris-image-preview
      v-if="previewImage"
      :image="previewImage"
      @close="previewImage = null"
      @keydown.esc.prevent="previewImage = null" />
    <div class="image-grid" v-if="images && images.length > 0">
      <ris-image
        v-for="(image, i) in images"
        :key="`${i}__${image.url_thumb}`"
        :image="image"
        :images-selected="imagesSelected"
        @preview="previewImage = image"
        @select="$emit('select', image)" />
    </div>
  </div>
</template>

<script>
import RISImagePreview from './RISImagePreview.vue';
import RISImage from './RISImage.vue'

export default {
  name: 'ris-image-grid',
  components: {
    'ris-image-preview': RISImagePreview,
    'ris-image': RISImage
  },
  props: {
    images: {
      type: Array,
      required: true
    },
    imagesSelected: {
      type: Array
    }
  },
  data() {
    return {
      previewImage: null
    }
  }
}
</script>

<style scoped>
.image-grid {
  column-count: 1;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (min-width: 600px) {
  .image-grid {
    column-count: 2;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .image-grid {
    column-count: 3;
  }
}
</style>
