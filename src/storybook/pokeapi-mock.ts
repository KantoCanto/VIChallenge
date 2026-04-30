import type { PokemonCardData } from '../@types/pokemonCard'
import { pokemonCards, pokemonTypes } from './mock-pokemon'

type PokemonResource = {
  name: string
  url: string
}

const POKEAPI_HOSTNAME = 'pokeapi.co'

let originalFetch: typeof window.fetch | undefined

export function installPokemonFetchMock() {
  originalFetch ??= window.fetch.bind(window)

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = getRequestUrl(input)

    if (url.hostname !== POKEAPI_HOSTNAME) {
      return originalFetch?.(input, init) ?? fetch(input, init)
    }

    if (init?.signal?.aborted) {
      throw new DOMException('The operation was aborted.', 'AbortError')
    }

    return new Response(JSON.stringify(getMockResponseBody(url)), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

function getRequestUrl(input: RequestInfo | URL) {
  if (input instanceof Request) {
    return new URL(input.url)
  }

  return new URL(String(input))
}

function getMockResponseBody(url: URL) {
  if (url.pathname === '/api/v2/type') {
    return {
      results: pokemonTypes.map((type) => ({
        name: type,
        url: `https://${POKEAPI_HOSTNAME}/api/v2/type/${type}`,
      })),
    }
  }

  if (url.pathname.startsWith('/api/v2/type/')) {
    const type = url.pathname.split('/').filter(Boolean).at(-1)

    return {
      pokemon: pokemonCards
        .filter((pokemon) => pokemon.types.includes(type ?? ''))
        .map((pokemon) => ({
          pokemon: getPokemonResource(pokemon.id),
        })),
    }
  }

  if (url.pathname === '/api/v2/pokemon') {
    return {
      count: pokemonCards.length,
      next: null,
      previous: null,
      results: pokemonCards.map((pokemon) => getPokemonResource(pokemon.id)),
    }
  }

  const pokemon = getPokemonByDetailUrl(url) ?? pokemonCards[0]

  return {
    id: pokemon.id,
    name: pokemon.name.toLowerCase(),
    sprites: {
      front_default: pokemon.imageUrl,
    },
    types: pokemon.types.map((type, index) => ({
      slot: index + 1,
      type: {
        name: type,
      },
    })),
  }
}

function getPokemonByDetailUrl(url: URL): PokemonCardData | undefined {
  const id = Number(url.pathname.match(/\/api\/v2\/pokemon\/(\d+)\/?$/)?.[1])
  return pokemonCards.find((card) => card.id === id)
}

function getPokemonResource(id: number): PokemonResource {
  return {
    name: String(id),
    url: `https://${POKEAPI_HOSTNAME}/api/v2/pokemon/${id}`,
  }
}
