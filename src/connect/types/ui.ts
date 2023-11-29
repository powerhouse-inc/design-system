export type TreeItemType =
    | 'folder'
    | 'file'
    | 'local-drive'
    | 'cloud-drive'
    | 'public-drive';

export type TreeItemAction =
    | 'update'
    | 'new'
    | 'update-and-move'
    | 'update-and-copy';
