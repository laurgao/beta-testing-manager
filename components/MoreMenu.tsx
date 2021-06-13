import React, {ReactNode, useEffect, useRef, useState} from "react";
import {FiMoreVertical} from "react-icons/fi";

export default function MoreMenu({children, className = "", customButton, openMenuClassName=""}: {children: ReactNode, customButton?: ReactNode, className?: string, openMenuClassName?: string}) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onWindowClick(e) {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
        }

        window.addEventListener("click", onWindowClick);

        return () => window.removeEventListener("click", onWindowClick);
    }, []);

    return (
        <div className={`relative ${className}`} ref={ref}>
            <button className="p-2 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
                {customButton || <FiMoreVertical/>}
            </button>
            {isOpen && (
                <div className={`absolute top-10 right-0 bg-white rounded-md shadow-lg z-20 flex flex-col ${openMenuClassName}`}>
                    {children}
                </div>
            )}
        </div>
    );
}