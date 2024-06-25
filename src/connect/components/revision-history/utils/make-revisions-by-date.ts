import { Operation, Revision, Skip } from '../types';

export type RevisionsByDate = Record<string, (Revision | Skip)[] | undefined>;
export function makeRevisionsByDate(operations: Operation[]) {
    const revisionsByDate: RevisionsByDate = {};

    for (let index = 0; index < operations.length; index++) {
        const operation = operations[index];
        const date = operation.timestamp.split('T')[0];

        if (!revisionsByDate[date]) {
            revisionsByDate[date] = [];
        }

        if (operation.skip > 0) {
            revisionsByDate[date]?.push({
                operationIndex: index,
                skipCount: operation.skip,
            });
            index += operation.skip;
            continue;
        } else {
            revisionsByDate[date]?.push({
                revisionNumber: index,
                eventId: operation.index.toString(),
                stateHash: operation.hash,
                operationType: operation.error ? 'Error' : 'Operation',
                operationInput: {},
                address: operation.address,
                timestamp: operation.timestamp,
                signatures: operation.signatures,
                errors: operation.error ? [operation.error] : undefined,
            });
        }

        index += 1;
    }
}
