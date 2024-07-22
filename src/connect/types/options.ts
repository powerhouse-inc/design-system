import {
    debugNodeOptions,
    DRIVE,
    FILE,
    FOLDER,
    nodeOptions,
    normalNodeOptions,
    SharingType,
} from '@/connect';

export type NormalNodeOptions = typeof normalNodeOptions;
export type DebugNodeOptions = typeof debugNodeOptions;
export type NodeOptions = typeof nodeOptions;
export type NormalNodeOption = NormalNodeOptions[number];
export type DebugNodeOption = DebugNodeOptions[number];
export type NodeOption = NodeOptions[number];

export type TNodeOptions = Record<
    SharingType,
    {
        [DRIVE]: NodeOption[];
        [FOLDER]: NodeOption[];
        [FILE]: NodeOption[];
    }
>;
