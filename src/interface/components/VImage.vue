<template>
  <v-card 
    :class="{
      'v-card--is-selected': isSelected
    }"
  >
    <img 
      :src="image.url_thumb" 
      :alt="image.description"
    >
    <div 
      class="card-hover-details" 
      :class="{'card-hover-details--active':isSelected}"
    >
      <div>
        <v-button class="btn-action" 
          x-small 
          v-if="image.attribution" 
          :href="image.attribution.url"
          :title="image.attribution.name"
        >
          <v-icon name="link" class="btn-action-icon" />
          <span class="attribution-link">{{image.attribution.name}}</span>
        </v-button>
      </div>
      <div>
        <v-button class="btn-action" 
          x-small icon 
          v-if="image.url_preview" 
          @click="$emit('preview', image)"
        >
          <v-icon name="zoom_in" />
        </v-button>
        <v-button class="btn-action" 
          x-small icon 
          :disabled="!image.url_download" 
          @click="$emit('select', image)"
        >
          <v-icon :name="isSelected?'check_circle':'radio_button_unchecked'" />
        </v-button>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'v-image',
  props: {
    image: {
      type: Object,
      required: true
    },
    imagesSelected: {
      type: Array
    }
  },
  computed: {
    isSelected() { return this.imagesSelected.includes(this.image.id) }
  }
}
</script>

<style lang="scss" scoped>
.btn-action {
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
.btn-action::v-deep .button.x-small {
  padding: 0;
}
.btn-action-icon {
  margin-right: 5px;
}

.attribution-link{
  max-width: 145px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.container .v-card {
  --checkerSize: 10px;
  --checkerColor: lightgrey;
  --checkerAltColor: var(--background-normal);
  
  background-image:
    linear-gradient(45deg, var(--checkerColor) 25%, transparent 25%), 
    linear-gradient(135deg, var(--checkerColor) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--checkerColor) 75%),
    linear-gradient(135deg, transparent 75%, var(--checkerColor) 75%);
  background-color: var(--checkerAltColor);
  
  background-size: 
    calc(2 * var(--checkerSize)) 
    calc(2 * var(--checkerSize));
  
  background-position: 
    0 0, 
    var(--checkerSize) 0, 
    var(--checkerSize) calc(-1 * var(--checkerSize)), 
    0px var(--checkerSize);
  
  /* for fun */
  transition-property: background-color, background-position, background-size;
  transition-duration: 1s;
}

.container .v-card {
  --v-card-min-width: 0;
  --v-card-padding: 15px;
  break-inside: avoid-column;
  margin-bottom: 5%;
  transition: 0.5s;
  position: relative;
  overflow: hidden;
  border-radius: var(--border-radius);

  img {
    width: 100%;
    height: auto;
    vertical-align: middle;
    transition: 0.5s;
    border-radius: 0!important;
  }

  &:hover {
    transform: scale(0.975);
  }
}

.card-hover-details {
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

  opacity: 0;
  pointer-events: none;
}
.card-hover-details--active,
.v-card:hover .card-hover-details{
  opacity: 1;
  pointer-events: all;
}

.v-card,
.v-card--is-selected,
.card-hover-details,
.v-card:hover .card-hover-details{
  transition: all 0.5s;
}
</style>