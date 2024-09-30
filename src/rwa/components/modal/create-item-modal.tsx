import { Icon, Modal } from '@/powerhouse';
import { ModalFormInputs, TableName, useTableForm } from '@/rwa';
import { ComponentPropsWithoutRef, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';

export type RWACreateItemModalProps = ComponentPropsWithoutRef<typeof Modal> & {
    readonly open: boolean;
    readonly tableName: TableName;
    readonly onOpenChange: (open: boolean) => void;
};

export function RWACreateItemModal(props: RWACreateItemModalProps) {
    const { tableName, open, onOpenChange } = props;

    const { reset, submit, inputs } = useTableForm({
        operation: 'create',
        tableName,
    });

    const handleCancel = useCallback(() => {
        reset();
        onOpenChange(false);
    }, [onOpenChange, reset]);

    const buttonStyles =
        'min-h-[48px] min-w-[142px] text-base font-semibold py-3 px-6 rounded-xl outline-none active:opacity-75 hover:scale-105 transform transition-all';

    return (
        <Modal
            contentProps={{
                className: 'rounded-3xl',
            }}
            onOpenChange={onOpenChange}
            open={open}
            overlayProps={{
                className: 'top-10',
            }}
        >
            <div className="w-[400px] p-6 text-slate-300">
                <div className="mb-6 flex justify-between">
                    <h1 className="text-xl font-bold">Create {tableName}</h1>
                    <button
                        className="flex size-8 items-center justify-center rounded-md bg-gray-100 text-gray-500 outline-none hover:text-gray-900"
                        onClick={handleCancel}
                        tabIndex={-1}
                    >
                        <Icon name="XmarkLight" size={24} />
                    </button>
                </div>
                <ModalFormInputs inputs={inputs} />
                <div className="mt-8 flex justify-between gap-3">
                    <button
                        className={twMerge(
                            buttonStyles,
                            'flex-1 bg-slate-50 text-slate-800',
                        )}
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className={twMerge(
                            buttonStyles,
                            'flex-1 bg-gray-800 text-gray-50',
                        )}
                        onClick={submit}
                    >
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    );
}
