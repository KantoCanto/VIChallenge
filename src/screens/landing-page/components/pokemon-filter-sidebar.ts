import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'
import {
  FALLBACK_POKEMON_TYPE_THEME,
  POKEMON_TYPE_THEMES,
} from '../../../theme/pokemon-type-theme'

@customElement('pokemon-filter-sidebar')
export class PokemonFilterSidebar extends LitElement {
  @property({ type: Boolean, reflect: true })
  open = true

  @property({ type: Array, attribute: false })
  availableTypes: string[] = []

  @property({ type: Array, attribute: false })
  selectedTypes: string[] = []

  render() {
    return html`
      <aside class=${classMap({ sidebar: true, collapsed: !this.open })}>
        <button
          class="toggle-button"
          type="button"
          aria-label=${this.open ? 'Collapse filters' : 'Expand filters'}
          aria-expanded=${this.open}
          aria-controls="pokemon-filter-content"
          @click=${this.handleToggle}
        >
          <span aria-hidden="true">${this.open ? '←' : '→'}</span>
          <span class="toggle-label">
            ${this.open ? 'Collapse filters' : 'Expand filters'}
          </span>
        </button>

        <div id="pokemon-filter-content" class="content">
          <div class="header">
            <div>
              <h2>Filters</h2>
              <p class="description">Choose one or more monster types</p>
            </div>

            ${this.selectedTypes.length > 0
              ? html`
                  <button
                    class="clear-button"
                    type="button"
                    @click=${this.handleClearFilters}
                  >
                    Clear
                  </button>
                `
              : null}
          </div>

          <section class="type-filter" aria-labelledby="type-filter-title">
            <h3 id="type-filter-title">Type</h3>

            <div class="tag-list" role="group" aria-label="Filter by type">
              ${this.availableTypes.map((type) => {
                const isSelected = this.selectedTypes.includes(type)
                const theme =
                  POKEMON_TYPE_THEMES[type] ?? FALLBACK_POKEMON_TYPE_THEME

                return html`
                  <button
                    class=${classMap({
                      tag: true,
                      selected: isSelected,
                    })}
                    style=${styleMap({
                      '--type-bg': theme.background,
                      '--type-text': theme.text,
                    })}
                    type="button"
                    aria-pressed=${isSelected}
                    @click=${() => this.handleTypeToggle(type)}
                  >
                    ${isSelected
                      ? html`<span class="check" aria-hidden="true">✓</span>`
                      : null}
                    <span>${this.formatTypeName(type)}</span>
                  </button>
                `
              })}
            </div>
          </section>
        </div>
      </aside>
    `
  }

  private handleToggle() {
    this.dispatchEvent(
      new CustomEvent<boolean>('sidebar-toggle', {
        detail: !this.open,
        bubbles: true,
        composed: true,
      }),
    )
  }

  private handleTypeToggle(type: string) {
    const isSelected = this.selectedTypes.includes(type)

    const nextSelectedTypes = isSelected
      ? this.selectedTypes.filter((selectedType) => selectedType !== type)
      : [...this.selectedTypes, type]

    this.dispatchEvent(
      new CustomEvent<string[]>('types-change', {
        detail: nextSelectedTypes,
        bubbles: true,
        composed: true,
      }),
    )
  }

  private handleClearFilters() {
    this.dispatchEvent(
      new CustomEvent<string[]>('types-change', {
        detail: [],
        bubbles: true,
        composed: true,
      }),
    )
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
      min-height: 100vh;
    }

    .sidebar {
      position: sticky;
      top: 0;
      width: 280px;
      min-height: 100vh;
      padding: var(--space-4, 16px);
      border-right: 1px solid var(--color-border, #e5e7eb);
      background: var(--color-surface, #ffffff);
      overflow: hidden;
    }

    .sidebar.collapsed {
      width: 72px;
      padding-inline: var(--space-3, 12px);
    }

    .toggle-button {
      width: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2, 8px);
      min-height: 40px;
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-md, 12px);
      background: var(--color-surface-muted, #f3f4f6);
      color: var(--color-text-primary, #111827);
      font: inherit;
      cursor: pointer;
    }

    .toggle-button:focus-visible,
    .clear-button:focus-visible,
    .tag:focus-visible {
      outline: 2px solid var(--color-text-primary, #111827);
      outline-offset: 3px;
    }

    .collapsed .toggle-label,
    .collapsed .content {
      display: none;
    }

    .content {
      margin-top: var(--space-6, 32px);
    }

    .header {
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: var(--space-3, 12px);
      margin-bottom: var(--space-5, 24px);
    }

    h2 {
      margin: 0;
      color: var(--color-text-primary, #111827);
      font-size: var(--font-size-lg, 1.25rem);
      line-height: 1.2;
    }

    .description {
      margin: var(--space-1, 4px) 0 0;
      color: var(--color-text-secondary, #4b5563);
      font-size: var(--font-size-sm, 0.875rem);
      line-height: 1.4;
    }

    .clear-button {
      flex: 0 0 auto;
      border: 0;
      background: transparent;
      color: var(--color-text-secondary, #4b5563);
      font: inherit;
      font-size: var(--font-size-sm, 0.875rem);
      cursor: pointer;
      text-decoration: underline;
    }

    .type-filter {
      display: grid;
      gap: var(--space-3, 12px);
    }

    h3 {
      margin: 0;
      color: var(--color-text-secondary, #4b5563);
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: var(--font-weight-bold, 700);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2, 8px);
    }

    .tag {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-height: 34px;
      padding: 0 var(--space-3, 12px);
      border: 1px solid color-mix(in srgb, var(--type-bg) 65%, transparent);
      border-radius: var(--radius-pill, 999px);
      background: color-mix(
        in srgb,
        var(--type-bg) 18%,
        var(--color-surface, #ffffff) 82%
      );
      color: var(--color-text-primary, #111827);
      font: inherit;
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: var(--font-weight-bold, 700);
      line-height: 1;
      cursor: pointer;
      transition:
        background-color 140ms ease,
        border-color 140ms ease,
        color 140ms ease,
        box-shadow 140ms ease;
    }

    .tag:hover {
      background: color-mix(
        in srgb,
        var(--type-bg) 28%,
        var(--color-surface, #ffffff) 72%
      );
      border-color: var(--type-bg);
    }

    .tag.selected {
      border-color: var(--type-bg);
      background: var(--type-bg);
      color: var(--type-text);
      box-shadow: 0 8px 20px color-mix(in srgb, var(--type-bg) 32%, transparent);
    }

    .tag.selected:hover {
      background: var(--type-bg);
      color: var(--type-text);
    }

    .check {
      font-size: 0.75em;
      line-height: 1;
    }

    @media (prefers-reduced-motion: reduce) {
      .tag {
        transition: none;
      }
    }

    @media (max-width: 760px) {
      :host {
        min-height: auto;
      }

      .sidebar {
        position: static;
        width: 100%;
        min-height: auto;
        border-right: 0;
        border-bottom: 1px solid var(--color-border, #e5e7eb);
      }

      .sidebar.collapsed {
        width: 100%;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'pokemon-filter-sidebar': PokemonFilterSidebar
  }
}
