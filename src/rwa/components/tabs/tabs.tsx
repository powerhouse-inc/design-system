import { EditorActionButtons } from '@/connect';
import { OtherTab, PORTFOLIO, PortfolioTab, TransactionsTab } from '@/rwa';
import { useEditorContext } from '@/rwa/context/editor-context';
import { Content, List, Root, Trigger } from '@radix-ui/react-tabs';

export function RWATabs() {
    const tabs = ['Portfolio', 'Transactions', 'Other'] as const;
    const { onSwitchboardLinkClick, onExport, onClose, onShowRevisionHistory } =
        useEditorContext();

    return (
        <Root defaultValue={PORTFOLIO}>
            <div className="flex justify-between">
                {/* <EditorUndoRedoButtons {...props} /> */}
                <List className="flex gap-x-2 rounded-xl bg-slate-50 p-1 text-sm font-semibold text-gray-600 outline-none">
                    {tabs.map(tab => (
                        <Trigger
                            className="data-[state='active']:tab-shadow data-disabled:cursor-not-allowed data-disabled:text-gray-400 h-7 w-32 rounded-lg  transition duration-300 data-[state='active']:bg-gray-50 data-[state='active']:text-gray-900"
                            key={tab}
                            value={tab}
                        >
                            {tab}
                        </Trigger>
                    ))}
                </List>
                <EditorActionButtons
                    onClose={onClose}
                    onExport={onExport}
                    onShowRevisionHistory={onShowRevisionHistory}
                    onSwitchboardLinkClick={onSwitchboardLinkClick}
                />
            </div>
            <div className="mt-3 rounded-md bg-slate-50 p-8">
                <Content value="Portfolio">
                    <PortfolioTab />
                </Content>
                <Content value="Transactions">
                    <TransactionsTab />
                </Content>
                <Content value="Other">
                    <OtherTab />
                </Content>
            </div>
        </Root>
    );
}
