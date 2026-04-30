import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import { expect, userEvent, waitFor } from 'storybook/test'

import './app-root'
import { installPokemonFetchMock } from './storybook/pokeapi-mock'

type AppRootStoryArgs = {
  path: string
}

const meta = {
  title: 'App/App Root',
  component: 'app-root',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  render: ({ path }) => {
    installPokemonFetchMock()
    window.history.replaceState({}, '', path)

    return html`<app-root></app-root>`
  },
  argTypes: {
    path: {
      control: 'text',
    },
  },
  args: {
    path: '/',
  },
} satisfies Meta<AppRootStoryArgs>

export default meta
type Story = StoryObj<AppRootStoryArgs>

export const CatalogRoute: Story = {
  play: async ({ canvasElement }) => {
    const appRoot = canvasElement.querySelector('app-root')
    await waitFor(() => expect(appRoot).not.toBeNull())

    const landingPage = appRoot?.shadowRoot?.querySelector('landing-page')
    await waitFor(() => expect(landingPage).not.toBeNull())

    const card = await waitFor(() => {
      const nextCard = landingPage?.shadowRoot?.querySelector('pokemon-card')
      expect(nextCard).not.toBeNull()
      return nextCard
    })

    const cardLink = card?.shadowRoot?.querySelector('a')
    await waitFor(() => expect(cardLink).not.toBeNull())

    await userEvent.click(cardLink as HTMLAnchorElement)

    await waitFor(() => {
      expect(window.location.pathname).toBe('/monsters/1')
      expect(appRoot?.shadowRoot?.querySelector('monster-detail-page')).not.toBeNull()
    })
  },
}

export const DetailRoute: Story = {
  args: {
    path: '/monsters/25',
  },
  play: async ({ canvasElement }) => {
    const appRoot = canvasElement.querySelector('app-root')
    await waitFor(() => expect(appRoot).not.toBeNull())
    await waitFor(() => {
      expect(appRoot?.shadowRoot?.querySelector('monster-detail-page')).not.toBeNull()
    })

    window.history.pushState({}, '', '/')
    window.dispatchEvent(new PopStateEvent('popstate'))

    await waitFor(() => {
      expect(window.location.pathname).toBe('/')
      expect(appRoot?.shadowRoot?.querySelector('landing-page')).not.toBeNull()
    })
  },
}
