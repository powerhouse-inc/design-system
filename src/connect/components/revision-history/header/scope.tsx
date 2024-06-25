import { Select } from '../../select';

type Props = {
    value: 'global' | 'local';
    onChange: (value: string) => void;
};
export function Scope(props: Props) {
    const { value, onChange } = props;
    const items = [
        { displayValue: 'Global scope', value: 'global' },
        { displayValue: 'Local scope', value: 'local' },
    ] as const;

    return (
        <Select
            id="scope select"
            value={value}
            items={items}
            onChange={onChange}
            containerClassName="bg-slate-50 text-gray-500 rounded-lg w-fit"
            menuClassName="min-w-0 text-gray-500"
            itemClassName="py-1 text-gray-500 grid grid-cols-[auto,auto] gap-1"
        />
    );
}
