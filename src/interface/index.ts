import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
    id: 'resauce-image-scout',
    name: 'Image Scout',
    description: 'Search and use images from online libraries',
    icon: 'image_search',
    component: InterfaceComponent,
    options: null,
    types: ['uuid'],
    groups: ['file', 'files'],
    recommendedDisplays: ['image'],
})
