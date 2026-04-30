import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'

import './landing-page'
import { pokemonCards, pokemonTypes } from '../../storybook/mock-pokemon'

type PokemonResource = {
  name: string
  url: string
}

type LandingPageStoryArgs = {
  headline: string
}

function installPokemonFetchMock() {
  const originalFetch = window.fetch.bind(window)

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(String(input))

    if (url.hostname !== 'pokeapi.co') {
      return originalFetch(input, init)
    }

    if (init?.signal?.aborted) {
      throw new DOMException('The operation was aborted.', 'AbortError')
    }

    const responseBody = getMockResponseBody(url)

    return new Response(JSON.stringify(responseBody), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

function getMockResponseBody(url: URL) {
  if (url.pathname === '/api/v2/type') {
    return {
      results: pokemonTypes.map((type) => ({
        name: type,
        url: `https://pokeapi.co/api/v2/type/${type}`,
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

  const id = Number(url.pathname.match(/\/api\/v2\/pokemon\/(\d+)\/?$/)?.[1])
  const pokemon = pokemonCards.find((card) => card.id === id) ?? pokemonCards[0]

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

function getPokemonResource(id: number): PokemonResource {
  return {
    name: String(id),
    url: `https://pokeapi.co/api/v2/pokemon/${id}`,
  }
}

const meta = {
  title: 'Screens/Landing Page',
  component: 'landing-page',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  render: ({ headline }) => {
    installPokemonFetchMock()

    return html`<landing-page headline=${headline}></landing-page>`
  },
  argTypes: {
    headline: {
      control: 'text',
    },
  },
  args: {
    headline: 'Monster Catalog',
  },
} satisfies Meta<LandingPageStoryArgs>

export default meta
type Story = StoryObj<LandingPageStoryArgs>

export const Catalog: Story = {}
