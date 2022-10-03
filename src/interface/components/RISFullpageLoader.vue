<template>
  <div class="v-fullpage-loader">
    <v-progress-circular x-large indeterminate />
    <p>
      <slot></slot>
    </p>
  </div>
</template>

<script>
export default {
  name: 'ris-fullpage-loader'
}
</script>

<style scoped>
.v-fullpage-loader {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--background-normal);
  z-index: 10;
}

.v-progress-circular {
  margin-bottom: var(--v-card-padding);
}
</style>
