import { LitElement, css, html, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import type { PokemonCardData } from '../../../@types/pokemonCard'
import {
  FALLBACK_POKEMON_TYPE_THEME,
  POKEMON_TYPE_THEMES,
} from '../../../theme/pokemon-type-theme'

@customElement('pokemon-card')
export class PokemonCard extends LitElement {
  @property({ attribute: false })
  pokemon?: PokemonCardData

  private getMonsterHref(id: number) {
    return `/monsters/${id}`
  }

  render() {
    if (!this.pokemon) {
      return nothing
    }

    const { id, number, name, imageUrl, types } = this.pokemon
    const headingId = `pokemon-card-title-${id}`

   return html`
    <a
      class="card-link"
      href=${this.getMonsterHref(id)}
      aria-labelledby=${headingId}
    >
      <article class="card">
        <p class="number" aria-label=${`Monster number ${number}`}>
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
                <div
                  class="image fallback-image"
                  role="img"
                  aria-label=${`${name} artwork unavailable`}
                >
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
    </a>
  `
  }

  private renderTypeBadge(type: string) {
    const normalizedType = type.toLowerCase()
    const theme =
      POKEMON_TYPE_THEMES[normalizedType] ?? FALLBACK_POKEMON_TYPE_THEME

    return html`
      <li
        class="type"
        style=${styleMap({
          '--type-bg': theme.background,
          '--type-text': theme.text,
        })}
      >
        ${this.formatTypeName(type)}
      </li>
    `
  }

  private formatTypeName(type: string) {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  static styles = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :host {
    display: block;
    min-width: 0;
    contain-intrinsic-size: 340px;
  }

  .card-link {
    display: block;
    min-height: 100%;
    color: inherit;
    text-decoration: none;
    border-radius: var(--radius-lg, 24px);
    box-shadow: var(--shadow-card, 0 12px 32px rgb(124 74 45 / 10%));
    transition:
      box-shadow 160ms ease,
      transform 160ms ease;
  }

  .card-link:hover {
    box-shadow: var(--shadow-card-hover, 0 18px 44px rgb(124 74 45 / 16%));
  }

  .card-link:hover .card {
    border-color: var(--color-border-strong, #fdba74);
  }

  .card-link:hover .image {
    transform: scale(1.04);
  }
  .card-link:focus-visible {
    outline: 3px solid var(--color-text-primary, #111827);
    outline-offset: 4px;
  }

  .card {
    position: relative;
    display: grid;
    grid-template-rows: auto minmax(190px, 1fr) auto;
    min-height: 340px;
    padding: var(--space-4, 16px);
    border: 1px solid var(--color-border, #fed7aa);
    border-radius: inherit;
    background: linear-gradient(
      180deg,
      #ffffff 0%,
      var(--color-surface-muted, #fff7ed) 100%
    );
    overflow: hidden;
    transition: border-color 160ms ease;
  }

  .number {
    justify-self: end;
    z-index: 1;
    margin: 0;
    padding: var(--space-1, 4px) var(--space-2, 8px);
    border-radius: var(--radius-pill, 999px);
    background: var(--color-surface-muted, #f3f4f6);
    color: var(--color-text-secondary, #4b5563);
    font-size: var(--font-size-md, 0.75rem);
    font-weight: var(--font-weight-bold, 700);
    line-height: 1;
    letter-spacing: 0.03em;
  }

  .image-wrapper {
    display: grid;
    place-items: center;
    min-width: 0;
    min-height: 190px;
    padding: var(--space-3, 12px) 0;
  }

  .image {
    display: block;
    width: min(100%, 210px);
    height: 210px;
    object-fit: contain;
    transition: transform 160ms ease;
  }

  .fallback-image {
    display: grid;
    place-items: center;
    width: 160px;
    height: 160px;
    border-radius: var(--radius-pill, 999px);
    background: var(--color-surface-muted, #f3f4f6);
    color: var(--color-text-muted, #9ca3af);
    font-size: 3rem;
    font-weight: var(--font-weight-bold, 700);
  }

  .footer {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: var(--space-3, 12px);
    min-width: 0;
  }

  .name {
    min-width: 0;
    margin: 0;
    padding-left: var(--space-4, 4px);
    color: var(--color-text-primary, #111827);
    font-size: var(--font-size-md, 1rem);
    font-weight: var(--font-weight-extra-bold, 800);
    line-height: 1.2;
    overflow-wrap: anywhere;
  }

  .types {
    display: flex;
    flex: 0 0 auto;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--space-2, 8px);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .type {
    padding: var(--space-1, 4px) var(--space-2, 8px);
    border-radius: var(--radius-pill, 999px);
    background: var(--type-bg);
    color: var(--type-text);
    font-size: var(--font-size-xxs, 0.6rem);
    font-weight: var(--font-weight-extra-bold, 800);
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  @media (max-width: 520px) {
    .card {
      grid-template-rows: auto minmax(170px, 1fr) auto;
      min-height: 310px;
    }

    .image-wrapper {
      min-height: 170px;
    }

    .image {
      width: min(100%, 180px);
      height: 180px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .card,
    .image {
      transition: none;
    }

    .card-link:hover .image {
      transform: none;
    }
  }
`
}

declare global {
  interface HTMLElementTagNameMap {
    'pokemon-card': PokemonCard
  }
}