import { ReactNode } from 'react';

export type TableItem = {
    id: string;
} & Record<string, any>;

export type SpecialColumns = {
    index: number;
    moreDetails: null;
};

export interface TableColumn<TItem> {
    key: keyof TItem & string;
    label: ReactNode | null; // Allows JSX or string labels, null for no header
    allowSorting?: boolean;
    isSpecialColumn?: boolean; // New property to identify index or more details columns
}
