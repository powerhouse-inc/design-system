import {
    Account,
    AccountFormInputs,
    AssetFormInputs,
    FixedIncome,
    FixedIncomeType,
    FixedIncomeTypeFormInputs,
    GroupTransaction,
    GroupTransactionFormInputs,
    ServiceProviderFeeType,
    ServiceProviderFeeTypeFormInputs,
    SPV,
    SPVFormInputs,
} from '@/rwa';

export type EditorAction =
    | { type: 'CREATE_ASSET'; payload: AssetFormInputs }
    | { type: 'CREATE_TRANSACTION'; payload: GroupTransactionFormInputs }
    | { type: 'CREATE_ACCOUNT'; payload: AccountFormInputs }
    | { type: 'CREATE_FIXED_INCOME_TYPE'; payload: FixedIncomeTypeFormInputs }
    | {
          type: 'CREATE_SERVICE_PROVIDER_FEE_TYPE';
          payload: ServiceProviderFeeTypeFormInputs;
      }
    | { type: 'CREATE_SPV'; payload: SPVFormInputs }
    | { type: 'EDIT_ASSET'; payload: AssetFormInputs }
    | { type: 'EDIT_TRANSACTION'; payload: GroupTransactionFormInputs }
    | { type: 'EDIT_ACCOUNT'; payload: AccountFormInputs }
    | { type: 'EDIT_FIXED_INCOME_TYPE'; payload: FixedIncomeTypeFormInputs }
    | {
          type: 'EDIT_SERVICE_PROVIDER_FEE_TYPE';
          payload: ServiceProviderFeeTypeFormInputs;
      }
    | { type: 'EDIT_SPV'; payload: SPVFormInputs }
    | { type: 'DELETE_ASSET'; payload: { id: string } }
    | { type: 'DELETE_TRANSACTION'; payload: { id: string } }
    | { type: 'DELETE_ACCOUNT'; payload: { id: string } }
    | { type: 'DELETE_FIXED_INCOME_TYPE'; payload: { id: string } }
    | {
          type: 'DELETE_SERVICE_PROVIDER_FEE_TYPE';
          payload: { id: string };
      }
    | { type: 'DELETE_SPV'; payload: { id: string } };

export type FormInputsByTableName = {
    ASSET: AssetFormInputs;
    TRANSACTION: GroupTransactionFormInputs;
    ACCOUNT: AccountFormInputs;
    FIXED_INCOME_TYPE: FixedIncomeTypeFormInputs;
    SERVICE_PROVIDER_FEE_TYPE: ServiceProviderFeeTypeFormInputs;
    SPV: SPVFormInputs;
};

export type FormInputsByActionType = {
    CREATE_ASSET: AssetFormInputs;
    EDIT_ASSET: AssetFormInputs;
    DELETE_ASSET: AssetFormInputs;
    CREATE_TRANSACTION: GroupTransactionFormInputs;
    EDIT_TRANSACTION: GroupTransactionFormInputs;
    DELETE_TRANSACTION: { id: string };
    CREATE_ACCOUNT: AccountFormInputs;
    EDIT_ACCOUNT: AccountFormInputs;
    DELETE_ACCOUNT: { id: string };
    CREATE_FIXED_INCOME_TYPE: FixedIncomeTypeFormInputs;
    EDIT_FIXED_INCOME_TYPE: FixedIncomeTypeFormInputs;
    DELETE_FIXED_INCOME_TYPE: { id: string };
    CREATE_SERVICE_PROVIDER_FEE_TYPE: ServiceProviderFeeTypeFormInputs;
    EDIT_SERVICE_PROVIDER_FEE_TYPE: ServiceProviderFeeTypeFormInputs;
    DELETE_SERVICE_PROVIDER_FEE_TYPE: { id: string };
    CREATE_SPV: SPVFormInputs;
    EDIT_SPV: SPVFormInputs;
    DELETE_SPV: { id: string };
};

export type FormReturnsByActionType = {
    CREATE_ASSET: FixedIncome;
    EDIT_ASSET: FixedIncome;
    DELETE_ASSET: undefined;
    CREATE_TRANSACTION: GroupTransaction;
    EDIT_TRANSACTION: GroupTransaction;
    DELETE_TRANSACTION: undefined;
    CREATE_ACCOUNT: Account;
    EDIT_ACCOUNT: Account;
    DELETE_ACCOUNT: undefined;
    CREATE_FIXED_INCOME_TYPE: FixedIncomeType;
    EDIT_FIXED_INCOME_TYPE: FixedIncomeType;
    DELETE_FIXED_INCOME_TYPE: undefined;
    CREATE_SERVICE_PROVIDER_FEE_TYPE: ServiceProviderFeeType;
    EDIT_SERVICE_PROVIDER_FEE_TYPE: ServiceProviderFeeType;
    DELETE_SERVICE_PROVIDER_FEE_TYPE: undefined;
    CREATE_SPV: SPV;
    EDIT_SPV: SPV;
    DELETE_SPV: undefined;
};

export type DispatchEditorAction = (
    action: EditorAction,
) => FormReturnsByActionType[EditorAction['type']] | undefined;
