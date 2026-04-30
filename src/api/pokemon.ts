import type { GetPokemonPageOptions, PokeApiPokemonDetail, PokemonListResponse, PokemonPage } from "../@types/pokeAPI";
import type { PokemonCardData } from "../@types/pokemonCard";
import { POKE_API_BASE_URL } from "../constants/constants";
import { formatPokemonName, formatPokemonNumber } from "../lib/formatters";

async function fetchData<T>(url: string, signal?: AbortSignal): Promise<T> {
    const response = await fetch(url, { signal });

    if(!response.ok){
        throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}


function mapPokemonDetailToCardData(data: PokeApiPokemonDetail): PokemonCardData {
    const types = [...data.types]
        .sort((a, b) => a.slot - b.slot)
        .map((entry)=> entry.type.name);
    
    const imageUrl = data.sprites.front_default ?? ''

    return{
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


export async function getPokemonPage({
  limit = 24,
  offset = 0,
  signal,
}: GetPokemonPageOptions = {}): Promise<PokemonPage> {
  const listUrl = `${POKE_API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`

  const list = await fetchData<PokemonListResponse>(listUrl, signal)

  const pokemon = await mapWithConcurrency(
    list.results,
    6,
    async (result) => {
      const detail = await fetchData<PokeApiPokemonDetail>(result.url, signal)
      return mapPokemonDetailToCardData(detail)
    },
  )

  return {
    count: list.count,
    nextOffset: getOffsetFromUrl(list.next),
    previousOffset: getOffsetFromUrl(list.previous),
    pokemons: pokemon,
  }
}