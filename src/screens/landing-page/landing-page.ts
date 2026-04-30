
import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import type { PokemonCardData } from '../../@types/pokemonCard'
import { getPokemonPage } from '../../api/pokemon'
import './components/pokemon-card'


@customElement('landing-page')
export class LandingPage extends LitElement {
  @state()
  private pokemon: PokemonCardData[] = []

  @state()
  private isLoading = false

  @state()
  private errorMessage = ''

  private abortController?: AbortController

  connectedCallback() {
    super.connectedCallback()
    void this.loadPokemon()
  }

  disconnectedCallback() {
    this.abortController?.abort()
    super.disconnectedCallback()
  }

  private async loadPokemon() {
    this.abortController?.abort()
    this.abortController = new AbortController()

    this.isLoading = true
    this.errorMessage = ''

    try {
      const page = await getPokemonPage({
        limit: 24,
        offset: 0,
        signal: this.abortController.signal,
      })

      this.pokemon = page.pokemons
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

  render() {
    return html`
      <main>
        <h1>These are our products</h1>

        ${this.isLoading
          ? html`<p role="status">Loading Pokémon…</p>`
          : null}

        ${this.errorMessage
          ? html`<p role="alert">${this.errorMessage}</p>`
          : null}

        <section class="grid" aria-label="Pokémon list">
          ${repeat(
            this.pokemon,
            (pokemon) => pokemon.id,
            (pokemon) => html`
              <pokemon-card .pokemon=${pokemon}></pokemon-card>
            `,
          )}
        </section>
      </main>
    `
  }

 static styles = css`
  :host {
    display: block;
    width: 100%;
  }

  main {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr));
    gap: 16px;
    align-items: stretch;
  }
`
}

declare global {
  interface HTMLElementTagNameMap {
    'landing-page': LandingPage
  }
}