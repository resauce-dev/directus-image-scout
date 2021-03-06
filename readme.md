# Image Scout

## What is Image Scout?

Image Scout is an interface extension for Directus 9 developed by Resauce. A clean interface is provided allowing you to search multiple online image libraries to find images that suit your needs. When a provider is configured, the connection should be seamless, allowing you to easily find and use the image that you want or need in your project.

### Here's what image-scout looks like!

![Picture of the interface](./docs/interface.jpg)


## What's a provider?

A provider is an online service that allows you to view and download images for use in your own project. The providers we have are listed below, to enable them, you must register an API key with the service then store that key in your Envrionment File. 

If you have multiple providers enabled, you can decide which provider you would like to be the default provider by setting the `RIS_DEFAULT_PROVIDER` in your envrionemnt file

### Pixabay

Provider Key: `PIXABAY`

Directus ENV Configuration Key: `API_KEY_PIXABAY`

API Registration: https://pixabay.com/api/docs/


### Unsplash

Provider Key: `UNSPLASH`

Directus ENV Configuration Key: `API_KEY_UNSPLASH`

API Registration: https://unsplash.com/developers


### Giphy

Provider Key: `GIPHY`

Directus ENV Configuration Key: `API_KEY_GIPHY`

API Registration: https://developers.giphy.com/docs/api/

### Pexels

Provider Key: `PEXELS`

Directus ENV Configuration Key: `API_KEY_PEXELS`

API Registration: https://www.pexels.com/api/

> Note: An approved account will be required to be able to download high-res images. Please have your account approved otherwise you may not be able to download images.

## Configuring Image Scout on your server

Copy the folders from this repository's `dist` directory into your extensions folder
- `/extensions/interfaces/resauce-image-scout
- `/extensions/endpoints/resauce-image-scout

To enable a provider for your users to use, add a key-pair to the environment file with an API key and the frontend will automatically enable that provider for use, the available key-pairs are listed below.

### Envrionment Variables

| Env Example | Description |
| --- | --- |
| API_KEY_UNSPLASH='QW1QW1' | The key you configured to use the Unsplash API |
| API_KEY_PEXELS='AS2AS2' | The key you configured to use the Pexels API |
| API_KEY_PIXABAY='ZX3ZX3' | The key you configured to use the Pixabay API |
| API_KEY_GIPHY='PO4PO4' | The key you configured to use the Giphy API |
| RIS_DEFAULT_PROVIDER='UNSPLASH' | The key of the provider you would like used as default |
| RIS_REQUIRED_AUTH=false | Set to false to use this API externally without needing Directus authentication |

## Configuring Image Scout in your collection

To enable Image Scout as field in your application, follow this process:

1. Head to the settings of the collection you'd like Image Scout on
2. Create a new files field
3. Call the column whatever you'd like (feature_image?)
4. Fill out any of the other fields of your own accord
5. Under "Interface" select `Image Scout`
6. Under "Display" select `Image` as the display.

## Liability

Before activating any provider, ensure you have agreed to their terms and usage policy. You are subject to their usage terms based on how you use these images. No contributor to this repository accepts responsibility for the use of the images. 