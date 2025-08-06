import { useState } from 'react';
// eslint-disable-next-line storybook/no-renderer-packages
import { Meta, StoryObj } from '@storybook/react';
import { expect } from 'storybook/test';
import { PyroscopeDatasourceSelector } from '../model';
import { Filters } from './Filters';
import { useLabelNames, useLabelValues } from '#utils/use-query';

const meta = {
  title: 'Components/Filters',
  component: Filters,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    datasource: {} as PyroscopeDatasourceSelector,
    value: [{ labelName: '', labelValue: '', operator: '=' }],
  },
  decorators: [
    (Story, context) => {
      const [filter, setFilter] = useState(context.args.value);

      return (
        <Story
          args={{
            ...context.args,
            value: filter,
            onChange: setFilter,
          }}
        />
      );
    },
  ],
  async beforeEach() {
    useLabelNames.mockReturnValue(MOCK_LABEL_NAMES);
    useLabelValues.mockReturnValue(MOCK_LABEL_VALUES_REGION);
  },
} satisfies Meta<typeof Filters>;

export default meta;

type Story = StoryObj<typeof meta>;

const MOCK_LABEL_NAMES = {
  data: {
    names: ['__name__', '__period_type__', 'hostname', 'pyroscope_spy', 'region', 'target'],
  },
  isLoading: false,
};

const MOCK_LABEL_VALUES_REGION = {
  data: {
    names: ['ap-south', 'eu-north', 'us-east'],
  },
  isLoading: false,
};

// label_value should be disabled while label_name is empty
export const LabelValueDisabled: Story = {
  play: async ({ canvas, userEvent }) => {
    const selectElement = canvas.getAllByRole('combobox');
    const labelName = selectElement[0];
    const labelValue = selectElement[2];

    // label_value should be disabled while label_name is empty
    expect(labelName).toHaveTextContent('Select label name');
    expect(labelValue).toHaveClass('Mui-disabled');

    // label_value should be enabled while label_name is not empty
    console.log('LabelName:', labelName);
    userEvent.click(labelName);

    const ul = canvas.getAllByRole('listbox')[0];
    userEvent.selectOptions(ul, 'hostname');

    // const options = canvas.getAllByRole('option');
    // const firstOption = options[0];
    // userEvent.click(firstOption);

    // userEvent.selectOptions(labelName, 'hostname');
    expect(labelName).toHaveTextContent('hostname');
    expect(labelValue).toBeEnabled();
  },
};

export const AddFilter: Story = {
  play: async ({ canvas }) => {
    const selectElement = canvas.getByRole('combobox');
    // Verify that the operator component is rendered
    await expect(selectElement).toBeInTheDocument();
    // Verify the default value
    await expect(selectElement).toHaveTextContent('=');
  },
};

export const DeleteFilter: Story = {
  play: async ({ canvas }) => {
    const selectElement = canvas.getByRole('combobox');
    // Verify that the operator component is rendered
    await expect(selectElement).toBeInTheDocument();
    // Verify the default value
    await expect(selectElement).toHaveTextContent('=');
  },
};

export const AtLeastOneEmptyFilter: Story = {
  play: async ({ canvas }) => {
    const selectElement = canvas.getByRole('combobox');
    // Verify that the operator component is rendered
    await expect(selectElement).toBeInTheDocument();
    // Verify the default value
    await expect(selectElement).toHaveTextContent('=');
  },
};
