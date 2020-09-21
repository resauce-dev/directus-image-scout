import InterfaceComponent from './interface.vue';

export default {
    id: 'search-image-library',
    name: 'Search Image Library',
    description: 'Pick images from an array of online image libraries',
    icon: 'image_search',
    component: InterfaceComponent,
    relationship: 'm2o',
    types: ['uuid'],
    recommendedDisplays: ['image']
}
