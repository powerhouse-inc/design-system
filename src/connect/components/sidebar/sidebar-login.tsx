import renownHover from '@/assets/renown-hover.png';
import renown from '@/assets/renown.png';

export interface SidebarLoginProps {
    onLogin: () => void;
}

export const SidebarLogin: React.FC<SidebarLoginProps> = ({ onLogin }) => {
    return (
        <button
            className="group/sidebar-footer flex w-full cursor-pointer items-baseline justify-start px-5 py-2.5 text-sm font-semibold leading-10 text-gray-600"
            onClick={onLogin}
        >
            <span>Login with</span>
            <img
                src={renown}
                className="ml-2 h-5 text-gray-500 group-hover/sidebar-footer:hidden"
            />
            <img
                src={renownHover}
                className="ml-2 hidden  h-5 text-gray-900 group-hover/sidebar-footer:block"
            />
        </button>
    );
};
