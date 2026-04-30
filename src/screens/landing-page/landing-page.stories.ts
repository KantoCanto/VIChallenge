import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'

import './landing-page'
import { installPokemonFetchMock } from '../../storybook/pokeapi-mock'

type LandingPageStoryArgs = {
  headline: string
}

const meta = {
  title: 'Screens/Landing Page',
  component: 'landing-page',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  render: ({ headline }) => {
    installPokemonFetchMock()

    return html`<landing-page headline=${headline}></landing-page>`
  },
  argTypes: {
    headline: {
      control: 'text',
    },
  },
  args: {
    headline: 'Monster Catalog',
  },
} satisfies Meta<LandingPageStoryArgs>

export default meta
type Story = StoryObj<LandingPageStoryArgs>

export const Catalog: Story = {}
