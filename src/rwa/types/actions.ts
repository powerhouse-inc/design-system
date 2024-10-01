import {
    AccountFormInputs,
    AssetFormInputs,
    FixedIncomeTypeFormInputs,
    GroupTransactionFormInputs,
    ServiceProviderFeeTypeFormInputs,
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

export type DispatchEditorAction = (action: EditorAction) => void;
