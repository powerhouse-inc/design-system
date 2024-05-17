import { Icon } from '@/powerhouse';
import { ComponentPropsWithoutRef, ReactNode } from 'react';
import Select, {
    ClearIndicatorProps,
    DropdownIndicatorProps,
    MenuListProps,
    components,
} from 'react-select';

type SelectProps = ComponentPropsWithoutRef<typeof Select>;

type Props = Omit<SelectProps, 'components' | 'styles' | 'theme'> & {
    addItemButtonProps?: {
        addItemButtonLabel?: ReactNode;
        onAddItem?: () => void;
    };
};

function DropdownIndicator(props: DropdownIndicatorProps) {
    return (
        <components.DropdownIndicator {...props}>
            <Icon name="chevron-down" size={16} />
        </components.DropdownIndicator>
    );
}

function ClearIndicator(props: ClearIndicatorProps) {
    return (
        <components.ClearIndicator {...props}>
            <Icon name="xmark" size={16} />
        </components.ClearIndicator>
    );
}

function MenuList(
    props: MenuListProps & {
        addItemButtonLabel?: ReactNode;
        onAddItem?: () => void;
    },
) {
    const { addItemButtonLabel, onAddItem, ...rest } = props;

    const hasAddItemButton = !!addItemButtonLabel && !!onAddItem;

    return (
        <components.MenuList {...rest}>
            {props.children}
            {hasAddItemButton && (
                <button
                    onClick={onAddItem}
                    className="w-full px-2 py-3 hover:bg-slate-50"
                >
                    {addItemButtonLabel}
                </button>
            )}
        </components.MenuList>
    );
}

export function Combobox(props: Props) {
    const { addItemButtonProps, ...rest } = props;

    return (
        <Select
            {...rest}
            components={{
                DropdownIndicator,
                ClearIndicator,
                MenuList: menuListProps =>
                    MenuList({ ...menuListProps, ...addItemButtonProps }),
            }}
            styles={{
                dropdownIndicator: () => {
                    return {
                        label: 'indicatorContainer',
                        display: 'flex',
                        transition: 'color 150ms',
                        color: 'var(--gray-900)',
                        padding: 8,
                        boxSizing: 'border-box',
                    };
                },
                clearIndicator: baseStyles => {
                    return {
                        ...baseStyles,
                        color: 'var(--gray-900)',
                    };
                },
                container: baseStyles => {
                    return {
                        ...baseStyles,
                        borderColor: 'var(--gray-200)',
                        fontSize: 12,
                    };
                },
                control: () => {
                    return {
                        label: 'control',
                        alignItems: 'center',
                        cursor: 'default',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        minHeight: 32,
                        outline: '0 !important',
                        position: 'relative',
                        transition: 'all 100ms',
                        backgroundColor: 'var(--white)',
                        borderColor: 'var(--gray-200)',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderRadius: '6px',
                        boxSizing: 'border-box',
                    };
                },
                option: (baseStyles, state) => {
                    return {
                        ...baseStyles,
                        backgroundColor: state.isSelected
                            ? 'var(--slate-50)'
                            : 'var(--white)',
                        color: 'var(--gray-800)',
                        ':hover': {
                            backgroundColor: 'var(--slate-50)',
                        },
                    };
                },
                menuList: baseStyles => ({
                    ...baseStyles,
                    padding: 0,
                    borderRadius: '6px',
                }),
            }}
            theme={theme => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    primary: 'var(--slate-100)',
                    primary25: 'var(--slate-50)',
                    primary50: 'var(--slate-100)',
                    primary75: 'var(--slate-100)',
                    danger: 'var(--red-900)',
                    dangerLight: 'var(--red-100)',
                    neutral0: 'var(--white)',
                    neutral5: 'var(--gray-50)',
                    neutral10: 'var(--gray-100)',
                    neutral20: 'var(--gray-200)',
                    neutral30: 'var(--gray-300)',
                    neutral40: 'var(--gray-400)',
                    neutral50: 'var(--gray-500)',
                    neutral60: 'var(--gray-600)',
                    neutral70: 'var(--gray-700)',
                    neutral80: 'var(--gray-800)',
                    neutral90: 'var(--gray-900)',
                },
            })}
        />
    );
}
