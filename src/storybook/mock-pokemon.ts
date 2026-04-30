import type { PokemonCardData } from '../@types/pokemonCard'

export const pokemonTypes = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'poison',
  'flying',
  'psychic',
  'rock',
  'ghost',
]

export const pokemonCards: PokemonCardData[] = [
  {
    id: 1,
    number: '#001',
    name: 'Bulbasaur',
    imageUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    types: ['grass', 'poison'],
    primaryType: 'grass',
    secondaryType: 'poison',
  },
  {
    id: 4,
    number: '#004',
    name: 'Charmander',
    imageUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    types: ['fire'],
    primaryType: 'fire',
  },
  {
    id: 7,
    number: '#007',
    name: 'Squirtle',
    imageUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
    types: ['water'],
    primaryType: 'water',
  },
  {
    id: 25,
    number: '#025',
    name: 'Pikachu',
    imageUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    types: ['electric'],
    primaryType: 'electric',
  },
  {
    id: 94,
    number: '#094',
    name: 'Gengar',
    imageUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png',
    types: ['ghost', 'poison'],
    primaryType: 'ghost',
    secondaryType: 'poison',
  },
  {
    id: 149,
    number: '#149',
    name: 'Dragonite',
    imageUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png',
    types: ['dragon', 'flying'],
    primaryType: 'dragon',
    secondaryType: 'flying',
  },
]

