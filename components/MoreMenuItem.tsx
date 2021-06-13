import { ReactNode } from "react";

export default function MoreMenuItem({text, onClick, icon, className=""}: {text: string, icon?: ReactNode, onClick: () => any, className?: string,}) {
    return (
        <button className={`flex items-center p-4 hover:bg-gray-100 whitespace-nowrap w-full text-left ${className}`} onClick={onClick}>
            {icon ? (
                <>
                    {icon} <span className="ml-2">{text}</span>
                </>
            ) : `${text}`}
        </button>
    )
}