import { Icon, SidebarHeader, SidebarHeaderProps } from '@/powerhouse';
import { twMerge } from 'tailwind-merge';

export interface ConnectSidebarHeaderProps extends SidebarHeaderProps {
    onToggle: () => void;
}

export const ConnectSidebarHeader: React.FC<ConnectSidebarHeaderProps> = ({
    onToggle,
    className,
    children,
    ...props
}) => {
    return (
        <SidebarHeader
            {...props}
            className={twMerge(
                'mb-4 flex justify-between gap-4 px-4 pt-11 collapsed:justify-center',
                className,
            )}
        >
            <div className="collapsed:hidden expanding:hidden">
                {children || (
                    <input
                        placeholder="Create new document"
                        className="flex-1 rounded-md border border-gray-100 px-5 py-3 leading-none text-gray-600 placeholder-shown:bg-transparent"
                    />
                )}
            </div>
            <button
                className="rounded-md border border-gray-100 p-3 outline-none hover:bg-slate-50
                collapsed:rotate-180 collapsed:border-gray-100/10 collapsed:bg-gray-100
                collapsed:shadow-sidebar collapsed:hover:bg-slate-50
                expanding:hidden"
                onClick={() => onToggle()}
            >
                <Icon name="ArrowLeft" size={16} className="text-gray-600" />
            </button>
        </SidebarHeader>
    );
};
