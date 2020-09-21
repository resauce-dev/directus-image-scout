import InterfaceComponent from './interface.vue';

export default {
    id: 'image-library',
    name: 'Image Library',
    description: 'Select images from an array of online image libraries',
    icon: 'image_search',
    component: InterfaceComponent,
    relationship: 'm2o',
    types: ['uuid'],
    recommendedDisplays: ['image']
}
