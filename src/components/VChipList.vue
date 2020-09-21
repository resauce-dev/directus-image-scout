<template>
  <div class="v-chip-list">
    <v-chip
      v-for="chip in chips" 
      :key="chip"
      x-small
      @click="$emit('click', chip)"
    >
      {{ chip }}
    </v-chip>
  </div>
</template>

<script>
export default {
  name: 'v-chip-list',
  props: {
    chips: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.v-chip-list {
  padding: var(--v-card-padding);
  padding-top: calc(var(--v-card-padding) * -2);
}
.v-chip-list::v-deep .v-chip {
  text-transform: capitalize;
  color: inherit;
  margin: 5px;
}
</style>