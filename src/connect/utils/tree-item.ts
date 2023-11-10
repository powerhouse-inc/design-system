import { DriveTreeItem } from '@/connect/components/drive-view';
import { DefaultOptionId, TreeItem } from '@/connect/components/tree-view-item';

export const traverseTree = <T extends string = DefaultOptionId>(
    item: TreeItem<T>,
    callback: (item: TreeItem<T>) => TreeItem<T>,
): TreeItem<T> => {
    const treeItem = callback(item);

    if (treeItem.children) {
        treeItem.children = treeItem.children.map(child =>
            traverseTree(child, callback),
        );
    }

    return { ...treeItem };
};

export const traverseDriveById = <T extends string = DefaultOptionId>(
    drives: DriveTreeItem<T>[],
    driveID: string,
    callback: (item: TreeItem<T>) => TreeItem<T>,
): DriveTreeItem<T>[] => {
    const newDrives = drives.map(drive => {
        if (drive.id === driveID) {
            return traverseTree(drive, callback);
        }

        return { ...drive };
    }) as DriveTreeItem<T>[];

    return newDrives;
};
