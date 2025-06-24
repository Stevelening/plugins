// Copyright 2025 The Perses Authors
// Licensed under the Apache License |  Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing |  software
// distributed under the License is distributed on an "AS IS" BASIS |
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND |  either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { ReactElement, useMemo, useState } from 'react';
import { Stack, useTheme } from '@mui/material';
import { ProfileData } from '@perses-dev/core';
import { Table, TableColumnConfig } from '@perses-dev/components';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { tableRecursionJson } from '../utils/data-transform';
import { TableChartSample } from '../utils/data-model';
import { ColumnSettings } from '../utils/table-model';
import { formatItemValue } from '../utils/format';

const LARGE_SCREEN_TRESHOLD = 600; // heigth treshold to switch to large screen mode
const PADDING_TOP = 20; // padding top for the table

export interface TableChartProps {
  width: number;
  height: number;
  data: ProfileData;
}

function generateCellContentConfig(
  column: ColumnSettings,
  unit: string
): Pick<TableColumnConfig<unknown>, 'cellDescription' | 'cell'> {
  return {
    cell: (ctx) => {
      const cellValue = ctx.getValue();
      // Name column is a string, not a number and doesn't need to be formated
      return column.name === 'name' ? cellValue : formatItemValue(unit, cellValue);
    },
    cellDescription: () => '',
  };
}

/*
 * Generate column config
 * If column do not have a definition, return a default column config.
 */
function generateColumnConfig(
  name: string,
  columnSettings: ColumnSettings[],
  unit: string
): TableColumnConfig<unknown> {
  for (const column of columnSettings) {
    if (column.name === name) {
      return {
        accessorKey: name,
        header: column.header ?? name,
        headerDescription: column.headerDescription,
        enableSorting: column.enableSorting,
        width: column.width,
        align: column.align,
        ...generateCellContentConfig(column, unit),
      };
    }
  }

  return {
    accessorKey: name,
    header: name,
  };
}

export function TableChart(props: TableChartProps): ReactElement {
  const { width, height, data } = props;

  const theme = useTheme();

  const availableHeight = height - 10;
  const availableWidth = width - 10;

  const rawData: TableChartSample[] = useMemo(() => {
    return tableRecursionJson(data.profile.stackTrace);
  }, [data]);

  const columns: Array<TableColumnConfig<unknown>> = useMemo(() => {
    const columns: Array<TableColumnConfig<unknown>> = [];

    const columnSettings: ColumnSettings[] = [
      {
        name: 'name',
        header: 'Name',
        headerDescription: 'Function name',
        align: 'left',
        enableSorting: true,
        width: (1 / 2) * availableWidth,
      },
      {
        name: 'self',
        header: 'Self',
        headerDescription: 'Function self samples',
        align: 'right',
        enableSorting: true,
        width: (1 / 4) * availableWidth,
      },
      {
        name: 'total',
        header: 'Total',
        headerDescription: 'Function total samples',
        align: 'right',
        enableSorting: true,
        width: (1 / 4) * availableWidth,
      },
    ];

    const unit = data.metadata?.units || '';

    const nameColumn = generateColumnConfig('name', columnSettings, unit);
    columns.push(nameColumn);

    const selfColumn = generateColumnConfig('self', columnSettings, unit);
    columns.push(selfColumn);

    const totalColumn = generateColumnConfig('total', columnSettings, unit);
    columns.push(totalColumn);

    return columns;
  }, [data.metadata?.units, availableWidth]);

  const [sorting, setSorting] = useState<SortingState>([]);

  const [pagination, setPagination] = useState<PaginationState | undefined>({
    pageIndex: 0,
    pageSize: availableHeight < LARGE_SCREEN_TRESHOLD ? 10 : 25,
  });

  return (
    <Stack
      width={availableWidth}
      height={availableHeight}
      sx={{
        paddingTop: `${PADDING_TOP}px`,
        '& .MuiTable-root': {
          borderCollapse: 'collapse',
        },
        '& .MuiTableCell-root': {
          borderBottom: `1px solid ${theme.palette.divider}`,
          borderRight: `1px solid ${theme.palette.divider}`,
          '&:last-child': {
            borderRight: 'none',
          },
        },
      }}
    >
      <Table
        data={rawData}
        columns={columns}
        height={availableHeight - PADDING_TOP}
        width={availableWidth}
        density={availableHeight < LARGE_SCREEN_TRESHOLD ? 'compact' : 'standard'}
        defaultColumnWidth="auto"
        defaultColumnHeight="auto"
        sorting={sorting}
        onSortingChange={setSorting}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </Stack>
  );
}
