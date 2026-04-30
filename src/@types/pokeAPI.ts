import type { PokemonCardData } from "./pokemonCard";

export type NamedApiResource = {
    name: string;
    url: string;
}

export type PokemonListResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: NamedApiResource[];
}

export type PokeApiPokemonDetail = {
    id: number;
    name: string;
    sprites: {
        front_default: string;
    }
    types: Array<{
        slot: number;
        type: NamedApiResource;
    }>
}


export type PokemonPage = {
    count: number;
    nextOffset: number | null;
    previousOffset: number | null;
    pokemons: PokemonCardData[];
}

export type GetPokemonPageOptions = {
    limit?: number
    offset?: number;
    signal?: AbortSignal;
}

