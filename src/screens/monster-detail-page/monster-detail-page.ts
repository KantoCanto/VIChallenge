import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('monster-detail-page')
export class MonsterDetailPage extends LitElement {
  @property({ type: String, attribute: 'monster-id' })
  monsterId = ''

  private get formattedMonsterNumber() {
    return `#${String(this.monsterId).padStart(3, '0')}`
  }

  render() {
    return html`
      <main>
        <a class="back-link" href="/">← Back to monsters</a>

        <section class="placeholder" aria-labelledby="page-title">
          <p class="eyebrow">Monster details</p>

          <h1 id="page-title">
            Monster ${this.formattedMonsterNumber}
          </h1>

          <p>
            This monster detail page is currently under construction.
          </p>
        </section>
      </main>
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
      min-height: 100vh;
      background: var(--color-page-bg, #f9fafb);
      color: var(--color-text-primary, #111827);
    }

    main {
      width: 100%;
      max-width: 960px;
      margin: 0 auto;
      padding: clamp(24px, 6vw, 80px);
    }

    .back-link {
      display: inline-flex;
      margin-bottom: var(--space-6, 32px);
      color: var(--color-text-secondary, #4b5563);
      font-weight: var(--font-weight-bold, 700);
      text-decoration: none;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .back-link:focus-visible {
      outline: 3px solid var(--color-text-primary, #111827);
      outline-offset: 4px;
      border-radius: var(--radius-sm, 6px);
    }

    .placeholder {
      padding: clamp(32px, 6vw, 72px);
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-lg, 20px);
      background: var(--color-surface, #ffffff);
      box-shadow: var(--shadow-card, 0 8px 24px rgb(15 23 42 / 8%));
    }

    .eyebrow {
      margin: 0 0 var(--space-3, 12px);
      color: var(--color-text-secondary, #4b5563);
      font-size: var(--font-size-sm, 0.875rem);
      font-weight: var(--font-weight-bold, 700);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    h1 {
      margin: 0;
      color: var(--color-text-primary, #111827);
      font-size: clamp(2.5rem, 7vw, 5.5rem);
      line-height: 0.95;
      letter-spacing: -0.06em;
    }

    p {
      max-width: 560px;
      margin: var(--space-5, 24px) 0 0;
      color: var(--color-text-secondary, #4b5563);
      font-size: var(--font-size-md, 1rem);
      line-height: 1.6;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'monster-detail-page': MonsterDetailPage
  }
}