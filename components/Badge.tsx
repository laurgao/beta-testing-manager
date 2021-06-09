import React, {ReactNode} from 'react';

export default function Badge({children, className}: { children: ReactNode, className?: string }) {
    return (
        <p className={"px-3 h-8 flex items-center rounded-full bg-qj-pale-red " + (className || "")}>{children}</p>
    );
}