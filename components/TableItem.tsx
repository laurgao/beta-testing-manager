import Link from 'next/link'
import React from 'react'

const TableItem = ({children, href, truncate}: {
    children: string,
    href?: string,
    truncate?: boolean
}) => {
    return href ? (
        <Link href={href}>
            <a className="text-base btm-text-gray-500">{truncate && children.length > 7 ? `${children.substring(0, 7)}...` : children}</a>
        </Link>
    ) : (
        <div>
            <p className="text-base btm-text-gray-500">{truncate && children.length > 7 ? `${children.substring(0, 7)}...` : children}</p>
        </div>
    )
}

export default TableItem
