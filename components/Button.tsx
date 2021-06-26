import Link from "next/link";

const Button = ({onClick, children, href, isDisabled, isLoading, className}: 
    {onClick?: any, 
        children: any, 
        href?: string,
        isDisabled?: boolean,
        isLoading?: boolean,
        className?: string,
    }) => {
    return (
        <>
            <button
                disabled={isLoading || isDisabled}
                className={`px-4 h-11 transition font-semibold text-sm disabled:opacity-25 disabled:cursor-not-allowed ${className && className}`}
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
            {isLoading && (
                <div className="up-spinner"/>
            )}
        </>
)}

export default Button