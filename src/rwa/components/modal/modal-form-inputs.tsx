import { ComponentType } from 'react';

type Input = {
    label: string;
    Input: ComponentType;
};
type Props = {
    inputs: Input[];
};
export function ModalFormInputs(props: Props) {
    const { inputs } = props;
    return (
        <div className="bg-white text-xs font-medium">
            {inputs.map(({ label, Input }, index) => (
                <div key={label}>
                    <div>{label}</div>
                    <div className="py-2 text-gray-900" key={index}>
                        <Input />
                    </div>
                </div>
            ))}
        </div>
    );
}
