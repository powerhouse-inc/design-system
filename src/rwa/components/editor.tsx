import { ModalManager } from './modal/modal-manager';
import { RWATabs } from './tabs';

export function Editor() {
    return (
        <ModalManager>
            <RWATabs />
        </ModalManager>
    );
}
