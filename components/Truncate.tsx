import React from 'react'

const Truncate = ({children, length=10, className=""}: {children: string, length?: number, className?: string}) => {
    return (
        <span className={className}>{children.length > length ? `${children.substring(0, length)}...` : children}</span>
    )
}

export default Truncate
