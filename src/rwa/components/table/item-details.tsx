import { DivProps, Icon, mergeClassNameProps } from '@/powerhouse';
import { ComponentType } from 'react';
import { RWAButton } from '../button';
import { TableItem } from './types';

export type ItemDetailsProps<TItem extends TableItem> = DivProps & {
    item: TItem | undefined;
    itemName: string;
    operation: 'view' | 'create' | 'edit';
    itemNumber: number;
    formInputs: ComponentType;
    selectItemToEdit: () => void;
    performSubmit: () => void;
    handleCancel: () => void;
};
export function ItemDetails(props: ItemDetailsProps<TableItem>) {
    const {
        item,
        itemName,
        itemNumber,
        formInputs: FormInputs,
        operation = 'view',
        selectItemToEdit,
        performSubmit,
        handleCancel,
        ...restProps
    } = props;

    const isEditOperation = operation === 'edit';
    const isCreateOperation = operation === 'create';

    return (
        <div
            {...mergeClassNameProps(
                restProps,
                'flex flex-col overflow-hidden rounded-md border border-gray-300 bg-white',
            )}
        >
            <div className="flex justify-between border-b border-gray-300 bg-gray-100 p-3 font-semibold text-gray-800">
                <div className="flex items-center">
                    {itemName} #{itemNumber}
                </div>
                {isEditOperation || isCreateOperation ? (
                    <div className="flex gap-x-2">
                        <RWAButton
                            onClick={handleCancel}
                            className="text-gray-600"
                        >
                            Cancel
                        </RWAButton>
                        <RWAButton
                            onClick={performSubmit}
                            iconPosition="right"
                            icon={<Icon name="save" size={16} />}
                        >
                            {isCreateOperation
                                ? 'Save New ' + itemName
                                : 'Save Edits'}
                        </RWAButton>
                    </div>
                ) : (
                    <RWAButton
                        onClick={selectItemToEdit}
                        iconPosition="right"
                        icon={<Icon name="pencil" size={16} />}
                    >
                        Edit {itemName}
                    </RWAButton>
                )}
            </div>
            <FormInputs />
        </div>
    );
}
