import type {
  GetPokemonPageByTypesOptions,
  GetPokemonPageOptions,
  NamedApiResource,
  PokeApiPokemonDetail,
  PokeApiTypeResponse,
  PokemonListResponse,
  PokemonPage,
  PokemonTypeListResponse,
  SearchPokemonPageOptions,
} from '../@types/pokeAPI'
import type { PokemonCardData } from '../@types/pokemonCard'
import { POKE_API_BASE_URL } from '../constants/constants'
import { formatPokemonName, formatPokemonNumber } from '../lib/formatters'

let allPokemonResourcesCache: NamedApiResource[] | null = null
const typePokemonResourcesCache = new Map<string, NamedApiResource[]>()


async function fetchData<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

function mapPokemonDetailToCardData(
  data: PokeApiPokemonDetail,
): PokemonCardData {
  const types = [...data.types]
    .sort((a, b) => a.slot - b.slot)
    .map((entry) => entry.type.name)

  const imageUrl =
    data.sprites.front_default ??
    ''

  return {
    id: data.id,
    number: formatPokemonNumber(data.id),
    name: formatPokemonName(data.name),
    imageUrl,
    types,
    primaryType: types[0],
    secondaryType: types[1],
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length)
  let currentIndex = 0

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    async () => {
      while (currentIndex < items.length) {
        const index = currentIndex++
        results[index] = await mapper(items[index], index)
      }
    },
  )

  await Promise.all(workers)

  return results
}

function getOffsetFromUrl(url: string | null): number | null {
  if (!url) return null

  const parsedUrl = new URL(url)
  const offset = parsedUrl.searchParams.get('offset')

  return offset ? Number(offset) : null
}

function getPokemonIdFromUrl(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\/?$/)
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
}

function removeDuplicatePokemonResources(
  resources: NamedApiResource[],
): NamedApiResource[] {
  const resourceMap = new Map<string, NamedApiResource>()

  for (const resource of resources) {
    resourceMap.set(resource.name, resource)
  }

  return [...resourceMap.values()].sort(
    (a, b) => getPokemonIdFromUrl(a.url) - getPokemonIdFromUrl(b.url),
  )
}

async function getPokemonDetailsFromResources(
  resources: NamedApiResource[],
  signal?: AbortSignal,
): Promise<PokemonCardData[]> {
  return mapWithConcurrency(resources, 6, async (resource) => {
    const detail = await fetchData<PokeApiPokemonDetail>(resource.url, signal)
    return mapPokemonDetailToCardData(detail)
  })
}

export async function getPokemonTypes(
  signal?: AbortSignal,
): Promise<string[]> {
  const url = `${POKE_API_BASE_URL}/type`
  const response = await fetchData<PokemonTypeListResponse>(url, signal)

  return response.results
    .map((type) => type.name)
    .filter((type) => type !== 'unknown' && type !== 'shadow')
}

export async function getPokemonPage({
  limit = 24,
  offset = 0,
  signal,
}: GetPokemonPageOptions = {}): Promise<PokemonPage> {
  const listUrl = `${POKE_API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`

  const list = await fetchData<PokemonListResponse>(listUrl, signal)
  const pokemons = await getPokemonDetailsFromResources(list.results, signal)

  return {
    count: list.count,
    nextOffset: getOffsetFromUrl(list.next),
    previousOffset: getOffsetFromUrl(list.previous),
    pokemons,
  }
}

export async function getPokemonPageByTypes({
  types,
  limit = 24,
  offset = 0,
  signal,
}: GetPokemonPageByTypesOptions): Promise<PokemonPage> {
  if (types.length === 0) {
    return getPokemonPage({ limit, offset, signal })
  }

  const typeResponses = await Promise.all(
    types.map((type) => {
      const url = `${POKE_API_BASE_URL}/type/${type}`
      return fetchData<PokeApiTypeResponse>(url, signal)
    }),
  )

  const mergedResources = removeDuplicatePokemonResources(
    typeResponses.flatMap((typeResponse) =>
      typeResponse.pokemon.map((entry) => entry.pokemon),
    ),
  )

  const paginatedResources = mergedResources.slice(offset, offset + limit)
  const pokemons = await getPokemonDetailsFromResources(
    paginatedResources,
    signal,
  )

  const nextOffset =
    offset + limit < mergedResources.length ? offset + limit : null

  const previousOffset = offset - limit >= 0 ? offset - limit : null

  return {
    count: mergedResources.length,
    nextOffset,
    previousOffset,
    pokemons,
  }
}

function normalizeSearchQuery(query: string) {
  return query.trim().toLowerCase().replace(/\s+/g, ' ')
}

function matchesPokemonSearchQuery(
  resource: NamedApiResource,
  normalizedQuery: string,
) {
  const pokemonId = getPokemonIdFromUrl(resource.url)
  const pokemonIdText = String(pokemonId)
  const readableName = resource.name.replaceAll('-', ' ')

  return (
    resource.name.startsWith(normalizedQuery) ||
    readableName.startsWith(normalizedQuery) ||
    pokemonIdText === normalizedQuery ||
    pokemonIdText.startsWith(normalizedQuery)
  )
}
async function getAllPokemonResources(
  signal?: AbortSignal,
): Promise<NamedApiResource[]> {
  if (allPokemonResourcesCache) {
    return allPokemonResourcesCache
  }

  const url = `${POKE_API_BASE_URL}/pokemon?limit=100000&offset=0`
  const response = await fetchData<PokemonListResponse>(url, signal)

  allPokemonResourcesCache = removeDuplicatePokemonResources(response.results)

  return allPokemonResourcesCache
}

async function getPokemonResourcesByType(
  type: string,
  signal?: AbortSignal,
): Promise<NamedApiResource[]> {
  const cachedResources = typePokemonResourcesCache.get(type)

  if (cachedResources) {
    return cachedResources
  }

  const url = `${POKE_API_BASE_URL}/type/${type}`
  const response = await fetchData<PokeApiTypeResponse>(url, signal)

  const resources = removeDuplicatePokemonResources(
    response.pokemon.map((entry) => entry.pokemon),
  )

  typePokemonResourcesCache.set(type, resources)

  return resources
}

async function getPokemonResourcesByTypes(
  types: string[],
  signal?: AbortSignal,
): Promise<NamedApiResource[]> {
  if (types.length === 0) {
    return getAllPokemonResources(signal)
  }

  const resourcesByType = await Promise.all(
    types.map((type) => getPokemonResourcesByType(type, signal)),
  )

  return removeDuplicatePokemonResources(resourcesByType.flat())
}



export async function searchPokemonPage({
  query,
  types = [],
  limit = 24,
  offset = 0,
  signal,
}: SearchPokemonPageOptions): Promise<PokemonPage> {
  const normalizedQuery = normalizeSearchQuery(query)

  if (!normalizedQuery && types.length === 0) {
    return getPokemonPage({ limit, offset, signal })
  }

  if (!normalizedQuery && types.length > 0) {
    return getPokemonPageByTypes({ types, limit, offset, signal })
  }

  const resources = await getPokemonResourcesByTypes(types, signal)

  const matchingResources = resources.filter((resource) =>
    matchesPokemonSearchQuery(resource, normalizedQuery),
  )

  const paginatedResources = matchingResources.slice(offset, offset + limit)

  const pokemons = await getPokemonDetailsFromResources(
    paginatedResources,
    signal,
  )

  return {
    count: matchingResources.length,
    nextOffset:
      offset + limit < matchingResources.length ? offset + limit : null,
    previousOffset: offset - limit >= 0 ? offset - limit : null,
    pokemons,
  }
}
