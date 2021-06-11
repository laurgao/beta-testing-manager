import Link from 'next/link'
import React from 'react'

const TableItemMain = ({children, href, className}: {
    children: any,
    href?: string,
    className?: string,
}) => {
    return (
        <p className={`text-base btm-text-gray-500 font-semibold text-left py-2 ${className && className}`}>
            {href ? (
                <Link href={href}><a>{children}</a></Link>
            ) : (
                <span>{children}</span>
            )}
        </p>
    )
}

export default TableItemMain
