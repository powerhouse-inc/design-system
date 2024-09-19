/** Allows using forward ref with generics.
 * @see: https://www.totaltypescript.com/forwardref-with-generic-components
 */

import { ReactNode, Ref, RefAttributes, forwardRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function fixedForwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactNode,
): (props: P & RefAttributes<T>) => ReactNode {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return forwardRef(render) as any;
}
