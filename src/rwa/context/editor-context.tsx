import { createContext, ReactNode, useContext, useMemo } from 'react';
import { EditorActionInputs, RealWorldAssetsState } from '../types';

export type TEditorContext = {
    readonly editorState: RealWorldAssetsState | undefined;
    readonly dispatchEditorAction: (action: EditorActionInputs) => void;
};

const defaultEditorContextValue: TEditorContext = {
    editorState: undefined,
    dispatchEditorAction: () => {},
};

export const EditorContext = createContext(defaultEditorContextValue);

type Props = TEditorContext & {
    readonly children: ReactNode;
};

export function EditorContextProvider({
    editorState,
    dispatchEditorAction,
    children,
}: Props) {
    const value = useMemo(
        () => ({ editorState, dispatchEditorAction }),
        [dispatchEditorAction, editorState],
    );
    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
}

export const useEditorContext = () => useContext(EditorContext);
