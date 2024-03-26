import { Icon } from '@/powerhouse';
import { FieldValues } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { RWAButton } from '../button';
import { ItemDetailsProps, TableItem } from './types';

export function ItemDetails<
    TItem extends TableItem,
    TFieldValues extends FieldValues = FieldValues,
>(props: ItemDetailsProps<TItem, TFieldValues>) {
    const {
        item,
        itemName,
        itemNumber,
        className,
        formInputs: FormInputs,
        operation = 'view',
        handleSubmit,
        onSubmit,
        reset,
        setSelectedItem,
        setShowNewItemForm,
        onCancel,
    } = props;

    const isEditOperation = operation === 'edit';
    const isCreateOperation = operation === 'create';

    function handleCancel() {
        reset();
        onCancel?.();
        if (operation === 'create') setShowNewItemForm?.(false);
        else setSelectedItem?.(undefined);
    }

    return (
        <div
            className={twMerge(
                'flex flex-col overflow-hidden rounded-md border border-gray-300 bg-white',
                className,
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
                            onClick={handleSubmit(onSubmit)}
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
                        onClick={() => setSelectedItem?.(item)}
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
