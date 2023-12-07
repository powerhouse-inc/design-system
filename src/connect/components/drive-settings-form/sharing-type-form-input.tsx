import { DriveSettingsSelect, Inputs, sharingTypeOptions } from '@/connect';
import { ComponentPropsWithRef } from 'react';
import { Control, Controller } from 'react-hook-form';

type SharingTypeFormInputProps = Omit<
    ComponentPropsWithRef<typeof DriveSettingsSelect>,
    'id' | 'items' | 'value' | 'onChange'
> & {
    control: Control<Inputs>;
};
export function SharingTypeFormInput(props: SharingTypeFormInputProps) {
    const { control, ...delegatedProps } = props;

    return (
        <Controller
            name="sharingType"
            control={control}
            render={({ field }) => (
                <DriveSettingsSelect
                    {...delegatedProps}
                    {...field}
                    id="sharingType"
                    items={sharingTypeOptions}
                />
            )}
        />
    );
}
