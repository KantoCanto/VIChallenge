import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'

import './monster-detail-page'

type MonsterDetailPageStoryArgs = {
  monsterId: string
}

const meta = {
  title: 'Screens/Monster Detail Page',
  component: 'monster-detail-page',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  render: ({ monsterId }) => html`
    <monster-detail-page monster-id=${monsterId}></monster-detail-page>
  `,
  argTypes: {
    monsterId: {
      control: 'text',
    },
  },
  args: {
    monsterId: '25',
  },
} satisfies Meta<MonsterDetailPageStoryArgs>

export default meta
type Story = StoryObj<MonsterDetailPageStoryArgs>

export const Placeholder: Story = {}
