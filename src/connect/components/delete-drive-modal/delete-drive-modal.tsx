import { Icon } from '@/powerhouse';
import { ComponentPropsWithoutRef, useState } from 'react';
import { Modal } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { Divider } from '..';

export type DeleteDriveModalProps = {
    driveName: string;
    onDeleteDrive: () => void;
    onCancel: () => void;
    modalProps?: ComponentPropsWithoutRef<typeof Modal>;
    containerProps?: ComponentPropsWithoutRef<'div'>;
};

export function DeleteDriveModal(props: DeleteDriveModalProps) {
    const [driveNameInput, setDriveNameInput] = useState('');

    const isAllowedToDelete = driveNameInput === props.driveName;

    function handleDeleteDrive() {
        if (isAllowedToDelete) {
            props.onDeleteDrive();
        }
    }

    return (
        <Modal {...props.modalProps}>
            <div
                {...props.containerProps}
                style={{
                    // todo: replace with tw class from style guide
                    boxShadow:
                        '0px 33px 32px -16px rgba(0, 0, 0, 0.10), 0px 0px 16px 4px rgba(0, 0, 0, 0.04)',
                }}
                className={twMerge(
                    'max-w-[449px] rounded-3xl bg-[#FCFCFC] p-6',
                    props.containerProps?.className,
                )}
            >
                <h1 className="mb-2 text-xl font-bold text-[#404446]">
                    Delete &ldquo;{props.driveName}&rdquo; drive?
                </h1>
                <Divider className="mb-6" />
                <p className="mb-2 rounded-[6px] bg-[#F3F5F7] p-4 text-center text-[#6C7275]">
                    Are you sure you want to delete this drive? All files and
                    subfolders within it will be removed. Do you want to
                    proceed?
                </p>
                <div className="mb-6 flex gap-2 rounded-xl bg-[#F4F4F4] p-3  text-[#6C7275]">
                    <Icon name="lock" />
                    <input
                        value={driveNameInput}
                        onChange={e => setDriveNameInput(e.target.value)}
                        placeholder="Enter drive name..."
                        id="driveName"
                        className="w-full bg-transparent font-semibold outline-none"
                    />
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={props.onCancel}
                        className="w-full rounded-xl bg-[#F3F5F7] px-6 py-3 text-[#6C7275]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteDrive}
                        disabled={!isAllowedToDelete}
                        className="w-full rounded-xl bg-[#EA4335] px-6 py-3 text-[#EFEFEF] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </Modal>
    );
}
