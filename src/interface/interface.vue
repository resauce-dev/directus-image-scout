<template>
  <div :class="{'is-processing':processing}" class="v-resauce-image-scout">
    <div class="display">
      <v-avatar class="v-avatar" x-large>
        <img v-if="value" :src="`/assets/${value}?key=system-small-cover&access_token=${user_access_token}`" />
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
      <v-fullpage-loader v-if="processing">
        Please wait while we process your request...
      </v-fullpage-loader>
      <div class="drawer--content">
        <div class="drawer--search processing-blur">
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
        
        <div class="drawer--images processing-blur" v-if="images && images.length > 0">
          <v-image-grid :images="images" @selection="image => selectImage(image)"></v-image-grid>
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
import VFullpageLoader from './components/VFullpageLoader.vue';
import VImageGrid from './components/VImageGrid.vue';

import apiImageScout from './api/image-scout.js';
import apiDirectus from './api/directus.js';

export default {
  name: 'resauce-image-scout',
  components: {
    VFullpageLoader, 
    VImageGrid,
  },
  mixins: [
    apiImageScout,
    apiDirectus
  ],
  props: ['value'],
  data() {
    return {
      search: '',
      last_used_query: '',
      last_used_provider: null,

      isModalOpen: false,
      processing: false,

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
      return this.system.api.defaults.headers.Authorization.replace("Bearer ", '')
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
    getPhotos(query, provider, page=1) {
      if(!query) { this.images = null }
      if(query.length < 1) { return this.getProviderFeaturedPhotos() }

      this.search = this.last_used_query = query
      this.providerSelected = this.last_used_provider = provider
      this.current_page = page

      this.processing = true
      const timerStart = performance.now()
      this.getSearch(query, page)
        .then(({data}) => {
          console.log(data, 'search')
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
          console.log(data, 'featured')
          this.countOfImages = data.countOfImages
          this.countOfPages = data.countOfPages
          this.images = data.images


          this.processing = false
        })
    }
  },
  mounted() {
    this.getProviders().then(() => this.getProviderFeaturedPhotos())
  }
}
</script>

<style scoped lang="scss">
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

.is-processing .processing-blur {
  filter: blur(3px)
}

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
  z-index: 1;
  opacity: 0.85;
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