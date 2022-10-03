<template>
  <div class="v-resauce-image-scout">
    <div class="display">
      <v-avatar class="v-avatar" x-large>
        <img v-if="value" :src="`/assets/${value}?key=system-medium-cover&access_token=${user_access_token}`" />
        <v-icon v-else name="image_search"></v-icon>
      </v-avatar>
      <v-button @click="isModalOpen=true" :outlined="true" :dashed="value?false:true" small>
        {{value ? 'Replace Image' : 'Browse Images'}}
      </v-button>
    </div>
    <v-drawer 
      class="v-drawer" 
      title="Image Scout" 
      icon="image_search"
      v-model="isModalOpen"
      @cancel="isModalOpen = false"
    >
      <template #actions>
        <v-button
          @click="downloadSelected"
          icon
          rounded
          primary
          v-tooltip.bottom="'Save'"
        >
          <v-icon name="done" />
        </v-button>
      </template>
      <ris-fullpage-loader v-if="processing">
        Please wait while we process your request...
      </ris-fullpage-loader>
      <div class="drawer--content">
        <div class="drawer--search">
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
                item-value="key" 
                item-text="name"
                @input="search.length > 0 ? getPhotos(search, providerSelected) : getProviderFeaturedPhotos()"
              >
              </v-select>
            </div>
          </div>
          <p v-if="countOfPages" class="header-search-detail">
            {{providerLastSelected.name}} returned {{countOfImages.toLocaleString()}} results for "{{last_used_query}}" in {{request_time}} seconds
          </p>
        </div>
        
        <div class="drawer--images" v-if="images && images.length > 0">
          <ris-image-grid
            :images="images" 
            :images-selected="imagesSelected" 
            @select="image => selectImage(image)"
          />
          <div class="v-paginator" v-if="countOfPages && countOfPages > 1">
            <v-pagination 
              v-model="current_page" 
              :length="countOfPages" 
              :total-visible="5" 
              :show-first-last="true"
              @input="newPage => getPhotos(last_used_query, last_used_provider, newPage)"></v-pagination>
          </div>
          <p class="api-supplier">
            Image library powered by
            <a :href="providerLastSelected.url" target="_BLANK">{{providerLastSelected.name}}</a>
          </p>
        </div>
        <div class="container-error" v-else>
          <v-info icon="image_search" title="No results" type="warning">
            Sorry, we couldn't retrieve any images for 
            you, please try to refine your search
          </v-info>
        </div>
      </div>
    </v-drawer>

  </div>
</template>

<script>
import RISFullpageLoader from './components/RISFullpageLoader.vue';
import RISImageGrid from './components/RISImageGrid.vue';

import apiImageScout from './api/image-scout.js';

export default {
  name: 'resauce-image-scout',
  inject: ['api'],
  emits: ['input'],
  components: {
    'ris-fullpage-loader': RISFullpageLoader, 
    'ris-image-grid': RISImageGrid,
  },
  mixins: [
    apiImageScout
  ],
  props: ['value', 'type', 'group'],
  data() {
    return {
      search: '',
      last_used_query: '',
      last_used_provider: null,

      isModalOpen: false,
      processing: false,

      imagesSelected: [],

      images: null,
      countOfPages: null,
      countOfImages: null,
      current_page: 1,
      fetch_limit: 30,
      request_time: 0,
    }
  },
  computed: {
    providerLastSelected() { 
      return this.last_used_provider ? 
        this.providerList.find(i => i.key === this.last_used_provider) :
        this.providerList.find(i => i.key === this.providerSelected)
    },
    user_access_token() {
      return this.api.defaults.headers.Authorization.replace("Bearer ", '')
    }
  },
  methods: {
    selectImage(image) {
      // If only one, then only allow one item in the array, if more than one, then add to array.
      const imageId = image.id
      if(this.group === 'files') {
        if(this.imagesSelected.includes(imageId)) {
          this.imagesSelected.splice(this.imagesSelected.indexOf(imageId), 1)
        } else {
          this.imagesSelected.push(imageId)
        }
      } else { // single file
        if(this.imagesSelected.includes(imageId)) {
          this.imagesSelected = []
        } else {
          this.imagesSelected = []
          this.imagesSelected.push(imageId)
        }
      }
    },
    downloadSelected() {
      this.processing = true
      const image = this.images.find(i => i.id === this.imagesSelected[0]) // currently only downloading one image
      this.triggerDownload(image, this.user_access_token)
        .then(({data}) => {
          this.$emit('input', data.data.id)
          this.processing = false
          this.isModalOpen = false
        })
        .catch(err => console.warn('importing image failed'))
    },
    getPhotos(query, provider, page=1) {
      if(!query) { this.images = null }
      if(query.length < 1) { return this.getProviderFeaturedPhotos() }

      this.imagesSelected = [] // Reset selected images so as to not cause confusion

      this.search = this.last_used_query = query
      this.providerSelected = this.last_used_provider = provider
      this.current_page = page

      this.processing = true
      const timerStart = performance.now()
      this.getSearch(query, page)
        .then(({data}) => {
          this.countOfImages = data.countOfImages
          this.countOfPages = data.countOfPages
          this.images = data.images

          this.processing = false
          const timerEnd = performance.now()
          this.request_time = parseFloat((timerEnd-timerStart)/1000).toFixed(12)
        })
    },
    getProviderFeaturedPhotos() {
      this.processing = true
      this.getFeatured()
        .then(({data}) => {
          this.countOfImages = data.countOfImages
          this.countOfPages = data.countOfPages
          this.images = data.images

          this.processing = false
        })
    },
  },
  mounted() {
    this.getProviders().then(() => this.getProviderFeaturedPhotos())
  }
}
</script>

<style scoped>
.display {
  display:flex;
}
.v-avatar {
  margin-right: var(--input-padding);
}

/* Modal Stuff */
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

.v-drawer {
  position: relative;
}
.drawer--content {
  padding: var(--v-card-padding);
}

.ris-fullpage-loader {
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
  opacity: 0.95;
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

.drawer--images {
  margin: var(--v-card-padding) 0;
}
.container-error {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  height: calc(100vh - 30vh);
}
</style>
