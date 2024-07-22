import {
    TNodeOptions,
    UiDriveNode,
    UiFileNode,
    UiFolderNode,
    UiNode,
} from '@/connect';
import { UseDraggableTargetProps } from '@/powerhouse';

export type DragAndDropProps = {
    disableDropBetween: boolean;
    disableHighlightStyles: boolean;
    onDropActivate: (dropTargetItem: UiNode) => void;
    onDropEvent: UseDraggableTargetProps<UiNode>['onDropEvent'];
    onDragStart: UseDraggableTargetProps<UiNode>['onDragStart'];
    onDragEnd: UseDraggableTargetProps<UiNode>['onDragEnd'];
};

export type NodeProps = {
    nodeOptions: TNodeOptions;
    isAllowedToCreateDocuments: boolean;
    isRemoteDrive: boolean;
    onAddFolder: (name: string, uiNode: UiNode) => void;
    onRenameNode: (name: string, uiNode: UiNode) => void;
    onDuplicateNode: (uiNode: UiNode) => void;
    onDeleteNode: (uiNode: UiFileNode | UiFolderNode) => void;
    onDeleteDrive: (uiNode: UiDriveNode) => void;
    onAddTrigger: (uiNodeDriveId: string) => void;
    onRemoveTrigger: (uiNodeDriveId: string) => void;
    onAddInvalidTrigger: (uiNodeDriveId: string) => void;
};
