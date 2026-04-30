export type PokemonTypeTheme = {
  background: string
  text: string
}

export const POKEMON_TYPE_THEMES: Record<string, PokemonTypeTheme> = {
  normal: {
    background: 'var(--pokemon-type-normal-bg)',
    text: 'var(--pokemon-type-normal-text)',
  },
  fire: {
    background: 'var(--pokemon-type-fire-bg)',
    text: 'var(--pokemon-type-fire-text)',
  },
  water: {
    background: 'var(--pokemon-type-water-bg)',
    text: 'var(--pokemon-type-water-text)',
  },
  electric: {
    background: 'var(--pokemon-type-electric-bg)',
    text: 'var(--pokemon-type-electric-text)',
  },
  grass: {
    background: 'var(--pokemon-type-grass-bg)',
    text: 'var(--pokemon-type-grass-text)',
  },
  ice: {
    background: 'var(--pokemon-type-ice-bg)',
    text: 'var(--pokemon-type-ice-text)',
  },
  fighting: {
    background: 'var(--pokemon-type-fighting-bg)',
    text: 'var(--pokemon-type-fighting-text)',
  },
  poison: {
    background: 'var(--pokemon-type-poison-bg)',
    text: 'var(--pokemon-type-poison-text)',
  },
  ground: {
    background: 'var(--pokemon-type-ground-bg)',
    text: 'var(--pokemon-type-ground-text)',
  },
  flying: {
    background: 'var(--pokemon-type-flying-bg)',
    text: 'var(--pokemon-type-flying-text)',
  },
  psychic: {
    background: 'var(--pokemon-type-psychic-bg)',
    text: 'var(--pokemon-type-psychic-text)',
  },
  bug: {
    background: 'var(--pokemon-type-bug-bg)',
    text: 'var(--pokemon-type-bug-text)',
  },
  rock: {
    background: 'var(--pokemon-type-rock-bg)',
    text: 'var(--pokemon-type-rock-text)',
  },
  ghost: {
    background: 'var(--pokemon-type-ghost-bg)',
    text: 'var(--pokemon-type-ghost-text)',
  },
  dragon: {
    background: 'var(--pokemon-type-dragon-bg)',
    text: 'var(--pokemon-type-dragon-text)',
  },
  dark: {
    background: 'var(--pokemon-type-dark-bg)',
    text: 'var(--pokemon-type-dark-text)',
  },
  steel: {
    background: 'var(--pokemon-type-steel-bg)',
    text: 'var(--pokemon-type-steel-text)',
  },
  fairy: {
    background: 'var(--pokemon-type-fairy-bg)',
    text: 'var(--pokemon-type-fairy-text)',
  },
}

export const FALLBACK_POKEMON_TYPE_THEME: PokemonTypeTheme = {
  background: 'var(--pokemon-type-fallback-bg)',
  text: 'var(--pokemon-type-fallback-text)',
}