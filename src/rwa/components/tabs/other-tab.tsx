import {
    AccountsTable,
    FixedIncomeTypesTable,
    ServiceProviderFeeTypesTable,
    SPVsTable,
} from '../table';

export function OtherTab() {
    return (
        <div>
            <div>
                <h2 className="mb-2 text-lg font-bold">Accounts</h2>
                <p className="mb-4 text-xs text-gray-600">
                    Add and manage accounts that can be associated with
                    transactions and fees.
                </p>
                <AccountsTable />
            </div>
            <div>
                <h2 className="mb-2 text-lg font-bold">Fixed Income Types</h2>
                <p className="mb-4 text-xs text-gray-600">
                    Add and manage fixed income asset types.
                </p>
                <FixedIncomeTypesTable />
            </div>
            <div>
                <h2 className="mb-2 text-lg font-bold">SPVs</h2>
                <p className="mb-4 text-xs text-gray-600">
                    Add and manage special purpose vehicles (SPVs).
                </p>
                <SPVsTable />
            </div>
            <div>
                <h2 className="mb-2 text-lg font-bold">
                    Service Provider Fee Types
                </h2>
                <p className="mb-4 text-xs text-gray-600">
                    Add and manage service providers and their associated fee
                    types.
                </p>
                <ServiceProviderFeeTypesTable />
            </div>
        </div>
    );
}
