import InterfaceComponent from './interface.vue';

export default {
    id: 'resauce-image-scout',
    name: 'Image Scout',
    description: 'Search and use images from online libraries',
    icon: 'image_search',
    component: InterfaceComponent,
    relationship: 'm2o',
    types: ['uuid'],
    recommendedDisplays: ['image']
}
