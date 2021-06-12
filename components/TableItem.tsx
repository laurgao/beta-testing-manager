import Link from 'next/link'
import React from 'react'

const TableItem = ({children, href, truncate, wide, main, className}: {
    children: string,
    href?: string,
    truncate?: boolean,
    wide?: boolean,
    main?: boolean,
    className?: string,
}) => {
    const tl = wide ? 30 : 7; // truncate length
    const classes = main ? `text-base btm-text-gray-500 font-semibold text-left py-2 ${className && className}` : `text-base btm-text-gray-500 ${className && className}`
    return href ? (
        <Link href={href}>
            <a className={classes}>{truncate && children.length > tl ? `${children.substring(0, tl)}...` : children}</a>
        </Link>
    ) : (
        <div>
            <p className={classes}>{truncate && children.length > tl ? `${children.substring(0, tl)}...` : children}</p>
        </div>
    )
}

export default TableItem
