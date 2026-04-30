import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'

import './pokemon-filter-sidebar'
import { pokemonTypes } from '../../../storybook/mock-pokemon'

type PokemonFilterSidebarStoryArgs = {
  availableTypes: string[]
  open: boolean
  selectedTypes: string[]
}

const meta = {
  title: 'Components/Pokemon Filter Sidebar',
  component: 'pokemon-filter-sidebar',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  render: ({ availableTypes, open, selectedTypes }) => html`
    <pokemon-filter-sidebar
      .availableTypes=${availableTypes}
      .open=${open}
      .selectedTypes=${selectedTypes}
    ></pokemon-filter-sidebar>
  `,
  argTypes: {
    availableTypes: {
      control: 'object',
    },
    open: {
      control: 'boolean',
    },
    selectedTypes: {
      control: 'object',
    },
  },
  args: {
    availableTypes: pokemonTypes,
    open: true,
    selectedTypes: ['fire', 'electric'],
  },
} satisfies Meta<PokemonFilterSidebarStoryArgs>

export default meta
type Story = StoryObj<PokemonFilterSidebarStoryArgs>

export const Expanded: Story = {}

export const Collapsed: Story = {
  args: {
    open: false,
  },
}

export const NoActiveFilters: Story = {
  args: {
    selectedTypes: [],
  },
}
