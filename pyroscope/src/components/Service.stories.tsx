import { useState } from 'react';
// eslint-disable-next-line storybook/no-renderer-packages
import { Meta, StoryObj } from '@storybook/react';
import { PyroscopeDatasourceSelector } from '../model';
import { Service } from './Service';
import { useServices } from '#utils/use-query';

const meta = {
  title: 'Components/Service',
  component: Service,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    datasource: {} as PyroscopeDatasourceSelector,
    value: '',
    onChange: () => {},
  },
  decorators: [
    (Story, context) => {
      const [value, setValue] = useState('');

      return (
        <div style={{ width: '200px' }}>
          <Story
            args={{
              ...context.args,
              value: value,
              onChange: setValue,
            }}
          />
        </div>
      );
    },
  ],
} satisfies Meta<typeof Service>;

export default meta;

type Story = StoryObj<typeof meta>;

const MOCK_DATA_EMPTY = {
  data: { names: [] },
  isLoading: false,
};

const MOCK_DATA_SUCESS = {
  data: { names: ['pyroscope', 'application', 'frontend', 'backend'] },
  isLoading: false,
};

const MOCK_DATA_LOADING = {
  data: { names: [] },
  isLoading: true,
};

export const Success: Story = {
  async beforeEach() {
    useServices.mockReturnValue(MOCK_DATA_SUCESS);
  },
};

export const Loading: Story = {
  async beforeEach() {
    useServices.mockReturnValue(MOCK_DATA_LOADING);
  },
};

export const Empty: Story = {
  async beforeEach() {
    useServices.mockReturnValue(MOCK_DATA_EMPTY);
  },
};
