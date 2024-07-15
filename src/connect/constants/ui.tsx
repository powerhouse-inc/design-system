import BudgetImg from '@/assets/icons/budget.png';
import GlobalImg from '@/assets/icons/global.png';
import LegalImg from '@/assets/icons/legal.png';
import ProfileImg from '@/assets/icons/profile.png';
import MakerdaoRWAPortfolioImg from '@/assets/icons/rwa-report.png';
import TemplateImg from '@/assets/icons/template.png';
import { Icon } from '@/powerhouse';

export const PUBLIC_DRIVE = 'PUBLIC_DRIVE';
export const LOCAL_DRIVE = 'LOCAL_DRIVE';
export const CLOUD_DRIVE = 'CLOUD_DRIVE';
export const DRIVE = 'DRIVE';
export const FOLDER = 'FOLDER';
export const FILE = 'FILE';

export const driveTypes = [PUBLIC_DRIVE, LOCAL_DRIVE, CLOUD_DRIVE] as const;
export const nodeTypes = [DRIVE, FOLDER, FILE] as const;
export const UPDATE = 'UPDATE';
export const NEW = 'NEW';
export const UPDATE_AND_MOVE = 'UPDATE_AND_MOVE';
export const UPDATE_AND_COPY = 'UPDATE_AND_COPY';

export const treeItemActions = [
    UPDATE,
    NEW,
    UPDATE_AND_MOVE,
    UPDATE_AND_COPY,
] as const;

export const SWITCHBOARD = 'SWITCHBOARD';
export const LOCAL = 'LOCAL';
export const CLOUD = 'CLOUD';
export const PUBLIC = 'PUBLIC';
export const sharingTypes = [LOCAL, CLOUD, PUBLIC] as const;
export const driveLocations = [LOCAL, CLOUD, SWITCHBOARD] as const;
export const sharingTypeOptions = [
    {
        value: LOCAL,
        icon: <Icon name="lock" />,
        description: 'Only available to you',
    },
    {
        value: CLOUD,
        icon: <Icon name="people" />,
        description: 'Only available to people in this drive',
    },
    {
        value: PUBLIC,
        icon: <Icon name="globe" />,
        description: 'Available to everyone',
        disabled: true,
    },
] as const;

export const DUPLICATE = 'DUPLICATE';
export const NEW_FOLDER = 'NEW_FOLDER';
export const RENAME = 'RENAME';
export const DELETE = 'DELETE';
export const SETTINGS = 'SETTINGS';
export const CREATE = 'CREATE';
export const WRITE = 'WRITE';
export const READ = 'READ';

export const nodeDropdownMenuOptions = [
    DUPLICATE,
    NEW_FOLDER,
    RENAME,
    DELETE,
    SETTINGS,
] as const;

export const locationInfoByLocation = {
    CLOUD: {
        title: 'Secure cloud',
        description: 'End to end encryption between members.',
        icon: <Icon name="lock" />,
    },
    LOCAL: {
        title: 'Local',
        description: 'Private and only available to you.',
        icon: <Icon name="hdd" />,
    },
    SWITCHBOARD: {
        title: 'Switchboard',
        description: 'Public and available to everyone.',
        icon: <Icon name="drive" />,
    },
} as const;

export const SYNCING = 'SYNCING';
export const SUCCESS = 'SUCCESS';
export const CONFLICT = 'CONFLICT';
export const MISSING = 'MISSING';
export const ERROR = 'ERROR';

export const syncStatuses = [
    SYNCING,
    SUCCESS,
    CONFLICT,
    MISSING,
    ERROR,
] as const;

export const documentTypes = [
    'legal',
    'global',
    'profile',
    'budget',
    'template',
    'makerdao/rwa-portfolio',
] as const;

export type DocumentType = (typeof documentTypes)[number];

export const iconMap: Record<DocumentType, string> = {
    legal: LegalImg,
    global: GlobalImg,
    profile: ProfileImg,
    budget: BudgetImg,
    template: TemplateImg,
    'makerdao/rwa-portfolio': MakerdaoRWAPortfolioImg,
};

export type FileItemIconType = keyof typeof iconMap;
