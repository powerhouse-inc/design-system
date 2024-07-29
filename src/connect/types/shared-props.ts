import {
    TNodeOptions,
    UiDriveNode,
    UiFileNode,
    UiFolderNode,
    UiNode,
} from '@/connect';
import { UseDraggableTargetProps } from '@/powerhouse';

export type UiNodeDraggableTargetProps = Pick<
    UseDraggableTargetProps<UiNode>,
    'onDragStart' | 'onDragEnd' | 'onDropEvent'
>;

export type DragAndDropProps = UiNodeDraggableTargetProps & {
    disableDropBetween: boolean;
    disableHighlightStyles: boolean;
    onDropActivate: (dropTargetItem: UiNode) => void;
};

export type NodeProps = {
    nodeOptions: TNodeOptions;
    isAllowedToCreateDocuments: boolean;
    isRemoteDrive: boolean;
    onAddFolder: (name: string, uiNode: UiNode) => void;
    onAddFile: (file: File, parentNode: UiNode | null) => Promise<void>;
    onAddAndSelectNewFolder: (name: string) => Promise<void>;
    onRenameNode: (name: string, uiNode: UiNode) => void;
    onMoveNode: (uiNode: UiNode, targetNode: UiNode) => Promise<void>;
    onCopyNode: (uiNode: UiNode, targetNode: UiNode) => Promise<void>;
    onDuplicateNode: (uiNode: UiNode) => void;
    onDeleteNode: (uiNode: UiFileNode | UiFolderNode) => void;
    onDeleteDrive: (uiNode: UiDriveNode) => void;
    onAddTrigger: (uiNodeDriveId: string) => void;
    onRemoveTrigger: (uiNodeDriveId: string) => void;
    onAddInvalidTrigger: (uiNodeDriveId: string) => void;
};
