import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export interface SidebarPanelProps
    extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarPanel({
    className,
    children,
    ...props
}: SidebarPanelProps) {
    const [hasScroll, setHasScroll] = useState(false);

    function checkContentScroll(target: Element) {
        setHasScroll(
            target.scrollHeight - target.scrollTop - target.clientHeight > 1,
        );
    }

    const containerRef = useRef<HTMLDivElement>(null);

    // listen for resize events to update shadow
    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const observer = new ResizeObserver(
            (entries: ResizeObserverEntry[]) => {
                const entry = entries.pop();
                if (!entry) {
                    return;
                }

                const { target } = entry;
                checkContentScroll(target);
            },
        );
        observer.observe(containerRef.current);
        return () => {
            observer.disconnect();
        };
    }, [containerRef.current]);

    return (
        <>
            <div
                className={twMerge(
                    'flex-1 overflow-auto no-scrollbar transition-shadow',
                    className,
                )}
                ref={containerRef}
                onScroll={e => checkContentScroll(e.currentTarget)}
                {...props}
            >
                {children}
            </div>
            {hasScroll && (
                <div
                    className="h-[50px] mt-[-50px] w-full pointer-events-none "
                    style={{
                        boxShadow: 'inset 0px -33px 32px -16px rgba(0,0,0,0.1)',
                    }}
                />
            )}
        </>
    );
}
