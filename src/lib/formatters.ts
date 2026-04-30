export function formatPokemonName(name: string): string {
    return name
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

export function formatPokemonNumber(id: number): string {
  return `#${String(id).padStart(3, '0')}`
}