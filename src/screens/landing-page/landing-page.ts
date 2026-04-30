import { LitElement, css, html } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import type { PokemonCardData } from '../../@types/pokemonCard'
import { getPokemonTypes, searchPokemonPage } from '../../api/pokemon'
import './components/pokemon-card'
import './components/pokemon-filter-sidebar'
import './components/pokemon-search-bar'

const PAGE_SIZE = 24
const SEARCH_DEBOUNCE_MS = 220

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
  private searchQuery = ''

  @state()
  private isSidebarOpen = true

  @state()
  private isLoadingInitial = false

  @state()
  private isLoadingMore = false

  @state()
  private errorMessage = ''

  @state()
  private nextOffset: number | null = 0

  @query('#load-more-sentinel')
  private loadMoreSentinel?: HTMLElement

  private pokemonAbortController?: AbortController
  private typesAbortController?: AbortController
  private searchDebounceTimer?: number
  private intersectionObserver?: IntersectionObserver
  private pokemonRequestId = 0

  connectedCallback() {
    super.connectedCallback()

    void this.loadPokemonTypes()
    void this.loadNextPokemonPage()
  }

  firstUpdated() {
    this.setupInfiniteScrollObserver()
  }

  disconnectedCallback() {
    this.pokemonAbortController?.abort()
    this.typesAbortController?.abort()
    this.intersectionObserver?.disconnect()

    if (this.searchDebounceTimer) {
      window.clearTimeout(this.searchDebounceTimer)
    }

    super.disconnectedCallback()
  }

  private get hasMorePokemon() {
    return this.nextOffset !== null
  }

  private get isLoading() {
    return this.isLoadingInitial || this.isLoadingMore
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

  private setupInfiniteScrollObserver() {
    if (!this.loadMoreSentinel) return

    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        if (!this.hasMorePokemon) return
        if (this.isLoading) return

        void this.loadNextPokemonPage()
      },
      {
        root: null,
        rootMargin: '700px 0px',
        threshold: 0,
      },
    )

    this.intersectionObserver.observe(this.loadMoreSentinel)
  }

  private resetAndLoadPokemon() {
    this.pokemonRequestId += 1
    this.pokemonAbortController?.abort()

    this.pokemon = []
    this.nextOffset = 0
    this.errorMessage = ''
    this.isLoadingInitial = false
    this.isLoadingMore = false

    void this.loadNextPokemonPage()
  }

  private async loadNextPokemonPage() {
    if (this.nextOffset === null) return
    if (this.isLoading) return

    this.pokemonRequestId += 1
    const requestId = this.pokemonRequestId

    this.pokemonAbortController?.abort()
    this.pokemonAbortController = new AbortController()

    const isInitialLoad = this.pokemon.length === 0

    if (isInitialLoad) {
      this.isLoadingInitial = true
    } else {
      this.isLoadingMore = true
    }

    this.errorMessage = ''

    try {
      const page = await searchPokemonPage({
        query: this.searchQuery,
        types: this.selectedTypes,
        limit: PAGE_SIZE,
        offset: this.nextOffset,
        signal: this.pokemonAbortController.signal,
      })

      if (requestId !== this.pokemonRequestId) return

      const existingIds = new Set(this.pokemon.map((pokemon) => pokemon.id))
      const newPokemon = page.pokemons.filter(
        (pokemon) => !existingIds.has(pokemon.id),
      )

      this.pokemon = [...this.pokemon, ...newPokemon]
      this.nextOffset = page.nextOffset
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return
      }

      if (requestId !== this.pokemonRequestId) return

      this.errorMessage =
        error instanceof Error
          ? error.message
          : 'Something went wrong while loading Pokémon.'
    } finally {
      if (requestId !== this.pokemonRequestId) return

      this.isLoadingInitial = false
      this.isLoadingMore = false
    }
  }

  private handleSearchChange(event: CustomEvent<string>) {
    this.searchQuery = event.detail

    this.pokemonRequestId += 1
    this.pokemonAbortController?.abort()
    this.isLoadingInitial = false
    this.isLoadingMore = false

    if (this.searchDebounceTimer) {
      window.clearTimeout(this.searchDebounceTimer)
    }

    this.searchDebounceTimer = window.setTimeout(() => {
      this.resetAndLoadPokemon()
    }, SEARCH_DEBOUNCE_MS)
  }

  private handleTypesChange(event: CustomEvent<string[]>) {
    this.selectedTypes = event.detail
    this.resetAndLoadPokemon()
  }

  private handleSidebarToggle(event: CustomEvent<boolean>) {
    this.isSidebarOpen = event.detail
  }

  render() {
    const hasActiveSearch = this.searchQuery.trim().length > 0
    const hasActiveFilters = this.selectedTypes.length > 0

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
          <section class="hero" aria-label="Monster search and results">
            <div class="hero-content">
              ${this.headline
                ? html`<h1 class="headline">${this.headline}</h1>`
                : null}

              ${hasActiveSearch || hasActiveFilters
                ? html`
                    <p class="active-context" aria-live="polite">
                      Results matching your current search
                    </p>
                  `
                : null}
            </div>

            <pokemon-search-bar
              class="search-bar"
              .value=${this.searchQuery}
              @search-change=${this.handleSearchChange}
            ></pokemon-search-bar>
          </section>

          ${this.isLoadingInitial
            ? html`<p class="status" role="status">Loading monsters…</p>`
            : null}

          ${this.errorMessage
            ? html`<p class="status error" role="alert">${this.errorMessage}</p>`
            : null}

          ${!this.isLoadingInitial && !this.errorMessage && this.pokemon.length === 0
            ? html`
                <section class="empty-state" aria-live="polite">
                  <h2>No monsters found</h2>
                  <p>Try changing your search or removing one or more filters.</p>
                </section>
              `
            : null}

          <section class="grid" aria-label="Monster list">
            ${repeat(
              this.pokemon,
              (pokemon) => pokemon.id,
              (pokemon) => html`
                <pokemon-card .pokemon=${pokemon}></pokemon-card>
              `,
            )}
          </section>

          <div
            id="load-more-sentinel"
            class="load-more-sentinel"
            aria-hidden="true"
          ></div>

          ${this.isLoadingMore
            ? html`
                <p class="loading-more" role="status">
                  Loading more monsters…
                </p>
              `
            : null}

          ${!this.hasMorePokemon && this.pokemon.length > 0
            ? html`
                <p class="end-message">
                  You have reached the end.
                </p>
              `
            : null}
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
  background:
    radial-gradient(circle at 20% 0%, rgb(254 215 170 / 55%), transparent 360px),
    radial-gradient(circle at 90% 12%, rgb(191 219 254 / 50%), transparent 420px),
    var(--color-page-bg, #fff7ed);
}

    main {
      min-width: 0;
      width: 100%;
      max-width: 1280px;
      margin: 0 auto;
      padding: clamp(24px, 4vw, 56px);
    }

    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
      align-items: end;
      gap: clamp(24px, 4vw, 56px);
      margin-bottom: clamp(32px, 5vw, 64px);
    }

    .hero-content {
      min-width: 0;
    }

    .headline {
      margin: 0;
      color: var(--color-text-primary, #111827);
      font-size: clamp(1.75rem, 4vw, 3.25rem);
      line-height: 1;
      letter-spacing: -0.05em;
    }

    .active-context {
      margin: var(--space-3, 12px) 0 0;
      color: var(--color-text-secondary, #4b5563);
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: var(--font-weight-bold, 700);
    }

    .search-bar {
      width: 100%;
      align-self: end;
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

    .load-more-sentinel {
      width: 100%;
      height: 1px;
    }

    .loading-more,
    .end-message {
      margin: var(--space-6, 32px) 0 0;
      color: var(--color-text-secondary, #4b5563);
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: var(--font-weight-bold, 700);
      text-align: center;
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

      .hero {
        grid-template-columns: 1fr;
        gap: var(--space-4, 16px);
      }

      .search-bar {
        max-width: none;
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