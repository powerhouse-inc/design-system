import { DriveTreeItem } from '@/connect/components/drive-view';
import { TreeItem } from '@/connect/components/tree-view-item';
import { RefObject } from 'react';

export const traverseTree = (
    item: TreeItem,
    callback: (item: TreeItem) => TreeItem,
): TreeItem => {
    const treeItem = callback(item);

    if (treeItem.children) {
        treeItem.children = treeItem.children.map(child =>
            traverseTree(child, callback),
        );
    }

    return { ...treeItem };
};

export const traverseDriveById = (
    drives: DriveTreeItem[],
    driveID: string,
    callback: (item: TreeItem) => TreeItem,
): DriveTreeItem[] => {
    const newDrives = drives.map(drive => {
        if (drive.id === driveID) {
            return traverseTree(drive, callback);
        }

        return { ...drive };
    }) as DriveTreeItem[];

    return newDrives;
};

export function getIsMouseInsideContainer(
    containerRef: RefObject<HTMLElement>,
    event: MouseEvent,
) {
    if (!containerRef.current) return false;
    const dimensions = containerRef.current.getBoundingClientRect();

    const { x, y, width, height } = dimensions;

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const isWithinX = mouseX >= x && mouseX <= x + width;
    const isWithinY = mouseY >= y && mouseY <= y + height;

    const isWithinContainer = isWithinX && isWithinY;

    return isWithinContainer;
}
