// src/components/pokemon-card.ts

import { LitElement, css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import type { PokemonCardData } from '../../../@types/pokemonCard'
type PokemonTypeTheme = {
  background: string
  text: string
}

const TYPE_THEMES: Record<string, PokemonTypeTheme> = {
  normal: { background: '#A8A77A', text: '#111827' },
  fire: { background: '#EE8130', text: '#111827' },
  water: { background: '#6390F0', text: '#ffffff' },
  electric: { background: '#F7D02C', text: '#111827' },
  grass: { background: '#7AC74C', text: '#111827' },
  ice: { background: '#96D9D6', text: '#111827' },
  fighting: { background: '#C22E28', text: '#ffffff' },
  poison: { background: '#A33EA1', text: '#ffffff' },
  ground: { background: '#E2BF65', text: '#111827' },
  flying: { background: '#A98FF3', text: '#111827' },
  psychic: { background: '#F95587', text: '#111827' },
  bug: { background: '#A6B91A', text: '#111827' },
  rock: { background: '#B6A136', text: '#111827' },
  ghost: { background: '#735797', text: '#ffffff' },
  dragon: { background: '#6F35FC', text: '#ffffff' },
  dark: { background: '#705746', text: '#ffffff' },
  steel: { background: '#B7B7CE', text: '#111827' },
  fairy: { background: '#D685AD', text: '#111827' },
}

const FALLBACK_TYPE_THEME: PokemonTypeTheme = {
  background: '#E5E7EB',
  text: '#111827',
}

@customElement('pokemon-card')
export class PokemonCard extends LitElement {
  @property({ attribute: false })
  pokemon?: PokemonCardData

  render() {
    if (!this.pokemon) {
      return nothing
    }

    const { id, number, name, imageUrl, types } = this.pokemon
    const headingId = `pokemon-card-title-${id}`

    return html`
      <article class="card" aria-labelledby=${headingId}>
        <p class="number" aria-label=${`Pokémon number ${number}`}>
          ${number}
        </p>

        <div class="image-wrapper">
          ${imageUrl
            ? html`
                <img
                  class="image"
                  src=${imageUrl}
                  alt=${`${name} official artwork`}
                  loading="lazy"
                  decoding="async"
                />
              `
            : html`
                <div class="image fallback-image" role="img" aria-label=${`${name} artwork unavailable`}>
                  ?
                </div>
              `}
        </div>

        <footer class="footer">
          <h2 id=${headingId} class="name">${name}</h2>

          <ul class="types" aria-label=${`${name} types`}>
            ${types.map((type) => this.renderTypeBadge(type))}
          </ul>
        </footer>
      </article>
    `
  }

  private renderTypeBadge(type: string) {
    const normalizedType = type.toLowerCase()
    const theme = TYPE_THEMES[normalizedType] ?? FALLBACK_TYPE_THEME
    const label = this.formatTypeName(type)

    return html`
      <li
        class="type"
        style=${styleMap({
          '--type-bg': theme.background,
          '--type-text': theme.text,
        })}
      >
        ${label}
      </li>
    `
  }

  private formatTypeName(type: string) {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  static styles = css`
    :host {
      display: block;
      content-visibility: auto;
      contain-intrinsic-size: 260px;
    }

    .card {
      position: relative;
      display: grid;
      grid-template-rows: auto 1fr auto;
      min-height: 260px;
      padding: 16px;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      background: #ffffff;
      box-shadow: 0 8px 24px rgb(15 23 42 / 8%);
      overflow: hidden;
    }

    .number {
      justify-self: start;
      margin: 0;
      padding: 4px 8px;
      border-radius: 999px;
      background: #f3f4f6;
      color: #4b5563;
      font-size: 0.8rem;
      font-weight: 700;
      line-height: 1;
      letter-spacing: 0.03em;
    }

    .image-wrapper {
      display: grid;
      place-items: center;
      min-height: 150px;
    }

    .image {
      width: min(100%, 150px);
      height: 150px;
      object-fit: contain;
    }

    .fallback-image {
      display: grid;
      place-items: center;
      border-radius: 999px;
      background: #f3f4f6;
      color: #9ca3af;
      font-size: 3rem;
      font-weight: 700;
    }

    .footer {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 12px;
    }

    .name {
      margin: 0;
      color: #111827;
      font-size: 1rem;
      font-weight: 800;
      line-height: 1.2;
    }

    .types {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 6px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .type {
      padding: 4px 8px;
      border-radius: 999px;
      background: var(--type-bg);
      color: var(--type-text);
      font-size: 0.7rem;
      font-weight: 800;
      line-height: 1;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    @media (prefers-color-scheme: dark) {
      .card {
        border-color: #374151;
        background: #111827;
        box-shadow: 0 8px 24px rgb(0 0 0 / 30%);
      }

      .number {
        background: #1f2937;
        color: #d1d5db;
      }

      .name {
        color: #f9fafb;
      }

      .fallback-image {
        background: #1f2937;
        color: #6b7280;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'pokemon-card': PokemonCard
  }
}