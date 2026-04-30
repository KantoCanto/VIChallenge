import type { PokemonCardData } from './pokemonCard'

export type NamedApiResource = {
  name: string
  url: string
}

export type PokemonListResponse = {
  count: number
  next: string | null
  previous: string | null
  results: NamedApiResource[]
}

export type PokemonTypeListResponse = {
  count: number
  next: string | null
  previous: string | null
  results: NamedApiResource[]
}

export type PokeApiTypeResponse = {
  id: number
  name: string
  pokemon: Array<{
    slot: number
    pokemon: NamedApiResource
  }>
}

export type PokeApiPokemonDetail = {
  id: number
  name: string
  sprites: {
    front_default: string | null
  }
  types: Array<{
    slot: number
    type: NamedApiResource
  }>
}

export type PokemonPage = {
  count: number
  nextOffset: number | null
  previousOffset: number | null
  pokemons: PokemonCardData[]
}

export type GetPokemonPageOptions = {
  limit?: number
  offset?: number
  signal?: AbortSignal
}

export type GetPokemonPageByTypesOptions = {
  types: string[]
  limit?: number
  offset?: number
  signal?: AbortSignal
}

export type SearchPokemonPageOptions = {
  query: string
  types?: string[]
  limit?: number
  offset?: number
  signal?: AbortSignal
}