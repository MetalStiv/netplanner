import { useMemo, useRef } from 'react';

export type ClickHandler = (e: React.MouseEvent<HTMLElement>, ...params: any | undefined) => void;

export function useClickAndDoubleClickHandler(onSingleClick: ClickHandler, onDoubleClick: ClickHandler, latency = 250) {
    const clickCount = useRef(0);

    const clickHandler = useMemo(() => {
        return (event: React.MouseEvent<HTMLElement>, ...params: any | undefined) => {
            clickCount.current += 1;
            setTimeout(function () {
                if (clickCount.current === 1) {
                    onSingleClick(event, ...params);
                } else if (clickCount.current === 2) {
                    onDoubleClick(event, ...params);
                }
                clickCount.current = 0;
            }, latency);
        };
    }, [onSingleClick, onDoubleClick, latency]);

    return clickHandler;
}