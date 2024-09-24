import {
    Account,
    FormInputs,
    ItemDetails,
    ItemDetailsProps,
    useAccountForm,
} from '@/rwa';
import { useEditorContext } from '@/rwa/context/editor-context';
import { memo, useCallback } from 'react';

export function _AccountDetails(props: ItemDetailsProps<Account>) {
    const { tableItem } = props;

    const {
        editorState: {
            serviceProviderFeeTypes,
            transactions,
            principalLenderAccountId,
        },
        operation,
    } = useEditorContext();
    const isPrincipalLenderAccount = tableItem?.id === principalLenderAccountId;

    const { submit, reset, inputs } = useAccountForm({
        item: tableItem,
        operation,
    });

    const formInputs = useCallback(
        () => <FormInputs inputs={inputs} />,
        [inputs],
    );

    const isAllowedToDeleteItem = !isPrincipalLenderAccount;

    const dependentServiceProviderFeeTypes = serviceProviderFeeTypes.filter(
        ({ accountId }) => accountId === tableItem?.id,
    );

    const dependentTransactions = transactions
        .map((t, index) => ({
            ...t,
            txNumber: index + 1,
        }))
        .filter(
            t =>
                t.cashTransaction.accountId === tableItem?.id ||
                t.fixedIncomeTransaction?.accountId === tableItem?.id,
        );

    const dependentItemName =
        dependentServiceProviderFeeTypes.length && dependentTransactions.length
            ? 'service providers and transactions'
            : dependentServiceProviderFeeTypes.length
              ? 'service providers'
              : 'transactions';

    const dependentServiceProviderList = dependentServiceProviderFeeTypes.length
        ? [
              <div className="mb-0.5 font-semibold" key={1}>
                  Service providers:
              </div>,
              ...dependentServiceProviderFeeTypes.map((s, index) => (
                  <div key={index}>{s.name}</div>
              )),
          ]
        : [];

    const dependentTransactionsList = dependentTransactions.length
        ? [
              <div className="mb-0.5 mt-1 font-semibold" key={5}>
                  Transactions:
              </div>,
              ...dependentTransactions.map(t => (
                  <div key={t.id}>Transaction #{t.txNumber}</div>
              )),
          ]
        : [];

    const dependentItemList = [
        ...dependentServiceProviderList,
        ...dependentTransactionsList,
    ];

    const dependentItemProps = {
        dependentItemName,
        dependentItemList,
    };

    const formProps = {
        formInputs,
        dependentItemProps,
        submit,
        reset,
        isAllowedToDeleteItem,
    };

    return <ItemDetails {...props} {...formProps} />;
}

export const AccountDetails = memo(_AccountDetails);
