<template>
  <div class="v-search-image-library">
    
    <div class="display">
      <v-avatar class="v-avatar" x-large>
        <img v-if="value" :src="`/assets/${value}?key=system-small-cover`" />
        <v-icon class="v-icon" v-else name="image_search"></v-icon>
      </v-avatar>
      <v-button @click="isModalOpen=true" :outlined="true" :dashed="value?false:true" small>
        {{value ? 'Replace Image' : 'Browse Images'}}
      </v-button>
    </div>

    <v-image-overlay 
      v-if="overlayImage" 
      :image="overlayImage" 
      @close="overlayImage=null"
    >
    </v-image-overlay>

    <v-modal class="v-modal" title="Search Image Library" v-model="isModalOpen">

      <v-fullpage-loader v-if="processing">
        Please wait while we process your request...
      </v-fullpage-loader>

      <div>
        <div class="header-search-area">
          <v-input 
            v-model="search"
            class="header-search--bar" 
            placeholder="Search for image keywords..." 
            @keyup.enter="getPhotos(search, providerSelected)"
          >
            <template v-slot:append>
              <v-icon name="search"></v-icon>
            </template>
          </v-input>
          <div class="header-search--provider">
            <v-select 
              v-model="providerSelected" 
              :items="providerList" 
              @input="search.length > 0 ? getPhotos(search, providerSelected) : getProviderFeaturedPhotos()"
            >
            </v-select>
          </div>
        </div>
        <p v-if="countOfPages" class="header-search-detail">
          {{providerLastSelected.text}} returned {{countOfImages.toLocaleString()}} results for "{{last_used_search_term}}" in {{request_time}} seconds
        </p>
      </div>
      
      <div class="image-container" v-if="images && images.length > 0">
        <div class="image-grid" v-if="images && images.length > 0">
          <v-card v-for="(image, i) in images" :key="`image_${image.url_thumb}`">
            <img :src="image.url_thumb" :alt="image.description">
            <div class="v-card-details">
              <div>
                <v-button class="action-button" x-small 
                  v-if="image.attribution"
                  :href="image.attribution.url"
                >
                  <v-icon name="account_circle" class="action-button-icon"></v-icon>
                  {{image.attribution.name}} 
                </v-button>
              </div>
              <div>
                <v-button class="action-button" x-small icon
                  :disabled="!image.url_download" 
                  @click="selectImage(image)"
                >
                  <v-icon name="save_alt"></v-icon>
                </v-button>
                <v-button class="action-button" x-small icon
                  v-if="image.url_preview"
                  @click="overlayImage=image"
                >
                  <v-icon name="zoom_in"></v-icon>
                </v-button>
              </div>
            </div>
          </v-card>
        </div>

        <div class="v-paginator" v-if="countOfPages && countOfPages > 1">
          <v-pagination 
            v-model="current_page" 
            :length="countOfPages" 
            :total-visible="5" 
            :show-first-last="true"
            @input="newPage => getPhotos(last_used_search_term, last_used_provider, newPage)"></v-pagination>
        </div>
        
        <p class="api-supplier">
          Image library powered by
          <a :href="providerLastSelected.url" target="_BLANK">{{providerLastSelected.text}}</a>
        </p>

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
import VImageOverlay from './components/VImageOverlay.vue';
import VChipList from './components/VChipList.vue';

import providerUnsplash from './api/providers/unsplash.js';
import providerPixabay from './api/providers/pixabay.js';
import providerPexels from './api/providers/pexels.js';
import providerGiphy from './api/providers/giphy.js';
import providerBase from './api/providers/base.js';
import apiDirectus from './api/directus.js';

export default {
  name: 'search-image-library',
  components: {
    VFullpageLoader, 
    VImageOverlay,
    VChipList,
  },
  mixins: [
    providerUnsplash,
    providerPixabay,
    providerPexels,
    providerGiphy,
    providerBase,
    apiDirectus
  ],
  props: ['value'],
  data() {
    return {
      overlayImage: null,
      search: '',
      last_used_search_term: '',
      last_used_provider: null,
      current_page: 1,
      isModalOpen: false,
      processing: false,

      images: null,
      countOfPages: null,
      countOfImages: null,
      fetch_limit: 30,
      request_time: 0,
    }
  },
  computed: {
    providerLastSelected() { 
      return this.last_used_provider ? 
        this.providerList.find(i => i.value === this.last_used_provider) :
        this.providerList.find(i => i.value === this.providerSelected)
    }
  },
  methods: {
    selectImage(image) {
      this.processing = true
      this.directusImportImage(image)
        .then((data) => {
          this.processing = false
          this.$emit('input', data.data.id)
          this.isModalOpen = false
        })
    },
    getPhotos(search_term, provider, page=1) {
      if(!search_term) { this.images = null }
      if(search_term.length < 1) { return this.getProviderFeaturedPhotos() }

      this.search = this.last_used_search_term = search_term
      this.providerSelected = this.last_used_provider = provider
      this.current_page = page

      this.processing = true
      const timerStart = performance.now()
      this.getSearch(search_term, page)
        .then(() => {
          this.processing = false
          const timerEnd = performance.now()
          this.request_time = parseFloat((timerEnd-timerStart)/1000).toFixed(12)
        })
    },
    getProviderFeaturedPhotos() {
      this.processing = true
      this.getFeatured()
        .then(() => this.processing = false)
    }
  },
  mounted() {
    this.getProviderFeaturedPhotos()
  }
}
</script>

<style scoped lang="scss">

.display {
  display:flex;
}

.api-supplier {
  text-align: center;
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: calc(var(--v-card-padding) * 2);
}

.icon-search {
  color: var(--background-normal);
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
  margin-bottom: var(--v-card-padding);
}

.header-search-area {
  display: flex;
}
.header-search-detail {
  font-size: 10px;
  color: var(--border-normal-alt);
}
.header-search--provider {
  min-width: 25%;
  margin-left: 15px;
}

.v-paginator {
  margin: var(--v-card-padding) auto;
  margin-top: calc(var(--v-card-padding) * 2);
  display: flex;
  justify-content: center;
  align-items: center;
}
.v-pagination {
  margin: auto;
}

.image-container {
  margin: var(--v-card-padding) 0;
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

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  height: calc(100% - 20%);
}
</style>
