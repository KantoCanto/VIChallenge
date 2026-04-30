import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import './screens/landing-page/landing-page'
import './screens/monster-detail-page/monster-detail-page'

@customElement('app-root')
export class AppRoot extends LitElement {
  @state()
  private currentPath = window.location.pathname

  connectedCallback() {
    super.connectedCallback()
    window.addEventListener('popstate', this.handlePopState)
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this.handlePopState)
    super.disconnectedCallback()
  }

  private handlePopState = () => {
    this.currentPath = window.location.pathname
  }

  private handleNavigation(event: MouseEvent) {
    if (event.defaultPrevented) return
    if (event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    const anchor = event
      .composedPath()
      .find((element): element is HTMLAnchorElement => {
        return element instanceof HTMLAnchorElement
      })

    if (!anchor) return
    if (anchor.target && anchor.target !== '_self') return

    const url = new URL(anchor.href)

    if (url.origin !== window.location.origin) return

    event.preventDefault()

    window.history.pushState({}, '', url.pathname)
    this.currentPath = url.pathname
    window.scrollTo({ top: 0 })
  }

  render() {
    const monsterRouteMatch = this.currentPath.match(/^\/monsters\/(\d+)\/?$/)
    const monsterId = monsterRouteMatch?.[1]

    return html`
      <div @click=${this.handleNavigation}>
        ${monsterId
          ? html`
              <monster-detail-page
                monster-id=${monsterId}
              ></monster-detail-page>
            `
          : html`<landing-page headline="Monster Catalog"></landing-page>`}
      </div>
    `
  }

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot
  }
}