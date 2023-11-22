import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Mock } from 'vitest';
import { TreeViewInput } from './tree-view-input';

describe('TreeViewInput Component', () => {
    let onSubmit: Mock;
    let onCancel: Mock;

    const props = {
        level: 0,
        'aria-label': 'input',
        icon: 'Icon',
        defaultValue: 'My Documents',
        submitIcon: <div>submit</div>,
        cancelIcon: <div>cancel</div>,
    };

    beforeEach(() => {
        onSubmit = vi.fn();
        onCancel = vi.fn();

        render(
            <TreeViewInput
                {...props}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />,
        );
    });

    it('should match snapshot', () => {
        const { asFragment } = render(
            <TreeViewInput
                aria-label="input-label"
                onSubmit={() => {}}
                onCancel={() => {}}
                defaultValue="My Documents"
                submitIcon={<div>submit</div>}
                cancelIcon={<div>cancel</div>}
            />,
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('should render correctly', () => {
        expect(screen.getByText(props.icon)).toBeInTheDocument();
        expect(
            screen.getByDisplayValue(props.defaultValue),
        ).toBeInTheDocument();
        expect(screen.getByText('submit')).toBeInTheDocument();
        expect(screen.getByText('cancel')).toBeInTheDocument();
    });

    it('should call onSubmit when click submit icon', () => {
        fireEvent.click(screen.getByText('submit'));

        expect(onSubmit).toHaveBeenCalled();
    });

    it('should call onSubmit when press enter key', () => {
        fireEvent.keyUp(screen.getByLabelText('input'), {
            key: 'Enter',
        });

        expect(onSubmit).toHaveBeenCalled();
    });

    it('should call onSubmit when click outside', async () => {
        await waitFor(() => screen.getByText('submit'), {
            timeout: 100,
        });
        fireEvent.click(document.body);

        expect(onSubmit).toHaveBeenCalled();
    });

    it('should call onCancel when click cancel icon', () => {
        fireEvent.click(screen.getByText('cancel'));

        expect(onCancel).toHaveBeenCalled();
    });

    it('should call onCancel when press Esc key', () => {
        fireEvent.keyUp(screen.getByLabelText('input'), {
            key: 'Escape',
        });

        expect(onCancel).toHaveBeenCalled();
    });

    it('should call onSubmit with text value', () => {
        fireEvent.change(screen.getByLabelText('input'), {
            target: { value: 'new value' },
        });

        fireEvent.click(screen.getByText('submit'));
        expect(onSubmit).toHaveBeenCalledWith('new value', expect.anything());
    });
});
