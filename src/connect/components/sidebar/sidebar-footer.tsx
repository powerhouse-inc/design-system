import { Icon, SidebarFooter, SidebarFooterProps } from '@/powerhouse';
import { Button } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { SidebarUser, SidebarUserProps } from './sidebar-user';

export interface ConnectSidebarFooterProps
    extends SidebarFooterProps,
        SidebarUserProps {
    onClickSettings?: () => void;
}

export const ConnectSidebarFooter: React.FC<ConnectSidebarFooterProps> = ({
    username,
    address,
    avatarUrl,
    className,
    onClickSettings,
    ...props
}) => {
    return (
        <SidebarFooter
            {...props}
            className={twMerge(
                'border-t border-slate-700/10 p-4 collapsed:px-1 expanding:px-1',
                className,
            )}
        >
            <SidebarUser
                username={username}
                address={address}
                avatarUrl={avatarUrl}
            />
            <Button
                className="flex w-full gap-3 px-5 py-3 outline-none collapsed:px-3 expanding:px-3"
                onPress={onClickSettings}
            >
                <Icon name="settings" className="text-gray-600" />
                <span className="text-sm font-semibold leading-6 text-gray-800 collapsed:hidden expanding:hidden">
                    Settings
                </span>
            </Button>
        </SidebarFooter>
    );
};
