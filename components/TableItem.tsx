import Link from 'next/link'
import React from 'react'

const TableItem = ({children, href}: {
    children: any,
    href?: string,
}) => {
    return href ? (
        <Link href={href}>
            <a className="text-base btm-text-gray-500">{children}</a>
        </Link>
    ) : (
        <div>
            <p className="text-base btm-text-gray-500">{children}</p>
        </div>
    )
}

export default TableItem
