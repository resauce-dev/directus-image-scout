<template>
  <div>
    <v-image-overlay v-if="overlayImage" :image="overlayImage" @close="overlayImage=null" />
    <div class="image-grid" v-if="images && images.length > 0">
      <v-card v-for="(image, i) in images" :key="`image_${image.url_thumb}`">
        <img :src="image.url_thumb" :alt="image.description">
        <div class="v-card-details">
          <div>
            <v-button class="action-button" x-small v-if="image.attribution" :href="image.attribution.url">
              <v-icon name="account_circle" class="action-button-icon"></v-icon>
              {{image.attribution.name}} 
            </v-button>
          </div>
          <div>
            <v-button class="action-button" x-small icon v-if="image.url_preview" @click="overlayImage=image">
              <v-icon name="zoom_in" />
            </v-button>
            <v-button class="action-button" x-small icon :disabled="!image.url_download" @click="$emit('selection', image)">
              <v-icon name="save_alt" />
            </v-button>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import VImageOverlay from './VImageOverlay.vue';

export default {
  name: 'v-image-grid',
  components: {
    VImageOverlay
  },
  props: {
    images: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      overlayImage: null,
    }
  }
}
</script>

<style lang="scss" scoped>
.image-grid {
  column-count: 3;
}

.action-button {
  padding: 0;
  min-width: 0;

  --v-button-color: #fff;
  --v-button-color-hover: #ffffff99;
  --v-button-color-activated: #ffffff99;
  --v-button-color-disabled: #ffffffaa;
  
  --v-button-background-color: transparent;
  --v-button-background-color-hover: transparent;
  --v-button-background-color-activated: transparent;
  --v-button-background-color-disabled: transparent;
}
.action-button::v-deep .button.x-small {
  padding: 0;
}
.action-button-icon {
  margin-right: 5px;
}

.container .v-card {
  --v-card-min-width: 0;
  --v-card-padding: 15px;
  --v-card-background-color: var(--background-normal);
  break-inside: avoid-column;
  margin-bottom: 5%;
  transition: 0.5s;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    vertical-align: middle;
    transition: 0.5s;
  }

  &:hover {
    transform: scale(0.975);
  }
}

.v-card-details {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background-image: linear-gradient(0, black -25%, transparent 75%);
  height: 100%;
  width: 100%;
  padding: calc(var(--v-card-padding) / 2);

  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  transition: 0.5s;
  opacity: 0;
  pointer-events: none;
}
.v-card:hover .v-card-details{
  transition: 0.5s;
  opacity: 1;
  pointer-events: all;
}
</style>