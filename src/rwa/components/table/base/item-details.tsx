import { Icon } from '@/powerhouse';
import { ItemDetailsProps, RWAButton, TableItem } from '@/rwa';
import { FieldValues } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

/**
 * Displays and allows creating or editing an item. Intended to be used with react-hook-form.
 *
 * @type TItem - Table item type, any record with an "id" field and any string keys
 * @type TFieldValues - Field values type for the forms, must satisfy FieldValues (from react-hook-form)
 *
 * @param item - The item to display or edit, must satisfy TableItem
 * @param itemName - Name of the item, e.g. "Transaction" or "Asset". Comes from the ancestor `Table` element
 * @param itemNumber - Number of the item, e.g. "1" or "2". Comes from the ancestor `Table` element. Usually is `index + 1` when editing an existing item, and `tableData.length + 1` when creating a new item
 * @param className - Additional classes to apply to the item details container
 * @param formInputs - Form inputs defined in the parent component. Intended to be a React component that accepts no props and registers form inputs with react-hook-form
 * @param operation - Operation to perform on the item. Can be 'view', 'edit', or 'create'. Defaults to 'view'
 * @param handleSubmit - Function to handle form submission, returned by the `useForm` hook which is called in the parent `*Details` element
 * @param onSubmit - Submit handler to be called by `handleSubmit`. defined in the parent `*Details` element
 * @param reset - Function to reset the form, returned by the `useForm` hook which is called in the parent `*Details` element
 * @param setSelectedItem - Function to set the selected item in the parent `Table` element
 * @param setShowNewItemForm - Function to set the showNewItemForm state in the parent `Table` element
 * @param onCancel - Function to call when the cancel button is clicked if additional logic is required. The form is already reset and the item is deselected by default.
 */
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
