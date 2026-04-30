import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'

import type { PokemonCardData } from '../../../@types/pokemonCard'
import './pokemon-card'
import { pokemonCards } from '../../../storybook/mock-pokemon'

type PokemonCardStoryArgs = {
  pokemon: PokemonCardData
}

const meta = {
  title: 'Components/Pokemon Card',
  component: 'pokemon-card',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  render: ({ pokemon }) => html`
    <div style="width: min(320px, 90vw);">
      <pokemon-card .pokemon=${pokemon}></pokemon-card>
    </div>
  `,
  argTypes: {
    pokemon: {
      control: 'object',
    },
  },
  args: {
    pokemon: pokemonCards[0],
  },
} satisfies Meta<PokemonCardStoryArgs>

export default meta
type Story = StoryObj<PokemonCardStoryArgs>

export const Bulbasaur: Story = {}

export const DualType: Story = {
  args: {
    pokemon: pokemonCards[4],
  },
}

export const MissingArtwork: Story = {
  args: {
    pokemon: {
      ...pokemonCards[1],
      imageUrl: '',
    },
  },
}
