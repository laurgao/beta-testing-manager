const Tabs = ({state, setState, displayedTabs, className}: {state: string, setState: any, displayedTabs: string[], className?: string}) => {
    return (
        <>
            {displayedTabs.map(t => (
                <button 
                    className={`focus:outline-none ${t.toLowerCase()==state ? "btm-text-gray-700 font-bold border-b-2 btm-gray-700-border" : "btm-text-gray-400 font-normal"} ${className && className} mr-6`}
                    onClick={() => setState(t.toLowerCase())}
                    key={t}
                >{t}</button>
            ))}
        </>
    )
}

export default Tabs
