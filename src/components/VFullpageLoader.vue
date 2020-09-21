<template>
  <div class="v-loader">
    <v-progress-circular x-large indeterminate />
    <p><slot></slot></p>
  </div>
</template>

<script>
export default {
  name: 'v-fullpage-loader'
}
</script>

<style lang="scss" scoped>
.v-loader {
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
  z-index: 1;
}
.v-progress-circular {
  margin-bottom: 25px;
}
</style>