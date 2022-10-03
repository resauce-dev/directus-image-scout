import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
  id: 'resauce-image-scout',
  name: 'Image Scout',
  icon: 'image_search',
  description: 'Search and use images from online libraries',
  component: InterfaceComponent,
  options: null,
  types: ['uuid'],
  localTypes: ['file', 'files'],
  group: 'relational',
  recommendedDisplays: ['image'],
  relational: true,
})
