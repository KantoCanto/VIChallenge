import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import type { PokemonCardData } from '../../@types/pokemonCard'
import {
  getPokemonPage,
  getPokemonPageByTypes,
  getPokemonTypes,
} from '../../api/pokemon'
import './components/pokemon-card'
import './components/pokemon-filter-sidebar'

const PAGE_SIZE = 24

const POKEMON_TYPE_ORDER = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
]

@customElement('landing-page')
export class LandingPage extends LitElement {
  @property({ type: String })
  headline?: string

  @state()
  private pokemon: PokemonCardData[] = []

  @state()
  private availableTypes: string[] = []

  @state()
  private selectedTypes: string[] = []

  @state()
  private isSidebarOpen = true

  @state()
  private isLoading = false

  @state()
  private errorMessage = ''

  @state()
  private totalPokemonCount = 0

  private pokemonAbortController?: AbortController
  private typesAbortController?: AbortController

  connectedCallback() {
    super.connectedCallback()

    void this.loadPokemonTypes()
    void this.loadPokemon()
  }

  disconnectedCallback() {
    this.pokemonAbortController?.abort()
    this.typesAbortController?.abort()

    super.disconnectedCallback()
  }

  private sortTypes(types: string[]) {
    return [...types].sort((a, b) => {
      const aIndex = POKEMON_TYPE_ORDER.indexOf(a)
      const bIndex = POKEMON_TYPE_ORDER.indexOf(b)

      if (aIndex === -1 && bIndex === -1) {
        return a.localeCompare(b)
      }

      if (aIndex === -1) return 1
      if (bIndex === -1) return -1

      return aIndex - bIndex
    })
  }

  private async loadPokemonTypes() {
    this.typesAbortController?.abort()
    this.typesAbortController = new AbortController()

    try {
      const types = await getPokemonTypes(this.typesAbortController.signal)
      this.availableTypes = this.sortTypes(types)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      console.error(error)
    }
  }

  private async loadPokemon() {
    this.pokemonAbortController?.abort()
    this.pokemonAbortController = new AbortController()

    this.isLoading = true
    this.errorMessage = ''

    try {
      const page =
        this.selectedTypes.length > 0
          ? await getPokemonPageByTypes({
              types: this.selectedTypes,
              limit: PAGE_SIZE,
              offset: 0,
              signal: this.pokemonAbortController.signal,
            })
          : await getPokemonPage({
              limit: PAGE_SIZE,
              offset: 0,
              signal: this.pokemonAbortController.signal,
            })

      this.pokemon = page.pokemons
      this.totalPokemonCount = page.count
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      this.errorMessage =
        error instanceof Error
          ? error.message
          : 'Something went wrong while loading Pokémon.'
    } finally {
      this.isLoading = false
    }
  }

  private handleTypesChange(event: CustomEvent<string[]>) {
    this.selectedTypes = event.detail
    void this.loadPokemon()
  }

  private handleSidebarToggle(event: CustomEvent<boolean>) {
    this.isSidebarOpen = event.detail
  }

  render() {
    return html`
      <div class="page-layout">
        <pokemon-filter-sidebar
          .open=${this.isSidebarOpen}
          .availableTypes=${this.availableTypes}
          .selectedTypes=${this.selectedTypes}
          @types-change=${this.handleTypesChange}
          @sidebar-toggle=${this.handleSidebarToggle}
        ></pokemon-filter-sidebar>

        <main>
          ${this.headline
            ? html`
                <header class="page-header">
                  <h1 class="headline">${this.headline}</h1>
                </header>
              `
            : null}

          ${this.isLoading
            ? html`<p class="status" role="status">Loading Pokémon…</p>`
            : null}

          ${this.errorMessage
            ? html`<p class="status error" role="alert">${this.errorMessage}</p>`
            : null}

          ${!this.isLoading && !this.errorMessage
            ? html`
                <p class="result-count">
                  ${this.totalPokemonCount} monsters found
                </p>
              `
            : null}

          ${!this.isLoading && !this.errorMessage && this.pokemon.length === 0
            ? html`
                <section class="empty-state" aria-live="polite">
                  <h2>No monsters found</h2>
                  <p>Try removing one or more filters.</p>
                </section>
              `
            : null}

          <section class="grid" aria-label="Monsters list">
            ${repeat(
              this.pokemon,
              (pokemon) => pokemon.id,
              (pokemon) => html`
                <pokemon-card .pokemon=${pokemon}></pokemon-card>
              `,
            )}
          </section>
        </main>
      </div>
    `
  }

  static styles = css`
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      overflow-x: clip;
    }

    .page-layout {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      width: 100%;
      min-height: 100vh;
      background: var(--color-page-bg, #f9fafb);
    }

    main {
      min-width: 0;
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
      padding: clamp(24px, 4vw, 56px);
    }

    .page-header {
      margin-bottom: var(--space-5, 24px);
    }

    .headline {
      margin: 0;
      color: var(--color-text-primary, #111827);
      font-size: clamp(1.5rem, 3vw, 2.5rem);
      line-height: 1.1;
      letter-spacing: -0.04em;
    }

    .result-count {
      margin: 0 0 var(--space-5, 24px);
      color: var(--color-text-secondary, #4b5563);
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: var(--font-weight-bold, 700);
    }

    .status {
      margin: 0 0 var(--space-5, 24px);
      color: var(--color-text-secondary, #4b5563);
    }

    .error {
      color: var(--color-danger, #b91c1c);
    }

    .grid {
      --card-min-width: 260px;

      display: grid;
      grid-template-columns: repeat(
        auto-fit,
        minmax(min(var(--card-min-width), 100%), 1fr)
      );
      gap: clamp(24px, 3vw, 44px);
      align-items: stretch;
      min-width: 0;
    }

    .empty-state {
      margin-bottom: var(--space-5, 24px);
      padding: var(--space-5, 24px);
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-lg, 20px);
      background: var(--color-surface, #ffffff);
    }

    .empty-state h2 {
      margin: 0 0 var(--space-2, 8px);
      color: var(--color-text-primary, #111827);
      font-size: var(--font-size-lg, 1.25rem);
    }

    .empty-state p {
      margin: 0;
      color: var(--color-text-secondary, #4b5563);
    }

    @media (max-width: 760px) {
      .page-layout {
        grid-template-columns: minmax(0, 1fr);
      }

      main {
        padding: var(--space-4, 16px);
      }
    }

    @media (min-width: 1440px) {
      .grid {
        --card-min-width: 280px;
      }
    }

    @media (min-width: 1800px) {
      main {
        max-width: 1520px;
      }
    }

    @media (min-width: 2160px) {
      main {
        max-width: 1800px;
      }

      .grid {
        --card-min-width: 300px;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'landing-page': LandingPage
  }
}
