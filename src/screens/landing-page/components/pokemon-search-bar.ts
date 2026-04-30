import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('pokemon-search-bar')
export class PokemonSearchBar extends LitElement {
  @property({ type: String })
  value = ''

  render() {
    return html`
      <div class="search" role="search">
        <svg
          class="icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M10.75 4.5a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5Zm-8.25 6.25a8.25 8.25 0 1 1 14.59 5.28l4.19 4.19a.75.75 0 1 1-1.06 1.06l-4.19-4.19A8.25 8.25 0 0 1 2.5 10.75Z"
            fill="currentColor"
          ></path>
        </svg>

        <label class="visually-hidden" for="pokemon-search">
          Search monsters
        </label>

        <input
          id="pokemon-search"
          type="search"
          autocomplete="off"
          spellcheck="false"
          .value=${this.value}
          placeholder="Search by name or number"
          @input=${this.handleInput}
          @keydown=${this.handleKeydown}
        />

        ${this.value
          ? html`
              <button
                class="clear-button"
                type="button"
                aria-label="Clear search"
                @click=${this.handleClear}
              >
                ×
              </button>
            `
          : null}
      </div>
    `
  }

  private handleInput(event: Event) {
    const input = event.target as HTMLInputElement
    this.emitSearchChange(input.value)
  }

  private handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return
    if (!this.value) return

    event.preventDefault()
    this.emitSearchChange('')
  }

  private handleClear() {
    this.emitSearchChange('')
  }

  private emitSearchChange(value: string) {
    this.dispatchEvent(
      new CustomEvent<string>('search-change', {
        detail: value,
        bubbles: true,
        composed: true,
      }),
    )
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
    }

    .search {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      min-height: 56px;
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-pill, 999px);
      background:
        linear-gradient(
          180deg,
          color-mix(in srgb, var(--color-surface, #ffffff) 96%, transparent),
          var(--color-surface, #ffffff)
        );
      box-shadow: 0 10px 30px rgb(15 23 42 / 8%);
      transition:
        border-color 140ms ease,
        box-shadow 140ms ease,
        background-color 140ms ease;
    }

    .search:focus-within {
      border-color: var(--color-text-primary, #111827);
      box-shadow:
        0 14px 40px rgb(15 23 42 / 12%),
        0 0 0 4px color-mix(
          in srgb,
          var(--color-text-primary, #111827) 10%,
          transparent
        );
    }

    .icon {
      flex: 0 0 auto;
      width: 20px;
      height: 20px;
      margin-left: var(--space-4, 16px);
      color: var(--color-text-muted, #9ca3af);
      pointer-events: none;
    }

    input {
      width: 100%;
      min-width: 0;
      height: 54px;
      padding: 0 var(--space-4, 16px);
      border: 0;
      outline: 0;
      background: transparent;
      color: var(--color-text-primary, #111827);
      font: inherit;
      font-size: var(--font-size-md, 1rem);
      font-weight: var(--font-weight-bold, 700);
    }

    input::placeholder {
      color: var(--color-text-muted, #9ca3af);
      font-weight: var(--font-weight-medium, 500);
    }

    input::-webkit-search-cancel-button {
      appearance: none;
    }

    .clear-button {
      flex: 0 0 auto;
      display: grid;
      place-items: center;
      width: 32px;
      height: 32px;
      margin-right: var(--space-3, 12px);
      border: 0;
      border-radius: var(--radius-pill, 999px);
      background: var(--color-surface-muted, #f3f4f6);
      color: var(--color-text-secondary, #4b5563);
      font: inherit;
      font-size: 1.25rem;
      line-height: 1;
      cursor: pointer;
    }

    .clear-button:hover {
      background: var(--color-border, #e5e7eb);
      color: var(--color-text-primary, #111827);
    }

    .clear-button:focus-visible {
      outline: 2px solid var(--color-text-primary, #111827);
      outline-offset: 3px;
    }

    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
      border: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .search {
        transition: none;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'pokemon-search-bar': PokemonSearchBar
  }
}