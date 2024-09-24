import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Operation } from '../components';
import { EditorActionInputs, RealWorldAssetsState } from '../types';

export type TEditorContext = {
    readonly editorState: RealWorldAssetsState;
    readonly isAllowedToCreateDocuments: boolean;
    readonly isAllowedToEditDocuments: boolean;
    readonly canUndo: boolean;
    readonly canRedo: boolean;
    readonly showForm: boolean;
    readonly operation: Operation;
    readonly setOperation: (operation: Operation) => void;
    readonly dispatchEditorAction: (action: EditorActionInputs) => void;
    readonly onSwitchboardLinkClick: (() => void) | undefined;
    readonly onExport: () => void;
    readonly onClose: () => void;
    readonly onShowRevisionHistory: () => void;
};

const defaultEditorContextValue: TEditorContext = {
    editorState: {
        accounts: [],
        fixedIncomeTypes: [],
        portfolio: [],
        principalLenderAccountId: '',
        serviceProviderFeeTypes: [],
        spvs: [],
        transactions: [],
    },
    isAllowedToCreateDocuments: false,
    isAllowedToEditDocuments: false,
    canUndo: false,
    canRedo: false,
    onSwitchboardLinkClick: undefined,
    showForm: false,
    operation: null,
    setOperation: () => {},
    onExport: () => {},
    onClose: () => {},
    onShowRevisionHistory: () => {},
    dispatchEditorAction: () => {},
};

export const EditorContext = createContext(defaultEditorContextValue);

type Props = Omit<TEditorContext, 'showForm' | 'operation' | 'setOperation'> & {
    readonly children: ReactNode;
};

export function EditorContextProvider({
    children,
    editorState,
    isAllowedToCreateDocuments,
    isAllowedToEditDocuments,
    canUndo,
    canRedo,
    dispatchEditorAction,
    onExport,
    onClose,
    onSwitchboardLinkClick,
    onShowRevisionHistory,
}: Props) {
    const [operation, setOperation] = useState<Operation>(null);

    const showForm = operation !== null;

    const value = useMemo(
        () => ({
            editorState,
            canUndo,
            canRedo,
            isAllowedToCreateDocuments,
            isAllowedToEditDocuments,
            showForm,
            operation,
            setOperation,
            dispatchEditorAction,
            onExport,
            onClose,
            onSwitchboardLinkClick,
            onShowRevisionHistory,
        }),
        [
            canRedo,
            canUndo,
            dispatchEditorAction,
            editorState,
            isAllowedToCreateDocuments,
            isAllowedToEditDocuments,
            onClose,
            onExport,
            onShowRevisionHistory,
            onSwitchboardLinkClick,
            operation,
            showForm,
        ],
    );
    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
}

export const useEditorContext = () => useContext(EditorContext);
