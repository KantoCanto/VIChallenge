import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'

import './pokemon-search-bar'

type PokemonSearchBarStoryArgs = {
  value: string
}

const meta = {
  title: 'Components/Pokemon Search Bar',
  component: 'pokemon-search-bar',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  render: ({ value }) => html`
    <div style="width: min(420px, 90vw);">
      <pokemon-search-bar .value=${value}></pokemon-search-bar>
    </div>
  `,
  argTypes: {
    value: {
      control: 'text',
    },
  },
  args: {
    value: '',
  },
} satisfies Meta<PokemonSearchBarStoryArgs>

export default meta
type Story = StoryObj<PokemonSearchBarStoryArgs>

export const Empty: Story = {}

export const WithQuery: Story = {
  args: {
    value: 'Pikachu',
  },
}
