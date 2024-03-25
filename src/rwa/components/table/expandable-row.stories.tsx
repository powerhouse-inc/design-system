import type { Meta, StoryObj } from '@storybook/react';
import { RWATableRow } from './expandable-row';
import { TableBase } from './table-base';

const meta: Meta<typeof RWATableRow> = {
    title: 'RWA/Components/RWATableRow',
    component: RWATableRow,
    argTypes: {
        children: { control: 'object' },
        accordionContent: { control: 'object' },
        isExpanded: { control: 'boolean' },
        tdProps: { control: 'object' },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        accordionContent: (
            <div className="bg-gray-100 p-4 text-center">
                <p>Accordion content</p>
            </div>
        ),
        isExpanded: true,
    },
    render: args => (
        <TableBase
            renderRow={row => (
                <RWATableRow {...args} tdProps={{ colSpan: 4 }}>
                    <td>{row.cell1}</td>
                    <td>{row.cell2}</td>
                    <td>{row.cell3}</td>
                    <td>{row.cell4}</td>
                </RWATableRow>
            )}
            tableData={[
                {
                    id: '1',
                    cell1: 'Cell 1-1',
                    cell2: 'Cell 2-1',
                    cell3: 'Cell 3-1',
                    cell4: 'Cell 4-1',
                },
                {
                    id: '2',
                    cell1: 'Cell 1-2',
                    cell2: 'Cell 2-2',
                    cell3: 'Cell 3-2',
                    cell4: 'Cell 4-2',
                },
            ]}
            columns={[
                { key: 'cell1', label: 'Column 1' },
                { key: 'cell2', label: 'Column 2' },
                { key: 'cell3', label: 'Column 3' },
                { key: 'cell4', label: 'Column 4' },
            ]}
        />
    ),
};
