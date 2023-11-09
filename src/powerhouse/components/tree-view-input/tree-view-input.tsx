import React, { useLayoutEffect, useRef, useState } from 'react';
import { useKeyboard } from 'react-aria';
import { Button, Input, PressEvent, TextField } from 'react-aria-components';
import ClickAwayListener from 'react-click-away-listener';
import { twMerge } from 'tailwind-merge';

export interface TreeViewInputProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
    cancelIcon?: React.ReactNode;
    submitIcon: React.ReactNode;
    initialValue?: string;
    placeholder?: string;
    onCancel?: () => void;
    onSubmit: (value: string, event?: PressEvent) => void;
    'aria-label'?: string;
}

export const TreeViewInput: React.FC<TreeViewInputProps> = props => {
    const {
        submitIcon,
        cancelIcon,
        onSubmit,
        onCancel,
        className,
        style,
        placeholder,
        'aria-label': ariaLabel,
        initialValue = '',
        ...containerProps
    } = props;

    const [text, setText] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useLayoutEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 500);
    }, []);

    const { keyboardProps } = useKeyboard({
        onKeyUp(e) {
            if (e.key === 'Enter') {
                onSubmit(text);
            }
            if (e.key === 'Escape') {
                onCancel?.();
            }
        },
    });

    return (
        <ClickAwayListener onClickAway={() => onSubmit(text)}>
            <div
                className={twMerge(
                    'flex items-center justify-between pr-1 w-full',
                    className,
                )}
                style={{
                    ...style,
                }}
                {...keyboardProps}
                {...containerProps}
            >
                <TextField
                    className="flex ml-2 min-w-0"
                    value={text}
                    onChange={setText}
                    aria-label={ariaLabel}
                    autoFocus
                >
                    <Input
                        className="flex flex-1 outline-none bg-inherit min-w-0"
                        placeholder={placeholder}
                        ref={inputRef}
                    />
                </TextField>
                <div className="flex flex-row items-center">
                    <Button
                        className="outline-none"
                        onPress={e => onSubmit(text, e)}
                    >
                        {submitIcon}
                    </Button>
                    {cancelIcon && (
                        <Button
                            onPress={onCancel}
                            className="outline-none ml-1"
                        >
                            {cancelIcon}
                        </Button>
                    )}
                </div>
            </div>
        </ClickAwayListener>
    );
};
