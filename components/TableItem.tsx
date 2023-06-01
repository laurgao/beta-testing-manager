import Link from "next/link";
import Truncate from "./Truncate";

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
        <Link href={href} className={classes}>
            {truncate ? <Truncate length={tl}>{children}</Truncate> : `${children}`}
        </Link>
    ) : (
        <p className={classes}>
            {truncate ? <Truncate length={tl}>{children}</Truncate> : `${children}`}
        </p>
    )
}

export default TableItem
