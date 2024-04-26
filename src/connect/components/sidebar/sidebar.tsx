import { Sidebar, SidebarPanel, SidebarProps } from '@/powerhouse';
import {
    ConnectSidebarFooter,
    ConnectSidebarFooterProps,
} from './sidebar-footer';
import {
    ConnectSidebarHeader,
    ConnectSidebarHeaderProps,
} from './sidebar-header';

export interface ConnectSidebarProps
    extends Omit<SidebarProps, 'maxWidth' | 'minWidth'>,
        ConnectSidebarHeaderProps,
        ConnectSidebarFooterProps {
    maxWidth?: string;
    minWidth?: string;
    headerContent?: React.ReactNode;
    loadingUser?: boolean;
    onLogin: () => void;
}

export const ConnectSidebar: React.FC<ConnectSidebarProps> = ({
    onToggle,
    username,
    address,
    avatarUrl,
    headerContent,
    onClickSettings,
    collapsed = false,
    maxWidth = '304px',
    minWidth = '58px',
    loadingUser,
    onLogin,
    ...props
}) => {
    return (
        <Sidebar
            {...props}
            collapsed={collapsed}
            maxWidth={maxWidth}
            minWidth={minWidth}
        >
            <SidebarPanel>
                <ConnectSidebarHeader onToggle={onToggle}>
                    {headerContent}
                </ConnectSidebarHeader>
                <div className="collapsed:hidden expanded:block">
                    {props.children}
                </div>
            </SidebarPanel>
            <ConnectSidebarFooter
                username={username}
                address={address}
                avatarUrl={avatarUrl}
                loadingUser={loadingUser}
                onLogin={onLogin}
                onClickSettings={onClickSettings}
            />
        </Sidebar>
    );
};
