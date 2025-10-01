import { Provider } from './classes/Provider'
import { UnsplashProvider } from './providers/unsplash'
import { PixabayProvider } from './providers/pixabay'
import { PexelsProvider } from './providers/pexels'
import { GiphyProvider } from './providers/giphy'

// List of all provider classes
const allProviders: ReadonlyArray<new () => Provider> = [
  UnsplashProvider,
  PixabayProvider,
  PexelsProvider,
  GiphyProvider,
]

// Instantiate all providers
const providers: Provider[] = allProviders.map((ProviderClass) => new ProviderClass())

// Move default provider to the front
const defaultKey = process.env.RIS_DEFAULT_PROVIDER?.toUpperCase()
providers.sort((a, b) => (a.key === defaultKey ? -1 : b.key === defaultKey ? 1 : 0))

export default providers
