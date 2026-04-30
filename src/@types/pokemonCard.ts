export type PokemonCardData = {
    id: number
    number: string;
    name: string;
    imageUrl: string;
    types: string[];
    primaryType: string;
    secondaryType?: string;
}