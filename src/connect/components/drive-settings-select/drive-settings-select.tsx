import * as Select from '@radix-ui/react-select';

export type SelectItem = {
    value: string;
    icon?: React.JSX.Element;
    disabled?: boolean;
};

export type DriveSettingsSelectProps = {
    items: SelectItem[];
    value: string;
    icon?: React.JSX.Element;
    onValueChange: (value: string) => void;
};

export function DriveSettingsSelect(props: DriveSettingsSelectProps) {
    const selectedItem = getItemByValue(props.value) ?? props.items[0];
    function getItemByValue(value: string) {
        return props.items.find(item => item.value === value);
    }
    return (
        <Select.Root value={props.value}>
            <Select.Trigger>
                <Select.Value asChild>
                    <ItemContainer {...selectedItem} />
                </Select.Value>
            </Select.Trigger>
            <Select.Content>
                {props.items
                    .filter(item => item.value !== props.value)
                    .map(item => (
                        <Select.Item key={item.value} value={item.value}>
                            <Select.ItemText asChild>
                                <ItemContainer {...item} />
                            </Select.ItemText>
                        </Select.Item>
                    ))}
            </Select.Content>
        </Select.Root>
    );
}

function ItemContainer(props: SelectItem) {
    return (
        <div>
            {props.icon}
            <div>{props.value}</div>
        </div>
    );
}
