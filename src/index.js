import InterfaceComponent from './interface.vue';

export default {
    id: 'unsplash',
    name: 'Unsplash Image',
    description: 'Select an image from the Unsplash image library',
    icon: 'image_search',
    component: InterfaceComponent,
    relationship: 'm2o',
    types: ['uuid'],
    recommendedDisplays: ['image']
}
