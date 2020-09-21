<template>
  <div class="v-unsplash">
    
    <div class="display">
      <v-avatar class="v-avatar" x-large>
        <img v-if="value" :src="`/assets/${value}?key=system-small-cover`" />
        <v-icon class="v-icon" v-else name="image_search"></v-icon>
      </v-avatar>
      <v-button @click="isModalOpen=true" :outlined="true" :dashed="value?false:true" small>
        {{value ? 'Replace Image' : 'Browse Library'}}
      </v-button>
    </div>

    <v-modal class="v-modal" title="Unsplash Image Library" v-model="isModalOpen">

      <v-fullpage-loader v-if="processing">
        Please wait while we process your request...
      </v-fullpage-loader>

      <v-input class="search" v-model="search" placeholder="Search for image keywords..." @keyup.enter="getPhotos(search)">
        <template v-slot:append>
          <v-icon name="search"></v-icon>
        </template>
      </v-input>

      <div v-if="images && images.length > 0">
        <div class="image-grid" v-if="images && images.length > 0">
          <v-card v-for="(image, i) in images" :key="'image_'+i">
            <img :src="image.urls.thumb" :alt="image.alt_description">
            <div class="v-card-details">
              <v-card-title>
                Photo by&nbsp;<a :href="image.user.links.portfolio">{{image.user.name}}</a>
              </v-card-title>
              <v-card-subtitle v-if="image.alt_description">
                {{image.alt_description}}
              </v-card-subtitle>
              <v-chip-list 
                v-if="image.tags" 
                :chips="image.tags.map(item => item['title'])"
                @click="tag => getPhotos(tag)">
              </v-chip-list>
              <v-card-actions>
                <v-button class="button--select-image" icon rounded large @click="selectImage(image)">
                  <v-icon name="save_alt"></v-icon>
                </v-button>
              </v-card-actions>
            </div>
          </v-card>
        </div>

        <div class="v-paginator" v-if="total_pages && total_pages > 1">
          <v-pagination 
            v-model="current_page" 
            :length="total_pages" 
            :total-visible="5" 
            :show-first-last="true"
            @input="newPage => getPhotos(last_search_term, newPage)"></v-pagination>
        </div>

      </div>

      <div class="container" v-else>
        <v-info icon="image_search" title="No results" type="warning">
          Sorry, we couldn't retrieve any images for 
          you, please try to refine your search
        </v-info>
      </div>

    </v-modal>

  </div>
</template>

<script>
import VFullpageLoader from './components/VFullpageLoader.vue';
import VChipList from './components/VChipList.vue';

import apiUnsplash from './api/unsplash.js';
import apiDirectus from './api/directus.js';

export default {
  name: 'unsplash',
  components: {
    VFullpageLoader, 
    VChipList
  },
  mixins: [
    apiUnsplash,
    apiDirectus
  ],
  props: ['value'],
  data() {
    return {
      search: '',
      last_search_term: '',
      current_page: 1,
      isModalOpen: false,
      processing: false
    }
  },
  methods: {
    getPhotos(search_term, page=1) {
      if(!search_term) { this.images = null }
      this.search = search_term
      this.last_search_term = search_term
      this.current_page = page

      this.processing = true
      this.unsplashFetchPhotos(search_term, page)
        .then(() => this.processing = false)
    },
    selectImage(image) {
      this.processing = true
      this.directusImportImage(image.links.download)
        .then((data) => {
          this.processing = false
          this.$emit('input', data.data.id)
          this.isModalOpen = false
        })
    }
  },
  mounted() {
    this.processing = true
    this.unsplashFetchRandomPhotos()
      .then(() => this.processing = false)
  }
}
</script>

<style scoped lang="scss">

.display {
  display:flex;
}

.icon-search {
  color: var(--background-normal);
}

.button--select-image {
  --v-button-color: var(--primary-175);
  --v-button-color-hover: var(--primary);
  --v-button-background-color: var(--background-normal);
  --v-button-background-color-hover: var(--background-normal-alt);
}

.v-avatar {
  margin-right: var(--input-padding);
}

.v-modal {
  position: relative;
}

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

.search {
  margin-bottom: 25px;
}

.v-paginator {
  margin: 25px auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.v-pagination {
  margin: auto;
}

.image-grid {
  column-count: 3;
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
  background: #00000066;
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: var(--background-highlight);

  transition: 0.5s;
  opacity: 0;
  pointer-events: none;
}
.v-card:hover .v-card-details{
  transition: 0.5s;
  opacity: 1;
  pointer-events: all;
}

.v-card::v-deep .v-card-title {
  font-size: 14px!important;
  margin-top: 0!important;
  color: inherit;
}
.v-card::v-deep .v-card-subtitle {
  font-size: 12px!important;
  margin-top: calc(var(--v-card-padding) * -2);
  padding: var(--v-card-padding); /* This should be fixed in the component sometime... */
}
.v-card::v-deep .v-card-actions {
  justify-content: flex-start;
  padding: var(--v-card-padding);
  padding-top: calc(var(--v-card-padding) * -2);
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  height: calc(100% - 20%);
}
</style>
