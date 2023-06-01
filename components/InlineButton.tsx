import Link from "next/link";

const InlineButton = ({ onClick, children, href, isLoading, isDisabled, className }: {
    onClick?: any,
    children: string,
    href?: string,
    isLoading?: boolean,
    isDisabled?: boolean,
    className?: string,
}) => {
    return (
        <button
            disabled={isLoading || isDisabled}
            className={`btm-text-gray-500 rounded px-1 py-0.5 text-sm transition font-bold hover:bg-gray-50 focus:outline-none disabled:cursor-not-allowed ${className && className}`}
            onClick={onClick}
        >
            {href ? (
                <Link href={href}>
                    {children}
                </Link>
            ) : (
                <div className="flex items-center">
                    {children}
                </div>
            )}
        </button>
    )
}

export default InlineButton
