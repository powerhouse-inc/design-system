import {
    CashAsset,
    DispatchEditorAction,
    editorStateKeysByTableName,
    FixedIncome,
    getCashAsset,
    getFixedIncomeAssets,
    Operation,
    RealWorldAssetsState,
    TableItemType,
    TableName,
} from '@/rwa';
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from 'react';
import { EditorAction } from '../types/actions';

export type RWAEditorContextProps = {
    readonly isAllowedToCreateDocuments: boolean;
    readonly isAllowedToEditDocuments: boolean;
    readonly canUndo: boolean;
    readonly canRedo: boolean;
    readonly onSwitchboardLinkClick: (() => void) | undefined;
    readonly onExport: () => void;
    readonly onClose: () => void;
    readonly onShowRevisionHistory: () => void;
};
type TEditorContext = RWAEditorContextProps &
    RealWorldAssetsState & {
        readonly cashAsset: CashAsset;
        readonly fixedIncomes: FixedIncome[];
        readonly selectedTableItem: TableItemType<TableName> | null;
        readonly selectedTableName: TableName | null;
        readonly operation: Operation;
        readonly viewItem: (
            item: TableItemType<TableName>,
            tableName: TableName,
        ) => void;
        readonly createItem: (tableName: TableName) => void;
        readonly editItem: (
            item: TableItemType<TableName>,
            tableName: TableName,
        ) => void;
        readonly clearSelected: () => void;
        readonly getIsFormOpen: (tableName: TableName) => boolean;
        readonly handleAction: (
            action: EditorAction,
            tableName: TableName,
        ) => void;
        readonly handleUndo: () => void;
        readonly handleRedo: () => void;
    };

const defaultEditorContextValue: TEditorContext = {
    accounts: [],
    fixedIncomeTypes: [],
    portfolio: [],
    principalLenderAccountId: '',
    serviceProviderFeeTypes: [],
    spvs: [],
    transactions: [],
    fixedIncomes: [],
    cashAsset: {
        id: '',
        type: 'Cash',
        currency: 'USD',
        balance: 0,
        spvId: '',
    },
    isAllowedToCreateDocuments: false,
    isAllowedToEditDocuments: false,
    canUndo: false,
    canRedo: false,
    operation: null,
    onSwitchboardLinkClick: undefined,
    selectedTableItem: null,
    selectedTableName: null,
    getIsFormOpen: () => false,
    clearSelected: () => {},
    viewItem: () => {},
    createItem: () => {},
    editItem: () => {},
    onExport: () => {},
    onClose: () => {},
    handleUndo: () => {},
    handleRedo: () => {},
    onShowRevisionHistory: () => {},
    handleAction: () => {},
};

const EditorContext = createContext(defaultEditorContextValue);

type TableState<TTableName extends TableName> = {
    selectedTableItem: TableItemType<TTableName> | null;
    selectedTableName: TTableName | null;
    operation: Operation;
};

type TableAction<TTableName extends TableName> =
    | {
          type: 'VIEW_ITEM';
          item: TableItemType<TTableName>;
          tableName: TTableName;
      }
    | { type: 'CREATE_ITEM'; tableName: TTableName }
    | {
          type: 'EDIT_ITEM';
          item: TableItemType<TTableName>;
          tableName: TTableName;
      }
    | { type: 'CLEAR_SELECTED' };

function tableReducer<TTableName extends TableName>(
    state: TableState<TTableName>,
    action: TableAction<TTableName>,
): TableState<TTableName> {
    switch (action.type) {
        case 'VIEW_ITEM':
            return {
                selectedTableItem: action.item,
                selectedTableName: action.tableName,
                operation: 'view',
            };
        case 'CREATE_ITEM':
            return {
                selectedTableItem: null,
                selectedTableName: action.tableName,
                operation: 'create',
            };
        case 'EDIT_ITEM':
            return {
                selectedTableItem: action.item,
                selectedTableName: action.tableName,
                operation: 'edit',
            };
        case 'CLEAR_SELECTED':
            return {
                selectedTableItem: null,
                selectedTableName: null,
                operation: null,
            };
        default:
            return state;
    }
}

export function RWAEditorContextProvider(
    props: RWAEditorContextProps & {
        readonly children: ReactNode;
        readonly state: RealWorldAssetsState;
        readonly dispatchEditorAction: DispatchEditorAction;
        readonly undo: () => void;
        readonly redo: () => void;
    },
) {
    const {
        children,
        state,
        isAllowedToCreateDocuments,
        isAllowedToEditDocuments,
        canUndo,
        canRedo,
        undo,
        redo,
        dispatchEditorAction,
        onExport,
        onClose,
        onSwitchboardLinkClick,
        onShowRevisionHistory,
    } = props;
    const [editorState, setEditorState] = useState(state);
    const stateRef = useRef(state);
    const [tableState, tableDispatch] = useReducer(tableReducer, {
        selectedTableItem: null,
        selectedTableName: null,
        operation: null,
    });

    const { selectedTableItem, selectedTableName, operation } = tableState;

    useEffect(() => {
        if (operation === null || operation === 'view') {
            setEditorState(stateRef.current);
        }
    }, [operation, state]);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const {
        accounts,
        fixedIncomeTypes,
        portfolio,
        principalLenderAccountId,
        serviceProviderFeeTypes,
        spvs,
        transactions,
    } = editorState;

    const cashAsset = useMemo(() => getCashAsset(portfolio), [portfolio])!;

    const fixedIncomes = useMemo(
        () => getFixedIncomeAssets(portfolio),
        [portfolio],
    );

    const handleUndo = useCallback(() => {
        if (!canUndo) return;
        undo();
        if (operation === 'edit') {
            tableDispatch({
                type: 'VIEW_ITEM',
                item: selectedTableItem!,
                tableName: selectedTableName!,
            });
        }
    }, [canUndo, operation, selectedTableItem, selectedTableName, undo]);

    const handleRedo = useCallback(() => {
        if (!canRedo) return;
        redo();
        if (operation === 'edit') {
            tableDispatch({
                type: 'VIEW_ITEM',
                item: selectedTableItem!,
                tableName: selectedTableName!,
            });
        }
    }, [canRedo, operation, redo, selectedTableItem, selectedTableName]);

    const getIsFormOpen = useCallback(
        (tableName: TableName) => selectedTableName === tableName,
        [selectedTableName],
    );

    const viewItem = useCallback(
        (item: TableItemType<TableName>, tableName: TableName) => {
            tableDispatch({ type: 'VIEW_ITEM', item, tableName });
        },
        [],
    );

    const createItem = useCallback((tableName: TableName) => {
        tableDispatch({ type: 'CREATE_ITEM', tableName });
    }, []);

    const editItem = useCallback(
        (item: TableItemType<TableName>, tableName: TableName) => {
            tableDispatch({ type: 'EDIT_ITEM', item, tableName });
        },
        [],
    );

    const clearSelected = useCallback(() => {
        tableDispatch({ type: 'CLEAR_SELECTED' });
        setEditorState(stateRef.current);
    }, []);

    const handleAction = useCallback(
        (action: EditorAction, tableName: TableName) => {
            try {
                const result = dispatchEditorAction(action);
                const editorStateKey = editorStateKeysByTableName[tableName];
                const isCreate = action.type.startsWith('CREATE') && !!result;
                if (isCreate) {
                    setEditorState(prev => {
                        if (tableName === selectedTableName) {
                            tableDispatch({
                                type: 'VIEW_ITEM',
                                item: {
                                    ...result,
                                    itemNumber: prev[editorStateKey].length + 1,
                                } as TableItemType<TableName>,
                                tableName,
                            });
                        }

                        return {
                            ...prev,
                            [editorStateKey]: [...prev[editorStateKey], result],
                        };
                    });
                }
            } catch (error) {
                console.error(
                    `Failed to dispatch action ${action.type}`,
                    error,
                );
            }
        },
        [dispatchEditorAction, selectedTableName],
    );

    const value = useMemo(
        () => ({
            accounts,
            fixedIncomeTypes,
            portfolio,
            principalLenderAccountId,
            serviceProviderFeeTypes,
            spvs,
            transactions,
            cashAsset,
            fixedIncomes,
            canUndo,
            canRedo,
            isAllowedToCreateDocuments,
            isAllowedToEditDocuments,
            selectedTableItem,
            selectedTableName,
            operation,
            handleAction,
            handleUndo,
            handleRedo,
            viewItem,
            createItem,
            editItem,
            clearSelected,
            getIsFormOpen,
            onExport,
            onClose,
            onSwitchboardLinkClick,
            onShowRevisionHistory,
        }),
        [
            accounts,
            canRedo,
            canUndo,
            cashAsset,
            clearSelected,
            createItem,
            editItem,
            fixedIncomeTypes,
            fixedIncomes,
            getIsFormOpen,
            handleAction,
            handleRedo,
            handleUndo,
            isAllowedToCreateDocuments,
            isAllowedToEditDocuments,
            onClose,
            onExport,
            onShowRevisionHistory,
            onSwitchboardLinkClick,
            operation,
            portfolio,
            principalLenderAccountId,
            selectedTableItem,
            selectedTableName,
            serviceProviderFeeTypes,
            spvs,
            transactions,
            viewItem,
        ],
    );
    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
}

export function useEditorContext() {
    return useContext(EditorContext);
}